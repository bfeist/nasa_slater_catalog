# Architecture & Data Management Reference

_Current as of March 2026. The app has matured past its exploratory phase: the
database is the live data store, Excel spreadsheets are the archival source material,
and `/data` is a scratch space for prototype/pipeline output._

---

## What This Project Actually Is Now

A local-only catalog and search tool for ~80 TB of archival NASA space-program
video that lives on a local network share at `/o/`. The stack:

- **SQLite** (`database/catalog.db`) — single source of truth for catalog data
- **Express** API (`src/server/`) — serves catalog data over HTTP
- **React SPA** (`src/`) — browse and search the catalog
- **Python scripts** (`scripts/`) — populate and maintain the database

The system will never be public. The video files are local. The web app is local.
This informs every architecture decision.

---

## The Source-of-Truth Question

### Is the database or the Excel the source of truth?

**The database is the source of truth. The Excel files are archival source material.**

The database contains things the Excel files never will:

- `alternate_title` — LLM-generated search-friendly rephrasing
- `has_shotlist_pdf` / `shotlist_pdfs` — matched during `1e`
- `has_transfer_on_disk` — confirmed by scanning `/o/` in `1c`
- `ffprobe_metadata` — extracted from video files in `1d`
- `file_annotations` — expert annotations from the review workflow
- all rows from multiple source Excel files merged and normalised
- `nara_citations`, `external_file_refs` — from the First Steps ingest

### Should the Excel import pipeline be maintained?

**Yes. Here is exactly why, and what it buys:**

The ability to rebuild the database from source material means:

1. **The database is auditable.** Every row can be traced to a specific cell
   in a specific spreadsheet. That matters for an archival project.

2. **The Excel files may be updated.** They are living documents owned by someone
   outside this project. If the master list is revised you can re-ingest cleanly
   rather than doing manually-reconciled merges.

3. **Recovery from corruption is cheap.** If the DB is ever in a bad state,
   `uv run python scripts/one_time/1b_ingest_apollomaster_excel.py --force`
   rebuilds the core catalog in minutes. Enrichment passes (1c, 1d, 1e)
   still take hours/overnight, but the base is sound.

### When would you cut free from Excel?

When both of these are true:

- The Excel files are no longer being updated by anyone (archival work is complete)
- You have added a UI or migration path to edit/add film roll records directly
  in the database

That point has not been reached. Until then, ingest scripts are infrastructure,
not dead code.

### The rebuild contract

A full rebuild from source looks like this, in order:

```
# 1. Core catalog from Excel
uv run python scripts/one_time/1b_ingest_apollomaster_excel.py --force
uv run python scripts/one_time/1b_ingest_first_steps.py --force

# 2. Structural fixes applied after initial ingest
uv run python scripts/one_time/1b_backfill_discovery_transfers.py --apply

# 3. Download NARA shotlist PDFs (idempotent, skips already-downloaded)
uv run python scripts/one_time/1b_download_nara_shotlists.py

# 4. Match shotlist PDFs to film_rolls
uv run python scripts/shotlist/1e_match_shotlist_pdfs.py

# 5. Scan /o/ and verify what files are actually on disk (overnight)
uv run python scripts/1c_verify_transfers.py

# 6. Extract ffprobe metadata for confirmed files (overnight)
uv run python scripts/1d_ffprobe_metadata.py

# 7. Re-run LLM alternate title generation  (hours, GPU required)
uv run python scripts/title_gen/generate_alt_titles.py --all

# 8. Rebuild search index (fast)
uv run python scripts/6_build_search_index.py --force
```

The shotlist PDF OCR (`scripts/shotlist/1_ingest_shotlist_pdfs.py`) is NOT part
of the rebuild because its output already lives at `data/01_shotlist_raw/` and
should be kept across rebuilds — re-running is a 10,590-PDF GPU job.

---

## Scripts Inventory

### Status legend

- ✅ **Active** — runs periodically or on new data
- 🔨 **Rebuild tool** — run only when rebuilding DB from source
- ✋ **One-time, done** — has already run; output is in DB or static_assets
- 🔬 **Prototype** — exploratory/evaluation work, output in /data

### Root-level scripts

| Script                    | Status    | Purpose                                                                           |
| ------------------------- | --------- | --------------------------------------------------------------------------------- |
| `1c_verify_transfers.py`  | ✅ Active | Scans `/o/` READ-ONLY, matches files to DB transfers, sets `has_transfer_on_disk` |
| `1d_ffprobe_metadata.py`  | ✅ Active | Probes video metadata for indexed files, incremental                              |
| `6_build_search_index.py` | ✅ Active | Builds static search index from Stage 5 Q&A output (future stages)                |

### `scripts/filename_parser.py` and `scripts/db_resolve.py` — shared modules

| File                 | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `filename_parser.py` | Parses filenames → ranked list of candidate identifiers. Used by `1c`. |
| `db_resolve.py`      | Resolves candidate identifiers → DB transfer rows. Used by `1c`.       |

Previously lived in `scripts/matchers/` as a sub-package. Now at scripts root — `1c` imports them directly via `sys.path` insertion.

### `scripts/one_time/` — ingest / rebuild tools

| Script                               | Status     | Purpose                                                                  |
| ------------------------------------ | ---------- | ------------------------------------------------------------------------ |
| `1b_ingest_apollomaster_excel.py`    | 🔨 Rebuild | Core ingest from ApolloReelsMaster.xlsx                                  |
| `1b_ingest_first_steps.py`           | 🔨 Rebuild | Ingest from First Steps scanning list Excel                              |
| `1b_backfill_discovery_transfers.py` | ✋ Done    | Gap-fill for discovery_capture rows missing from initial ingest          |
| `1b_download_nara_shotlists.py`      | ✋ Done    | Downloaded NARA shotlist PDFs from S3 into `static_assets/shotlist_pdfs` |

`backfill` and `download_nara_shotlists` are effectively one-time but idempotent —
safe to re-run as part of a rebuild since they skip already-processed rows.

### `scripts/nara_scraper/`

| Script            | Status  | Purpose                                                                              |
| ----------------- | ------- | ------------------------------------------------------------------------------------ |
| `nara_scraper.py` | ✋ Done | Scraped NARA catalog pages; output is `input_indexes/nara_apollo_70mm_metadata.json` |

The JSON output is the artifact. The scraper itself never needs to run again
unless the NARA catalog is updated and we want fresh metadata.

### `scripts/shotlist/`

| Script                         | Status       | Purpose                                                                                    |
| ------------------------------ | ------------ | ------------------------------------------------------------------------------------------ |
| `0_spot_check_marker.py`       | 🔬 Prototype | 3-PDF test of marker-pdf OCR quality                                                       |
| `0b_compare_ocr_approaches.py` | 🔬 Prototype | Tested chunked LLM cleanup of OCR output                                                   |
| `0c_spot_check_100.py`         | 🔬 Prototype | 100-PDF stratified sample quality assessment                                               |
| `0d_vlm_fallback_test.py`      | 🔬 Prototype | Tested Qwen2.5-VL on poor-OCR PDFs                                                         |
| `0e_vlm_quant_benchmark.py`    | 🔬 Prototype | Benchmarked Qwen3-VL-8B fp16 vs NF4                                                        |
| `1_ingest_shotlist_pdfs.py`    | ✅ Active    | Batch OCR of all 10,590 shotlist PDFs through marker-pdf, output → `data/01_shotlist_raw/` |
| `1e_match_shotlist_pdfs.py`    | 🔨 Rebuild   | Matches shotlist PDFs to `film_rolls`, updates `has_shotlist_pdf` and `shotlist_pdfs`      |

### `scripts/title_gen/`

| Script                   | Status    | Purpose                                                                    |
| ------------------------ | --------- | -------------------------------------------------------------------------- |
| `generate_alt_titles.py` | ✅ Active | LLM-generates `alternate_title` for each film roll via Ollama; incremental |

### `scripts/files_audit/`

| Script               | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `disk_vs_db.py`      | Compares `/o/` directory listing against `files_on_disk` table; surfaces gaps |
| `excel_export.py`    | Exports unresolved files to `.xlsx` for expert annotation                     |
| `excel_import.py`    | Reads expert-filled `.xlsx` back into `file_annotations` table                |
| _(exports/ removed)_ | `bbc.xlsx` moved to `/data/`                                                  |

---

## The `/data` Folder

`/data` is gitignored scratch space. Nothing in it is source material (that's
`/input_indexes/` and `/static_assets/`). Nothing in it is live catalog data
(that's `/database/`). It is intermediate and prototype output.

### Current contents and status

| Folder                      | Status                               | Notes                                                                                                                         |
| --------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `data/01_shotlist_raw/`     | ⚠️ **Keep — active pipeline output** | 10,590+ PDF OCR results from `1_ingest_shotlist_pdfs.py`. Not in DB yet; future stages will read these. Do not delete.        |
| `data/marker_spot_checks/`  | 🗑️ Discard                           | 3-file prototype output from `0_spot_check_marker.py`. Superseded by spot_check_100.                                          |
| `data/ocr_comparison/`      | 🗑️ Discard                           | 14-file prototype output from `0b_compare_ocr_approaches.py`. Decision made, results documented.                              |
| `data/spot_check_100/`      | 🗑️ Discard                           | 100-PDF sample + `_results.json`. The `0d`/`0e` scripts reference `_results.json` but those are prototype scripts themselves. |
| `data/vlm_fallback/`        | 🗑️ Discard                           | 10-sample VLM test output. Benchmark decision made.                                                                           |
| `data/vlm_quant_benchmark/` | 🗑️ Discard                           | 10-sample quantization benchmark output. Decision made.                                                                       |
| `data/_unused/`             | 🗑️ Discard                           | Old `catalog.db` and `01b_excel.db` from early development. Superseded by `/database/catalog.db`.                             |

**The only folder in `/data` worth keeping is `01_shotlist_raw/`.** Everything
else is prototype evaluation material whose decisions have already been made.

The prototype scripts (`0_*`) arguably belong in a `scripts/archive/` or
`scripts/prototype/` subfolder rather than mixed in with active pipeline scripts —
or they could be deleted since their conclusions are captured in docs.

---

## The `/database` Folder

`database/catalog.db` is the live database. It lives outside git (see `.gitignore`)
because it is large and derived. The SQLite WAL files (`-shm`, `-wal`) are
transactional artifacts.

**Backup strategy:** The database is fully rebuildable from source. For day-to-day
protection, a periodic copy to a separate drive is sufficient. No need for
incremental backup tooling.

---

## Docker Path

If you ever want to containerize the app server (even locally), the natural split is:

```
┌─────────────────────────────────────────┐
│  catalog-app container                  │
│  ├── Node.js Express API                │
│  ├── React SPA (served as static files) │
│  └── mounts:                            │
│       /database/catalog.db  (volume)    │
│       /static_assets/       (read-only) │
│       /o/                   (read-only) │
└─────────────────────────────────────────┘

Python scripts run on the HOST, not in the container.
They write to database/catalog.db and static_assets/.
```

The Python pipeline has heavy ML dependencies (PyTorch, Qwen, marker-pdf,
bitsandbytes) that don't belong in an app server container. Keep them on the host.

A minimal `docker-compose.yml` would look like:

```yaml
services:
  catalog:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./database:/app/database
      - ./static_assets:/app/static_assets:ro
      - /o:/o:ro # local network share
    environment:
      - NODE_ENV=production
```

The Dockerfile would be a standard Node.js image running `npm run build`
(Vite) and then `node dist/server/index.js`. No ML code, no Python.

There is no compelling reason to host this on the public internet. Running a
docker container locally and hitting `localhost:3000` is effectively the same
user experience and avoids all the complexity of remote access to a local 80 TB
drive.

---

## What Still Needs to Be Done

Stages that are described in `pipeline-plan.md` but not yet implemented:

- **Stage 2+**: Parse `data/01_shotlist_raw/` OCR output and load shot-level data
  into the database. This is the big next step — it would make the 10,590 shotlist
  PDFs searchable.
- **Stage 5/6**: Q&A extraction and semantic search index. `6_build_search_index.py`
  exists but expects input that Stage 5 would produce.
- **Expert annotation workflow**: `files_audit/excel_export.py` and
  `excel_import.py` are built but may not have been fully exercised. The `bbc.xlsx`
  export in `scripts/files_audit/exports/` suggests it has been used at least once.

---

## Recommended Cleanup Actions

1. **Delete `data/` prototype folders** (everything except `01_shotlist_raw/`).
   They are safe to delete because they are re-producible experiment outputs.

~~2. Move `scripts/files_audit/exports/bbc.xlsx`~~ ✅ Done — moved to `/data/`.

~~3. Move prototype shotlist scripts (`0_*` family)~~ ✅ Done — moved to `scripts/shotlist/archive/`.

~~4. Move the matchers module to scripts root~~ ✅ Done — `filename_parser.py` and `db_resolve.py` now live at `scripts/` root; imports updated in `1c` and `db_resolve`.

~~1. Delete `data/` prototype folders~~ ✅ Done — `marker_spot_checks`, `ocr_comparison`, `spot_check_100`, `vlm_fallback`, `vlm_quant_benchmark`, `_unused` removed.

5. **`data/01_shotlist_raw/` is getting large.** When Stage 2 runs and loads
   shotlist data into the DB, these files become redundant. Until then, don't
   delete them.
