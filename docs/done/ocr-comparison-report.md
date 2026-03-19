# OCR Quality Comparison: 1a (marker-pdf) vs 1c (LLM vision OCR)

**Date:** 2026-03-19
**Script:** `scripts/shotlist/1e_compare_ocr_quality.py`

## Summary

**Recommendation: Use 1c (LLM OCR) as the primary and sole required source for FTS5 indexing. The 1a (marker-pdf) process can be stopped — it is not needed.**

The LLM vision OCR (Qwen3.5:9b via Ollama) produces cleaner, more search-appropriate text because it deliberately strips form headers, table formatting, and boilerplate content. The marker-pdf OCR faithfully preserves everything on the page, which is counterproductive for search indexing.

## Coverage

| Source                                      | PDFs processed | Notes                        |
| ------------------------------------------- | -------------- | ---------------------------- |
| 1c LLM OCR (`data/01c_llm_ocr/`)            | 9,324          | Complete — all shotlist PDFs |
| 1a marker-pdf OCR (`data/01_shotlist_raw/`) | ~1,383         | Partial — only 13% of PDFs   |

There are **0 marker-only PDFs** — every PDF with marker output also has LLM output. Stopping 1a loses no coverage.

## What marker adds (and why it hurts search)

Analysis of all 1,380 overlapping files:

| Category                  | Avg unique words per file | Example                                                                                |
| ------------------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| Form boilerplate          | 8.4                       | CLASSIFICATION, FOOTAGE, CAMERA, ANGLE, MOTION PICTURE SCENE LOG, DOCUMENTARY          |
| Partial/broken OCR        | varies                    | `foreord` (foreword), `stronaut` (astronaut), `panayision` (panavision), `cdge`, `ght` |
| Legitimate unique content | ~25.9                     | Real words not in LLM output                                                           |

The "legitimate unique content" count is inflated — many of those 25.9 words per file are:

- **OCR partial words** where marker split a word across table columns and failed to fully reconstruct it (e.g., `foreord`, `immunolog`, `kinescop`, `performin`)
- **Table cell fragments** from markdown column boundaries cutting through words
- **Repeated form field labels** not in our boilerplate list (e.g., `kennedy`, `center`, `florida`, `ksc` — location fields on every KSC form)

### Why form boilerplate is harmful to search

Words like `CLASSIFICATION`, `FOOTAGE`, `CAMERA ANGLE`, `DOCUMENTARY MOTION PICTURE SCENE LOG & EVALUATION` appear on virtually every shotlist PDF as form headers. If indexed, they cause:

- **Every reel** to match queries for "footage" or "classification" or "documentary"
- **Ranking pollution** — BM25 scores become meaningless for these ubiquitous terms
- **False relevance** — a user searching "documentary" wants documentary-type content, not every reel that has the word "DOCUMENTARY" in its form header

The 1c LLM OCR was deliberately prompted to strip these headers and extract only content descriptions, which is the correct behavior for search indexing.

## Token overlap analysis

Across 1,380 overlapping files:

- **85.7% average token overlap** — the two sources largely agree on content
- **79% of marker's character advantage** comes from table structure and form boilerplate
- Marker has more alpha characters on average (1,839 vs 818) but most of that is formatting

## Updated merge strategy (1d script)

The `1d_build_fts_index.py` script now uses LLM text as the primary source:

| Strategy      | Count | Description                                                                       |
| ------------- | ----- | --------------------------------------------------------------------------------- |
| `llm-only`    | 7,933 | Only LLM text available (no marker output)                                        |
| `llm-primary` | 227   | Both available; marker adds <10 unique real words — LLM used alone                |
| `llm+marker`  | 1,045 | Both available; marker contributes ≥10 unique real words — appended as supplement |

The `--skip-marker` flag is available to exclude marker data entirely:

```bash
uv run python scripts/shotlist/1d_build_fts_index.py                # LLM primary + marker supplement
uv run python scripts/shotlist/1d_build_fts_index.py --skip-marker  # LLM only
```

## Raw data

The comparison script (`1e_compare_ocr_quality.py`) can reproduce these findings:

```bash
uv run python scripts/shotlist/1e_compare_ocr_quality.py
uv run python scripts/shotlist/1e_compare_ocr_quality.py --detailed  # per-file output
```
