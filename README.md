# Slater Film Catalog

AI-powered cataloging pipeline for archival US space program video footage using local GPU inference (RTX 4090).

## Goals

- Ingest and OCR existing shot list PDFs (scanned typewritten documents from the 1960s)
- Analyze video files with scene detection, visual descriptions, face detection, and OCR
- Produce a fully client-side searchable JSON catalog (no backend/database needed)
- Support incremental updates as new material is acquired

## Setup

```bash
# Install uv if not already available
# https://docs.astral.sh/uv/getting-started/installation/

# Install dependencies (includes CUDA PyTorch)
uv sync
```

## Pipeline Stages

See [docs/pipeline-plan.md](docs/pipeline-plan.md) for the full plan.

| Stage | Script                                       | Status  |
| ----- | -------------------------------------------- | ------- |
| 0     | `scripts/shotlist/0_spot_check_marker.py`    | Done    |
| 1a    | `scripts/shotlist/1a_marker_ocr.py`          | Done    |
| 1b    | `scripts/shotlist/1b_match_shotlist_pdfs.py` | Done    |
| 1b    | `scripts/one_time/1b_ingest_*.py`            | Done    |
| 1c    | `scripts/shotlist/1c_llm_ocr.py`             | Done    |
| 1c    | `scripts/1c_verify_transfers.py`             | Done    |
| 1d    | `scripts/shotlist/1d_build_fts_index.py`     | Done    |
| 1d    | `scripts/1d_ffprobe_metadata.py`             | Done    |
| 2     | `scripts/2_parse_shotlists.py`               | Planned |
| 4     | `scripts/4_analyze_video.py`                 | Planned |

## Project Structure

```
scripts/         # Numbered pipeline scripts
scripts/shotlist/  # OCR, matching, FTS5 index
scripts/one_time/  # Rebuild / ingest tools
docs/            # Pipeline plan and documentation
data/            # All output data (gitignored)
database/        # catalog.db (SQLite — source of truth)
input_indexes/   # Source spreadsheets & metadata
static_assets/   # Shotlist PDFs
```
