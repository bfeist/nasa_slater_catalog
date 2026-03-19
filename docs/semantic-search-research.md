# Semantic Search Research — NASA Slater Catalog

## Current State

**Search today:** FTS5 full-text search with BM25 ranking on `identifier`, `title`, `alternate_title`, `description`, `mission`, and `shotlist_text` columns in SQLite. The Express API server (`src/server/routes/reels.ts`) uses FTS5 MATCH when the `film_rolls_fts` table exists, with LIKE-based substring matching as a fallback. Search results include a `shotlist_snippet` excerpt via FTS5's `snippet()` function and a `search_rank` BM25 score. The API response includes a `search` field indicating the strategy used (`"fts5"`, `"like"`, or `"none"`).

**Data scale:**
| Corpus | Row count | Text quality |
|---|---|---|
| `film_rolls.title` | 43,269 | Every row; avg 56 chars — **primary corpus** |
| `film_rolls.description` | 192 | Effectively empty (Apollo 17 only) |
| `film_rolls.mission` | ~462 | Short mission names |
| `discovery_shotlist.shotlist_raw` | 923 | Rich multi-line timecoded narratives |
| `discovery_timecodes.description` | 4,425 | Short per-shot descriptions |
| Shotlist PDFs (embedded text) | 9,579 matched / ~9,400 have usable text | Shot-by-shot descriptions, subjects, camera angles |

**Stack:** React SPA (Vite build) + Express API server + `better-sqlite3`. In dev, Vite proxies `/api/*` to Express on port 3001. In production, Express serves the built SPA and the API from a single process. Designed for Docker deployment.

**Deployment paths (video archive):**
| Environment | Archive path | Config |
|---|---|---|
| Windows dev (GitBash) | `O:\` or `\\192.168.0.6\NASA Archive` | Default on win32 |
| Docker on archive server | `/archive` (bind-mount) | `VIDEO_ARCHIVE_ROOT=/archive` |
| Docker elsewhere | `/archive` (NFS/CIFS mount) | `VIDEO_ARCHIVE_ROOT=/archive` |

---

## The Problem

Keyword search fails on intent. Real user queries hit these walls:

| User types                      | Wants                             | Keyword match finds                    |
| ------------------------------- | --------------------------------- | -------------------------------------- |
| "spacewalk footage"             | EVA reels                         | Nothing (no row says "spacewalk")      |
| "rocket launch pad"             | KSC launch complex footage        | Only if "launch pad" appears literally |
| "astronaut training underwater" | Neutral buoyancy lab footage      | Nothing                                |
| "lunar module assembly"         | Grumman factory / LM construction | Only exact substring hits              |

Semantic search maps both query and document text into a shared vector space where **meaning** is compared, not characters.

---

## PDF Text Extraction — Embedded OCR (Preferred)

Adobe Acrobat already performed OCR on all 9,579 shotlist PDFs when they were digitized; the resulting text is embedded in each PDF and is selectable in any browser or PDF viewer. **This text can be extracted directly in seconds using PyMuPDF (`fitz`), which is already installed in the Python uv environment.**

A 200-PDF random sample showed:

| Quality tier                 | Count | %   |
| ---------------------------- | ----- | --- |
| Rich text (>500 chars)       | 177   | 88% |
| Minimal text (100–500 chars) | 16    | 8%  |
| Sparse (<100 chars)          | 2     | 1%  |
| Empty (no embedded text)     | 5     | 2%  |

For the ~2% with no embedded text, marker-pdf can be run as a fallback with its `force_ocr` flag to generate fresh OCR. The output of marker — rich markdown tables with pipes, borders, and HTML tags — should be used **only as raw material for text extraction** (stripping all markup), not imported into the database as structured data.

### Text cleaning for indexing

PyMuPDF returns clean plain text with some OCR noise from aged typewriter characters (underscores in place of letters, `_` artifact sequences, etc.). For search indexing this noise is acceptable — embedding models are robust to it. A minimal cleaning pass before indexing:

```python
import re, fitz

def extract_pdf_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    text = "\n".join(page.get_text() for page in doc)
    doc.close()
    # Collapse runs of underscores/punctuation that are OCR artefacts
    text = re.sub(r"[_=\-]{3,}", " ", text)
    # Collapse excessive whitespace
    text = re.sub(r"\s{3,}", "\n", text)
    return text.strip()
```

For marker-pdf fallback (`force_ocr` on empty PDFs), strip all markdown before indexing:

```python
def clean_marker_text(markdown: str) -> str:
    text = re.sub(r"\|", " ", markdown)           # table pipes
    text = re.sub(r"<[^>]+>", " ", text)          # HTML tags
    text = re.sub(r"#{1,6}\s*", "", text)          # headings
    text = re.sub(r"\*{1,2}([^*]+)\*{1,2}", r"\1", text)  # bold/italic
    text = re.sub(r"\s{2,}", " ", text)
    return "\n".join(ln for ln in text.splitlines() if len(ln.strip()) > 5)
```

> **Note:** `data/01c_llm_ocr/` contains 9,324 LLM vision OCR outputs from Stage 1c — this is the **primary OCR source** for the FTS5 index. `data/01_shotlist_raw/` contains ~1,383 marker-pdf OCR outputs from Stage 1a (now superseded). The `scripts/shotlist/1d_build_fts_index.py` script uses LLM text as primary and optionally includes marker text as a supplement when it contributes meaningful unique content. Use `--skip-marker` to exclude marker data entirely. See [`docs/done/ocr-comparison-report.md`](done/ocr-comparison-report.md) for the full quality comparison.

---

## Search Architecture — Recommended Plan

All search happens server-side. Results are always film roll records — the relationship between a PDF and its reel is established at index-build time. A user searching "welders painters trailers" can be shown FR-0146 even though none of those words appear in its title.

### Option A: SQLite FTS5 (quick win)

```sql
CREATE VIRTUAL TABLE film_rolls_fts USING fts5(
    identifier, title, description, mission, shotlist_text,
    content='film_rolls', content_rowid='rowid'
);
```

`shotlist_text` is a new column populated by the index-build script with the cleaned embedded PDF text (plus discovery shotlist text). Once populated, the existing `reels.ts` search query switches from `LIKE` to `MATCH` with BM25 ranking.

**Pros:** Zero new runtime dependencies; FTS5 is built into `better-sqlite3`. Instant improvement for keyword queries and identifier lookups. Easy to rebuild as more text is indexed.

**Cons:** Still keyword-based. "spacewalk" won't match "EVA". No semantic understanding.

**Verdict:** ✅ Implement first. Clear quick win, and FTS5 is required infrastructure for the hybrid approach anyway.

### Option B: Server-Side Vector Embeddings via sqlite-vec

1. **Build time (Python):** For each reel, assemble a search document (title + mission + shotlist_text + discovery text), encode with `all-MiniLM-L6-v2` → store 384-dim embedding in `film_rolls_vec` via the `sqlite-vec` extension.
2. **Query time (Express):** Embed the user query server-side with `onnxruntime-node` (~50ms), then run a combined SQL query that joins vector nearest-neighbours with normal SQL filters.

```sql
CREATE VIRTUAL TABLE film_rolls_vec USING vec0(embedding float[384]);

-- At query time:
SELECT fr.identifier, fr.title, v.distance
FROM film_rolls_vec v
JOIN film_rolls fr ON fr.rowid = v.rowid
WHERE v.embedding MATCH ?        -- bind Float32Array query vector
ORDER BY v.distance
LIMIT 20;
```

**Pros:** Handles synonym / intent queries ("spacewalk" → EVA reels). No browser-side model. Works entirely within the existing SQLite file.

**Cons:** Adds `onnxruntime-node` (~40 MB) and ONNX model files (~30 MB) to the server. `sqlite-vec` is a native extension that must be available in the Docker image.

**Verdict:** ✅ Recommended end-state. Implement after FTS5 is working.

### Option C: Hybrid FTS5 + Vector (best of both)

Run both at query time. Merge results using reciprocal rank fusion. The frontend calls one endpoint and gets a single ranked list. Keyword precision for identifiers and acronyms; semantic reach for intent queries.

**Verdict:** ✅ This is the target architecture. FTS5 and vector search complement each other — one excels where the other fails.

---

## UX: Showing Results Matched via Shotlist Text

When a search term is found in a shotlist PDF but not in the reel's title, the result list shows the film roll as normal — title, identifier, date. The user typed something that isn't visible in what they're seeing.

**Options, roughly ordered by implementation cost:**

1. **Do nothing (acceptable baseline).** The result appears in the list. Users familiar with the domain will understand that a reel can contain subjects not reflected in its title. The ranking signal is the important thing — a reel whose shotlist contains "welders painters" should rank above an unrelated reel.

2. **Match source badge.** Add a small pill/tag to each result card: `matched in shotlist` vs `matched in title`. The API already knows which field drove the match — in FTS5 this comes from `highlight()` or `snippet()` auxiliary functions; in vector search it's derivable from whether the title alone scored high. Low frontend cost; high user transparency.

3. **Snippet / highlight.** Use FTS5's `snippet(film_rolls_fts, column_index, '<b>', '</b>', '…', 8)` to return a context excerpt around the matched term. The API includes this in the result object; the UI renders it as a grey subline under the title. Users see exactly what triggered the match. **This is the highest-value UX improvement for the lowest engineering cost once FTS5 is in place.**

4. **Shotlist preview panel.** Clicking a result opens an inline accordion showing the first few lines of the raw shotlist text. Goes well with the existing PDF viewer.

**Recommendation:** Option 3 (FTS5 snippet) is implemented — the API returns `shotlist_snippet` in FTS5 search results. Frontend rendering of this snippet as a subline under the title is available.

---

## Implementation Plan

### Phase 1: FTS5 + Shotlist Text Column — DONE

1. **`scripts/shotlist/1d_build_fts_index.py`** (implemented):
   - Reads LLM OCR text from `data/01c_llm_ocr/` as primary source
   - Optionally includes marker-pdf text from `data/01_shotlist_raw/` as supplement (when ≥10 unique real words, excluding form boilerplate)
   - Use `--skip-marker` to exclude marker data entirely
   - Writes cleaned text to `film_rolls.shotlist_text`
   - Also pulls `discovery_shotlist.shotlist_raw` for any matched identifiers and appends
   - Creates `film_rolls_fts` virtual table over `(identifier, title, alternate_title, description, mission, shotlist_text)`

2. **`src/server/routes/reels.ts`** (implemented): when `q` is present, uses `film_rolls_fts MATCH ?` with BM25 ordering. Keeps LIKE as fallback if FTS5 table doesn't exist. Includes `shotlist_snippet` and `search_rank` in FTS5 results.

3. **Snippet support** (implemented): FTS5's `snippet()` returns context excerpts around matched terms in shotlist text. The API includes `shotlist_snippet` in the response.

### Phase 2: sqlite-vec Semantic Embeddings (1-2 days)

1. **`scripts/6_build_search_index.py`** (rewrite):
   - Read `film_rolls` + `shotlist_text` column from `catalog.db`
   - Assemble per-reel search document: title + mission + shotlist_text (first ~512 tokens)
   - Generate embeddings with `sentence-transformers all-MiniLM-L6-v2` (batch, GPU if available)
   - Load `sqlite-vec` extension; write embeddings to `film_rolls_vec` table in `catalog.db`
   - Rebuild whenever shotlist_text is updated (idempotent — just recreate the table)

2. **`npm install onnxruntime-node sqlite-vec`**

3. **`src/server/services/embeddings.ts`** (new):
   - Load ONNX model once at startup from `data/models/all-MiniLM-L6-v2/`
   - Export `embed(text: string): Promise<Float32Array>`

4. **`src/server/routes/search.ts`** (new):
   - `GET /api/search?q=&page=&limit=&has_transfer=&quality_bucket=`
   - Runs FTS5 and vector queries in parallel; merges with reciprocal rank fusion
   - Returns film roll records (same shape as `/api/reels`)
   - Accepts same filter parameters as `/api/reels`

### Phase 3: Enrichment (incremental, no architecture changes)

As library coverage grows the index becomes richer automatically:

- Re-run `1d_build_fts_index.py` as more PDFs are processed
- Re-run `6_build_search_index.py` to regenerate embeddings
- Consider LLM-generated one-sentence summaries for reels that still only have a title after PDF extraction

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                  BUILD TIME (Python)                      │
│                                                          │
│  1a: marker-pdf OCR ─▶ data/01_shotlist_raw/*.json       │
│  1c: Qwen3.5 LLM OCR ─▶ data/01c_llm_ocr/*.json        │
│           │                    │                         │
│           └────────┬───────────┘                         │
│                    ▼                                     │
│  1d: dual-source merge (union / rescue / safe)           │
│        + discovery_shotlist text                         │
│                    │                                     │
│                    ▼                                     │
│       film_rolls.shotlist_text  (ALTER TABLE)  ✅ DONE    │
│                    │                                     │
│              ┌─────┴──────────────────┐                  │
│              ▼                        ▼                  │
│    FTS5 virtual table ✅     sentence-transformers       │
│    film_rolls_fts            all-MiniLM-L6-v2 (384d)     │
│                                      │                  │
│                                      ▼                  │
│                            film_rolls_vec (TODO)         │
│                          (sqlite-vec in catalog.db)      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│             RUNTIME (Express + React SPA)                 │
│                                                          │
│  Browser ──▶ /api/reels?q=                               │
│                    │                                     │
│            ┌───────┴────────┐                            │
│            ▼                ▼ (future)                   │
│       FTS5 MATCH ✅     embed query via                  │
│     + BM25 rank         onnxruntime-node                 │
│     + snippet()         vec_distance_cosine              │
│            │                │                            │
│            │                │                            │
│            └───────┬────────┘                            │
│                    ▼                                     │
│       reciprocal rank fusion (future)                    │
│        or FTS5-only ranking (current)                    │
│                    │                                     │
│                    ▼                                     │
│         film roll records  ──▶  JSON response            │
│         { search: "fts5"|"like"|"none" }                 │
└──────────────────────────────────────────────────────────┘
```

---

## Files to Create / Change

| Phase | File                                        | Change                                                         | Status  |
| ----- | ------------------------------------------- | -------------------------------------------------------------- | ------- |
| 1     | `scripts/shotlist/1d_build_fts_index.py`    | Dual-source merge (marker + LLM) + FTS5 table build            | ✅ Done |
| 1     | `src/server/routes/reels.ts`                | FTS5 MATCH + BM25 ranking + snippet (LIKE fallback)            | ✅ Done |
| 2     | `scripts/6_build_search_index.py` (rewrite) | Extract text from DB, generate embeddings, write to sqlite-vec |         |
| 2     | `package.json`                              | Add `onnxruntime-node`, `sqlite-vec`                           |         |
| 2     | `src/server/services/embeddings.ts` (new)   | ONNX model loader + `embed()` function                         |         |
| 2     | `src/server/routes/search.ts` (new)         | `/api/search` endpoint — FTS5 + vector, merged results         |         |
| 2     | `data/models/`                              | ONNX model files for all-MiniLM-L6-v2                          |         |

---

## Key Decisions

1. ~~**FTS5 snippet in search results?**~~ **Done.** The API returns `shotlist_snippet` via FTS5's `snippet()` function. Frontend rendering as a subline under the title is available.
2. **sqlite-vec in Docker?** The `sqlite-vec` npm package bundles prebuilt `.so`/`.dll` binaries for linux-x64 and win32-x64. Needs verification against the target Docker base image (`node:20-slim`).
3. **Embedding model size:** `all-MiniLM-L6-v2` (384 dims, ~30 MB ONNX) is the right choice. Larger models (768 dims) double storage with marginal gains on short-to-medium length documents.
