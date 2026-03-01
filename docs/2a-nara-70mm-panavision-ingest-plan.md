# NARA 70mm Panavision Collection — Ingest Plan

**Source file:** `input_indexes/nara_apollo_70mm_metadata.json`  
**Primary identifier:** `local_identifier` (e.g. `255-PV-1`)  
**Date drafted:** 2026-02-28  
**Status:** Draft — O:\ deduplication in progress; re-run file scan after dedup completes

---

## 1. Source Data Overview

The JSON file is a scraped export of the NARA online catalog for the series
**"Moving Images Related to the Apollo Missions"** (Record Group 255).  
Each object represents one NARA catalog item — typically one physical film reel
(or a multi-reel set) — in the **255-PV** (Panavision) sub-series.

### 1.1 Fields present in the JSON

| Field                          | Type       | Notes                                                                                        |
| ------------------------------ | ---------- | -------------------------------------------------------------------------------------------- |
| `naid`                         | string     | NARA Archival Identifier (unique, numeric)                                                   |
| `url`                          | string     | Canonical NARA catalog URL                                                                   |
| `title`                        | string     | NARA-assigned title                                                                          |
| `description`                  | string     | Optional long description                                                                    |
| `dates`                        | string[]   | Free-text date strings (creation date + series date range)                                   |
| `access`                       | string     | e.g. `"Unrestricted"`                                                                        |
| `use_restriction.status`       | string     | e.g. `"Possibly Restricted"`                                                                 |
| `use_restriction.type`         | string     | e.g. `"Copyright"`                                                                           |
| `use_restriction.note`         | string     | Free-text restriction note                                                                   |
| `creator`                      | string     | Creating agency with date range                                                              |
| `national_archives_identifier` | string     | Same as `naid`                                                                               |
| `local_identifier`             | **string** | **Primary key** — e.g. `255-PV-7`                                                            |
| `agency_assigned_identifiers`  | object[]   | Array of `{value, note}` — roll numbers, Technicolor/Panavision numbers                      |
| `object_designator`            | string     | Reel position, e.g. `"Reel 1 of 2"`                                                          |
| `archived_copy_location`       | string     | Physical location at NARA                                                                    |
| `digital_objects`              | object[]   | Array of `{download_url}` (mp4) and optionally `{type:"document", url, text}` (shotlist PDF) |
| `part_of.record_group.number`  | string     | Always `"255"`                                                                               |
| `part_of.record_group.title`   | string     | Always `"Records of the National Aeronautics and Space Administration"`                      |
| `part_of.series`               | string     | Always `"Moving Images Related to the Apollo Missions"`                                      |
| `tag_count`                    | int        | NARA community tags                                                                          |
| `comment_count`                | int        | NARA community comments                                                                      |

### 1.2 Key observations

- **`local_identifier`** is the stable, human-readable ID used throughout the
  physical collection and on the O:\ drive. It is the correct primary key.
- **`agency_assigned_identifiers`** contains two distinct identifier types:
  - _Technicolor/Panavision Roll Number_ — a numeric code (e.g. `"1879"`)
  - _Roll number_ — a KSC/NASA production roll code (e.g. `"KSC-67-08-001"`)
    These should be stored as separate typed fields, not a generic array.
- **`digital_objects`** mixes two object types (video mp4 and shotlist PDF).
  These should be split into dedicated fields.
- **Multi-reel items**: some items have `object_designator = "Reel 1 of 3"` and
  only the first reel's mp4 is listed. Additional reels are implied but not
  enumerated in the JSON. The O:\ drive has `-r1`, `-r2`, `-r3` variants.
- **`dates`** is free-text and requires parsing. Creation date is usually the
  first element; the series date range is always the last.

---

## 2. Proposed Schema

### 2.1 New table: `nara_pv_items`

```sql
CREATE TABLE IF NOT EXISTS nara_pv_items (
    -- Primary identifier
    local_identifier        TEXT PRIMARY KEY,   -- e.g. "255-PV-7"
    pv_number               INTEGER,            -- Numeric part only (7), for sorting/joining

    -- NARA catalog metadata
    naid                    TEXT UNIQUE,        -- NARA Archival Identifier
    nara_url                TEXT,               -- https://catalog.archives.gov/id/...
    title                   TEXT,
    description             TEXT,               -- NULL if not present

    -- Dates
    date_created            TEXT,               -- ISO date parsed from dates[0], if present
    date_created_raw        TEXT,               -- Original free-text date string
    date_series_range       TEXT,               -- "1967–1969" (from series date string)

    -- Rights
    access                  TEXT,               -- "Unrestricted" etc.
    use_restriction_status  TEXT,               -- "Possibly Restricted" etc.
    use_restriction_type    TEXT,               -- "Copyright" etc.
    use_restriction_note    TEXT,

    -- Creator
    creator                 TEXT,

    -- Physical description
    object_designator       TEXT,               -- "Reel 1 of 2"
    total_reels             INTEGER,            -- Parsed from object_designator
    archived_copy_location  TEXT,

    -- Agency-assigned identifiers (extracted from agency_assigned_identifiers array)
    technicolor_panavision_roll_number  TEXT,   -- Numeric Technicolor/Panavision roll code
    ksc_roll_number                     TEXT,   -- KSC/NASA production roll number(s)

    -- Digital assets — NARA S3 copies
    nara_mp4_url            TEXT,               -- Primary (reel 1) mp4 download URL
    nara_mp4_urls_json      TEXT,               -- JSON array of all reel mp4 URLs
    nara_shotlist_pdf_url   TEXT,               -- Shotlist PDF URL from NARA S3 (if present)

    -- Local master copies on O:\ drive
    o_drive_master_paths_json   TEXT,           -- JSON array of matching file paths found on O:\
    o_drive_master_count        INTEGER DEFAULT 0,
    o_drive_scan_date           TEXT,           -- ISO datetime of last O:\ scan

    -- Local shotlist PDFs on O:\ drive (70mm data folder)
    o_drive_shotlist_pdf_path   TEXT,           -- Path to local shotlist PDF if found

    -- Cross-reference to other tables
    excel_film_roll_id      TEXT,               -- FK → film_rolls.identifier (if matched)

    -- Ingest bookkeeping
    ingested_at             TEXT DEFAULT (datetime('now')),
    updated_at              TEXT DEFAULT (datetime('now'))
);

-- Index for joining to other tables by PV number
CREATE INDEX IF NOT EXISTS idx_nara_pv_number ON nara_pv_items(pv_number);
CREATE INDEX IF NOT EXISTS idx_nara_pv_naid ON nara_pv_items(naid);
```

### 2.2 Additions to existing `film_rolls` table

If a `255-PV-*` item can be matched to an existing `film_rolls` row (via
Technicolor/Panavision roll number or KSC roll number cross-reference), add:

```sql
ALTER TABLE film_rolls ADD COLUMN nara_pv_local_identifier TEXT;
-- e.g. "255-PV-33" — links to nara_pv_items.local_identifier
```

---

## 3. Field Extraction Logic

### 3.1 `pv_number`

```python
import re
m = re.search(r'255-PV-(\d+)', item['local_identifier'], re.IGNORECASE)
pv_number = int(m.group(1)) if m else None
```

### 3.2 `date_created` / `date_created_raw`

```python
# dates[] entries look like:
#   "This item was produced or created on December 21, 1968."
#   "The creator compiled or maintained the parent series,..., between 1967–1969."
for d in item.get('dates', []):
    m = re.search(r'produced or created on (.+?)\.', d)
    if m:
        date_created_raw = m.group(1)
        # parse with dateutil or manual month map
        break
```

### 3.3 `total_reels`

```python
m = re.search(r'Reel \d+ of (\d+)', item.get('object_designator', ''))
total_reels = int(m.group(1)) if m else 1
```

### 3.4 `technicolor_panavision_roll_number` / `ksc_roll_number`

```python
tc_roll = None
ksc_roll = None
for ai in item.get('agency_assigned_identifiers', []):
    note = ai.get('note', '').lower()
    if 'technicolor' in note or 'panavision' in note:
        tc_roll = ai['value']
    elif 'roll number' in note:
        ksc_roll = ai['value']
```

### 3.5 `nara_mp4_url` / `nara_shotlist_pdf_url`

```python
mp4_urls = []
shotlist_pdf_url = None
for obj in item.get('digital_objects', []):
    if obj.get('type') == 'document':
        shotlist_pdf_url = obj.get('url')
    elif 'download_url' in obj:
        mp4_urls.append(obj['download_url'])
nara_mp4_url = mp4_urls[0] if mp4_urls else None
nara_mp4_urls_json = json.dumps(mp4_urls)
```

---

## 4. O:\ Drive File Discovery

### 4.1 Folder scanned

```
O:\Master 5\70mm Panavision Collection\
  (also: /o/Master 5/70mm Panavision Collection/ in GitBash)
```

### 4.2 What was found (scan date: 2026-02-28)

**Total files:** 689 (deduplication in progress — count will decrease)

#### Subfolder structure

| Path                                    | Contents                                                           |
| --------------------------------------- | ------------------------------------------------------------------ |
| `(root)`                                | Primary master `.mov` files for 255-PV series + misc               |
| `255-FR/`                               | 255-FR series masters (different sub-series, not 255-PV)           |
| `65MM SCANS/70mm watermarked/`          | `NASA_NNNN_F_LT_70MM_*.mov` — watermarked scan deliverables        |
| `65MM SCANS/Apollo Marshall Scans/`     | Marshall Space Flight Center 70mm scans (KSC/MSFC/HRC identifiers) |
| `65MM SCANS/_65MM SCANS-A11/03 FLIGHT/` | Apollo 11 flight film 255-PV-179 through 255-PV-183                |
| `70mm data/`                            | Shotlist PDFs and catalog index PDF                                |

#### File naming patterns

**255-PV series masters** (primary interest):

| Pattern                            | Example                         | Notes                        |
| ---------------------------------- | ------------------------------- | ---------------------------- |
| `255-pv-{N}_{date}.mov`            | `255-pv-11_mar30.mov`           | Standard single-reel master  |
| `255-pv-{N}-r{R}_{date}.mov`       | `255-pv-10-r1_mar31.mov`        | Multi-reel, reel R           |
| `255-pv-{N}_prores422hq.mov`       | `255-pv-100_prores422hq.mov`    | ProRes HQ encode             |
| `255-pv-{N}_4K_{date}.mov`         | `255-pv-142_4K_jul6.mov`        | 4K scan                      |
| `255-pv-{N}-rescan.mov`            | `255-pv-106-rescan.mov`         | Rescan (supersedes original) |
| `255-pv-{N}-rescanK.mov`           | `255-pv-93-rescanK.mov`         | Rescan variant               |
| `255-pv-{N}_apr30_RESCAN.mov`      | `255-pv-114_apr30_RESCAN.mov`   | Rescan with date             |
| `255-pv-{N}_2Mbps.mp4`             | `255-pv-78_2Mbps.mp4`           | Low-bitrate proxy            |
| `255-PV-{N}-R{R} - SYNC SOUND.mov` | `255-PV-90-R2 - SYNC SOUND.mov` | Sync sound variant           |

**255-FR series masters** (in `255-FR/` subfolder — different sub-series):

| Pattern                                  | Example                                   |
| ---------------------------------------- | ----------------------------------------- | ------- |
| `255-FR-{N}_HD_MASTER.mov`               | `255-FR-0145_HD_MASTER.mov`               |
| `255-FR-{N}_2K_MASTER.mov`               | `255-FR-8253_2K_MASTER.mov`               |
| `255-FR-{N}_HD_MASTER_DPX_CONFORM.mov`   | `255-FR-8365_HD_MASTER_DPX_CONFORM.mov`   |
| `255-FR-{N}_MASTER_DPX_CONFORM.mov`      | `255-FR-8419_MASTER_DPX_CONFORM.mov`      |
| `255-FR-{N}_HD_MASTER_V2.mov`            | `255-FR-0710_HD_MASTER_V2.mov`            |
| `255-FR-{N}_PARTIAL_HD_MASTER.mov`       | `255-FR-B346_PARTIAL_HD_MASTER.mov`       |
| `255_FR-{N}_DVCPRO_SOURCE_HD_MASTER.mov` | `255_FR-2290_DVCPRO_SOURCE_HD_MASTER.mov` |
| `255-fr-{N}_3K_{date}.mov`               | `255-fr-7593_3K_jun8.mov`                 | 3K scan |

**Other series in root:**

| Pattern                             | Example                          | Notes                      |
| ----------------------------------- | -------------------------------- | -------------------------- |
| `255-hq-199-NEG-r{R}_4K_{date}.mov` | `255-hq-199-NEG-r1_4K_jul27.mov` | HQ negative scans          |
| `255-ksc-69-{N}.mov`                | `255-ksc-69-71287.mov`           | KSC 1969 footage           |
| `255-se-69-{N}.mov`                 | `255-se-69-300.mov`              | SE series                  |
| `255-s-{N}_3K_{date}.mov`           | `255-s-4573_3K_jul5.mov`         | S series                   |
| `OUATIS_EP_1_DELIVERY_SP-F*.mov`    | —                                | Third-party delivery files |

**65MM SCANS — watermarked deliverables:**

Filename: `NASA_{NNNN}_F_LT_70MM_{date}_{PV_number}.mov`  
Example: `NASA_0202_F_LT_70MM_1968.12.21_533.mov`  
The trailing number (e.g. `533`) corresponds to the **Technicolor/Panavision roll number**
in `agency_assigned_identifiers`, not the PV number directly.

**65MM SCANS — Apollo Marshall Scans:**

KSC/MSFC/HRC identifiers — these are a separate collection not directly
indexed by `local_identifier`. Cross-reference via `ksc_roll_number` field.

**70mm data — local shotlist PDFs:**

```
70mm data/255-PV-57.pdf
70mm data/255-PV-58.pdf
70mm data/255-PV-63.pdf
70mm data/255-PV-107.pdf
70mm data/255-PV-112.pdf
70mm data/255-PV-113.pdf
70mm data/255-70mm-Panavision-index-catalog-optimized.pdf  ← master catalog
70mm data/255-72A-2741.pdf
70mm data/255-72A-3376.pdf
```

#### 255-PV coverage on O:\ drive

PV numbers confirmed present (as of 2026-02-28, pre-dedup):

```
1, 2, 4, 5, 9–16, 17–88 (most), 90–116, 117–152, 154–159, 161–191
```

Notable gaps (no file found): 3, 6, 7, 8, 25, 26, 89, 107(?), 112(?), 113(?), 153, 160

> **Note:** Some gaps may be due to deduplication in progress. Re-run the
> discovery script after dedup completes.

---

## 5. Matching Strategy: `local_identifier` → O:\ file

The filename always begins with `255-pv-{N}` (case-insensitive). Match by:

```python
import re
from pathlib import Path

O_DRIVE_ROOT = Path("/o/Master 5/70mm Panavision Collection")

def find_master_files(local_identifier: str) -> list[Path]:
    """Return all O:\ files matching a given local_identifier like '255-PV-7'."""
    m = re.match(r'255-PV-(\d+)', local_identifier, re.IGNORECASE)
    if not m:
        return []
    pv_num = m.group(1)
    pattern = re.compile(
        rf'^255-pv-0*{pv_num}(?:-r\d+)?[_\-]',
        re.IGNORECASE
    )
    results = []
    for f in O_DRIVE_ROOT.rglob("*.mov"):
        if pattern.match(f.name):
            results.append(f)
    for f in O_DRIVE_ROOT.rglob("*.mp4"):
        if pattern.match(f.name):
            results.append(f)
    return sorted(results)
```

**Preference order** when multiple files match the same PV number:

1. `*-rescan*` or `*_RESCAN*` — most recent scan, preferred
2. `*_4K_*` — highest resolution
3. `*_2K_*`
4. `*_prores422hq*`
5. `*_3K_*`
6. Plain `255-pv-{N}.mov` or `255-pv-{N}_{date}.mov`
7. `*_2Mbps.mp4` — proxy only, lowest priority

---

## 6. Ingest Script Plan: `scripts/1f_ingest_nara_pv.py`

```
Stage 1f: Ingest nara_apollo_70mm_metadata.json into SQLite.

Steps:
  1. Parse JSON → validate required fields
  2. For each item:
     a. Extract all fields per §3 above
     b. Scan O:\ drive for matching master files (§5)
     c. Scan O:\ 70mm data/ for matching shotlist PDF
     d. Insert/upsert into nara_pv_items table
  3. Attempt cross-reference to film_rolls table via tc_roll_number
  4. Write summary report

Outputs:
  data/01f_nara_pv.db   — SQLite (or add table to existing 01b_excel.db)
  data/01f_nara_pv_scan.json — raw O:\ scan results (for re-use without re-scanning)

Usage:
  uv run python scripts/1f_ingest_nara_pv.py
  uv run python scripts/1f_ingest_nara_pv.py --force
  uv run python scripts/1f_ingest_nara_pv.py --skip-o-drive   # skip O:\ scan (use cached)
```

---

## 7. Open Questions / Future Work

1. **Multi-reel enumeration**: The JSON only lists reel 1 for multi-reel items.
   Should we enumerate all reels from the O:\ file scan and store them individually?

2. **255-FR cross-reference**: The `255-FR/` subfolder contains a different
   sub-series. These are already partially indexed in `film_rolls` via the Excel
   ingest. A join on Technicolor roll number may link them.

3. **65MM SCANS watermarked**: The `NASA_NNNN_F_LT_70MM_{tc_roll}.mov` files
   can be matched via `technicolor_panavision_roll_number`. Should these be
   stored as an additional `o_drive_watermarked_path` field?

4. **Apollo Marshall Scans**: KSC/MSFC/HRC identifiers — need a separate
   mapping table or cross-reference via `ksc_roll_number`.

5. **Deduplication**: After O:\ dedup completes, re-run `1f_ingest_nara_pv.py`
   with `--force` to refresh `o_drive_master_paths_json` and `o_drive_master_count`.

6. **NARA shotlist PDFs vs local PDFs**: Some items have a NARA S3 shotlist PDF
   URL (`nara_shotlist_pdf_url`) AND a local copy in `70mm data/`. The local
   copy should be preferred for offline use.

7. **`255-PV-90-R2 - SYNC SOUND.mov`**: This file has sync sound — a rare
   attribute. Consider a boolean `has_sync_sound` flag on the file record.
