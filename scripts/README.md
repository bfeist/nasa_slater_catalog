# Scripts — Maintenance Runbook

All commands run from the **repo root** (`f:/_repos/slater-film-catalog`) unless
a different working directory is noted. All Python scripts use `uv run`.

---

## Table of Contents

1. [After moving or deleting files on /o/](#1-after-moving-or-deleting-files-on-o)
2. [After adding new master files to /o/](#2-after-adding-new-master-files-on-o)
3. [Full file-system rescan (disk → DB)](#3-full-file-system-rescan-disk--db)
4. [Re-run ffprobe metadata](#4-re-run-ffprobe-metadata)
5. [Rebuild the FTS5 search index](#5-rebuild-the-fts5-search-index)
6. [Shotlist OCR pipeline (new PDFs)](#6-shotlist-ocr-pipeline-new-pdfs)
7. [Alternate title generation](#7-alternate-title-generation)
8. [Excel catalog export / import](#8-excel-catalog-export--import)
9. [Disk vs database audit](#9-disk-vs-database-audit)
10. [Discovery tape deletion audit](#10-discovery-tape-deletion-audit)
11. [Push to production](#11-push-to-production)

---

## 1. After moving or deleting files on /o/

Run this after any operation that removes or relocates files from `O:/Master 1–4`
or proxy directories — e.g. after using `audit_discovery_tape_coverage.py --move-removable`.

### Step 1 — Re-scan file inventory and match transfers

```bash
uv run python scripts/1c_verify_transfers.py
```

This walks `O:/Master 1–4` and `O:/MPEG-Proxies`, rebuilds the `files_on_disk`
table, and resets `film_rolls.has_transfer_on_disk` flags to reflect what is
actually on disk now.

> Use `--dry-run` to preview changes without writing to the database.

### Step 2 — Purge stale ffprobe records

```bash
uv run python scripts/1d_ffprobe_metadata.py --purge-missing
```

Removes `ffprobe_metadata` rows for files that are no longer on disk.
Use `--dry-run` to preview first:

```bash
uv run python scripts/1d_ffprobe_metadata.py --purge-missing --dry-run
```

### Step 3 — Rebuild the FTS5 index

```bash
uv run python scripts/shotlist/1d_build_fts_index.py
```

Rebuilds the full-text search index so the `has_transfer_on_disk` changes
propagate to search results.

### Step 4 — Push updated database to production

```bash
./scripts/push-db.sh
```

---

## 2. After adding new master files on /o/

When new per-roll master files have been deposited anywhere under `O:/FR-Masters`
or other scan roots:

```bash
# Scan, match, and update has_transfer_on_disk
uv run python scripts/1c_verify_transfers.py

# Probe new files (incremental — skips already-probed files)
uv run python scripts/1d_ffprobe_metadata.py

# Rebuild FTS index
uv run python scripts/shotlist/1d_build_fts_index.py

# Push to production
./scripts/push-db.sh
```

---

## 3. Full file-system rescan (disk → DB)

Rescans the entire `O:/` drive and reports what is on disk vs what the
database knows about.

```bash
# Fast summary per top-level folder (recommended first pass)
uv run python scripts/files_audit/disk_vs_db.py --top-only

# Full recursive walk + CSV of unmatched files
uv run python scripts/files_audit/disk_vs_db.py --csv scripts/files_audit/missing_files.csv

# Scan a single subfolder
uv run python scripts/files_audit/disk_vs_db.py --root "O:/FR-Masters"
```

---

## 4. Re-run ffprobe metadata

Runs `ffprobe` on every video file in `files_on_disk` and stores codec/
resolution/audio metadata.

```bash
# Probe all files not yet probed (incremental, safe to re-run)
uv run python scripts/1d_ffprobe_metadata.py

# Re-probe files that previously errored
uv run python scripts/1d_ffprobe_metadata.py --retry-errors

# Show current stats without probing
uv run python scripts/1d_ffprobe_metadata.py --stats

# Remove records for files no longer on disk (run after 1c rescan)
uv run python scripts/1d_ffprobe_metadata.py --purge-missing
```

---

## 5. Rebuild the FTS5 search index

Merges LLM OCR text + marker OCR text + discovery shotlist text and writes it
into `film_rolls.shotlist_text`, then recreates the FTS5 virtual table.

```bash
# LLM text as primary, marker OCR as supplement (recommended)
uv run python scripts/shotlist/1d_build_fts_index.py

# LLM text only (skip marker OCR)
uv run python scripts/shotlist/1d_build_fts_index.py --skip-marker

# Show current index stats without rebuilding
uv run python scripts/shotlist/1d_build_fts_index.py --stats
```

Safe to re-run at any time — drops and recreates the FTS5 table.

---

## 6. Shotlist OCR pipeline (new PDFs)

Run when new shotlist PDFs have been added to `static_assets/shotlist_pdfs/`.
Pipeline runs in order: `1a → 1b → 1c → 1d`.

```bash
# Stage 1a — Marker-PDF OCR (fast, rule-based)
uv run python scripts/shotlist/1a_marker_ocr.py

# Stage 1b — Match PDFs to film reels in the database
uv run python scripts/shotlist/1b_match_shotlist_pdfs.py

# Stage 1c — LLM vision OCR via Ollama (Qwen) — requires Ollama running locally
uv run python scripts/shotlist/1c_llm_ocr.py

# Stage 1d — Merge OCR sources and rebuild FTS5 index
uv run python scripts/shotlist/1d_build_fts_index.py
```

Each stage is incremental (skips already-processed PDFs). Pass `--force` to
reprocess everything.

---

## 7. Alternate title generation

Generates obfuscated alternate titles for reels using a local Ollama model
(requires Ollama running with `gemma3:12b`).

```bash
# Process all reels that lack an alternate title
uv run python scripts/title_gen/generate_alt_titles.py --all

# Regenerate titles for specific reels
uv run python scripts/title_gen/generate_alt_titles.py --ids FR-0133 FR-5315

# Dry-run (print results without writing to DB)
uv run python scripts/title_gen/generate_alt_titles.py --all --dry-run
```

---

## 8. Excel catalog export / import

Export files for expert annotation and import the filled-in workbook back.

```bash
# Export from scripts/files_audit/
cd scripts/files_audit

# Export files already indexed in the DB (fast)
uv run python excel_export.py --from-db --out exports/expert_review.xlsx

# Export a specific folder with disk walk
uv run python excel_export.py --root "O:/Master 1" --out exports/master1_review.xlsx

# Import a filled-in workbook back into the DB
uv run python excel_import.py exports/expert_review_filled.xlsx

# Dry-run import (preview without writing)
uv run python excel_import.py exports/expert_review_filled.xlsx --dry-run

cd ../..
```

---

## 9. Disk vs database audit

```bash
# Fast folder summary (recommended first pass)
uv run python scripts/files_audit/disk_vs_db.py --top-only

# Include size estimates for folders not in the DB
uv run python scripts/files_audit/disk_vs_db.py --top-only --estimate-sizes
```

---

## 10. Discovery tape deletion audit

Checks which Discovery compilation tapes in `O:/Master 1–4` are fully
superseded by individual per-roll master files and can be deleted.

```bash
cd scripts/one_time

# Generate report only (read-only)
uv run python audit_discovery_tape_coverage.py

# Generate report AND move safe-to-delete tapes to a staging folder
uv run python audit_discovery_tape_coverage.py --move-removable D:\\stephen\\discovery_tapes_to_delete

cd ../..
```

Report is written to `scripts/one_time/docs/discovery-tape-deletion-audit.md`.

After moving tapes, follow the steps in [§1](#1-after-moving-or-deleting-files-on-o)
to update the database.

---

## 11. Push to production

```bash
# Push catalog.db to the production server
./scripts/push-db.sh

# Push auth.config.json (user accounts / key) to production
./scripts/push-auth.sh
```

Both scripts read connection details from `.env` (`PROD_USER`, `PROD_HOST`,
`PROD_PATH_DB`, `PROD_PATH_APPROOT`, `PROD_SSH_KEY`). Defaults fall back to
`bfeist@162.246.19.235`.
