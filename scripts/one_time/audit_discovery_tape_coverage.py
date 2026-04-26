"""
One-time audit: determine which Discovery compilation tapes (in O:/Master 1..4)
can be deleted now that individual film-roll splits exist anywhere on /o/.

Logic:
    1. Recursively scan every "master" location on /o/ EXCEPT the Discovery tape
       folders themselves (Master 1..4 — those ARE what we're considering for
       deletion) and EXCEPT proxy folders (MPEG-Proxies/_premiere/_unused).
       From each filename, extract a normalised film-roll identifier
       (e.g. "255-FR-0047_HD_MASTER.mov" -> "FR-0047",
       "Film 7404 - blah.mov" -> "FR-7404",
       "255-HQAI-58_2K_MASTER.mov" -> "HQAI-58").
    2. For each Discovery tape, build the set of "expected" film rolls from
       BOTH discovery_shotlist.identifier (authoritative per-row tag) AND the
       transfers table (transfer_type='discovery_capture') which already mined
       FR refs out of free-text shotlists.
    3. A tape is SAFE TO DELETE iff every expected roll has a corresponding
       individual master file somewhere on disk. Otherwise it is KEEP and the
       reasons are listed (missing rolls, non-archive identifiers, etc.).

Output: docs/discovery-tape-deletion-audit.md

This script is READ-ONLY against /o/. It only lists files; it never writes,
moves, or deletes anything.

Usage:
    uv run python scripts/one_time/audit_discovery_tape_coverage.py
"""
from __future__ import annotations

import os
import re
import sqlite3
from collections import defaultdict
from pathlib import Path

DB_PATH = "database/catalog.db"
OUTPUT_MD = "docs/discovery-tape-deletion-audit.md"

# Roots to recursively scan for individual per-roll master files.
# The Discovery compilation tapes themselves live in Master 1..4 — those are
# what we are deciding to delete, so they are NOT scanned as splits.
SCAN_ROOTS: list[str] = [
    "O:/FR-Masters",
    "O:/70mm Panavision Collection",
]

# Folder name fragments that mark proxy / non-master content. Any path
# containing one of these (case-insensitive) is skipped during the walk.
EXCLUDE_PATH_FRAGMENTS: tuple[str, ...] = (
    "mpeg-proxies",
    "mpeg_proxies",
    "_premiere",
    "_unused_scripts",
    "_samples",
    "proxy",
    "proxies",
)

# Filename fragments that indicate a proxy file (belt-and-braces in case a
# proxy ends up alongside a master).
EXCLUDE_FILENAME_FRAGMENTS: tuple[str, ...] = (
    "_proxy",
    "-proxy",
    " proxy",
    "_mpeg2",
    "_h264_proxy",
)

VIDEO_EXTS = (".mov", ".mp4", ".mxf", ".mpg", ".m4v")


# ---------------------------------------------------------------------------
# Identifier normalisation
# ---------------------------------------------------------------------------

# Strip a leading "255 " or "255-" or "255_" archive-record-group prefix.
_RG_PREFIX = re.compile(r"^255[\s\-_]+", re.IGNORECASE)

# Trailing tags appended to the bare identifier in split filenames.
_QUALITY_SUFFIX = re.compile(
    r"[_\s\-]+(?:\d+FPS[_\s\-]+)?(?:DVCPRO[_\s\-]+SOURCE[_\s\-]+)?"
    r"(?:HD|2K|4K|SD|UHD)[_\s\-]+MASTER\b.*$",
    re.IGNORECASE,
)

# Aliases: case-insensitive raw prefix -> canonical prefix used in film_rolls.
PREFIX_ALIASES: dict[str, str] = {
    "FILM": "FR",  # some shotlists/filenames call it "Film 7404" instead of "FR-7404"
    "FR": "FR",
    "AK": "AK",
    "HQAI": "HQAI",
    "HQ": "HQ",
    "VJSC": "VJSC",
    "BRF": "BRF",
    "CMP": "CMP",
    "CL": "CL",
    "CS": "CS",
    "KSC": "KSC",
    "LRL": "LRL",
    "ASR": "ASR",
    "VCL": "VCL",
    "EC": "EC",
    "PV": "PV",
    "SL": "SL",
    "SE": "SE",
    "WS": "WS",
    "MSFC": "MSFC",
    "MFC": "MFC",
    "MSC": "MSC",
    "S": "S",
}

# Prefixes for which the numeric body is canonically zero-padded to 4 digits
# (matches how film_rolls.identifier is stored, e.g. FR-0748).
PAD4_PREFIXES: frozenset[str] = frozenset({"FR"})

# Combined regex prefix alternation, ordered longest-first so HQAI beats HQ.
_PREFIX_RE = "|".join(
    sorted(set(PREFIX_ALIASES.keys()) | {"JSC[A-Za-z]*"}, key=len, reverse=True)
)


def _canonical_prefix(raw_prefix: str) -> str:
    upper = raw_prefix.upper()
    if upper.startswith("JSC"):
        # Preserve full JSC variant (JSC, JSCm, JSCmSTS, JSCmND, etc.)
        return raw_prefix
    return PREFIX_ALIASES.get(upper, upper)


def _pad_number(prefix: str, number: str) -> str:
    """Apply prefix-specific zero padding to the leading numeric segment."""
    if prefix not in PAD4_PREFIXES:
        return number
    m = re.match(r"^(\d+)(.*)$", number)
    if not m:
        return number
    body, rest = m.group(1), m.group(2)
    if len(body) < 4:
        body = body.zfill(4)
    return body + rest


def normalise_identifier(raw: str) -> str | None:
    """Normalise any raw identifier string (filename stem, shotlist cell, etc.)
    to the canonical film_rolls.identifier shape used in the database
    (e.g. "FR-0047", "FR-0173-1", "AK-013", "HQAI-58", "S-9560").

    "Film" is treated as an alias for "FR". FR numeric bodies are zero-padded
    to 4 digits.

    Returns None if the input does not look like a parseable archive
    identifier.
    """
    s = raw.strip()
    if not s:
        return None

    s = _RG_PREFIX.sub("", s)
    s = re.sub(r"\.(mov|mp4|mxf|mpg|m4v|avi|mkv)$", "", s, flags=re.IGNORECASE)
    s = _QUALITY_SUFFIX.sub("", s)
    s = s.strip(" -_.")
    if not s:
        return None

    # Drop a leading numeric prefix like "001 - " (tape-sequence numbering).
    s = re.sub(r"^\d{1,4}\s*[-_.]\s*", "", s)

    m = re.match(
        rf"^({_PREFIX_RE})[\s\-_.]*"
        r"([A-Za-z]?\d+(?:[.\-]\d+)?)"
        r"(?:[\s\-_.]+(.*))?$",
        s,
        re.IGNORECASE,
    )
    if not m:
        # Fallback: bare "<letter><digits>" (e.g. "B964", "D504", "A788") with
        # no FR prefix. Discovery shotlists drop the FR-prefix on these — they
        # are stored in film_rolls as e.g. FR-B964, FR-D504.
        m2 = re.match(r"^([A-Za-z])(\d+)(?:[.\-](\d+))?$", s)
        if not m2:
            return None
        letter = m2.group(1).upper()
        digits = m2.group(2)
        sub = m2.group(3)
        body = f"{letter}{digits}"
        if sub:
            body = f"{body}-{sub}"
        return f"FR-{body}"

    prefix = _canonical_prefix(m.group(1))
    number = m.group(2).replace(".", "-")
    number = _pad_number(prefix, number)
    return f"{prefix}-{number}"


def candidate_keys(ident: str) -> set[str]:
    """Return all plausible film_rolls.identifier strings that could match a
    normalised key. Handles "." vs "-" sub-roll separators and 3-vs-4-digit
    zero-padding so lookups hit regardless of which form is stored.
    """
    keys: set[str] = {ident}
    if "." in ident:
        keys.add(ident.replace(".", "-"))
    parts = ident.split("-")
    if len(parts) >= 3 and parts[-1].isdigit() and parts[-2].isdigit():
        keys.add("-".join(parts[:-1]) + "." + parts[-1])

    m = re.match(r"^([A-Za-z]+)-(\d+)(.*)$", ident)
    if m:
        prefix, num, rest = m.group(1), m.group(2), m.group(3)
        for width in (3, 4):
            if len(num) < width:
                keys.add(f"{prefix}-{num.zfill(width)}{rest}")
        if num.startswith("0"):
            keys.add(f"{prefix}-{num.lstrip('0') or '0'}{rest}")
    return keys


# ---------------------------------------------------------------------------
# Filesystem walk
# ---------------------------------------------------------------------------

def _is_excluded_dir(path: str) -> bool:
    pl = path.replace("\\", "/").lower()
    return any(frag in pl for frag in EXCLUDE_PATH_FRAGMENTS)


def _is_excluded_filename(fn: str) -> bool:
    fl = fn.lower()
    return any(frag in fl for frag in EXCLUDE_FILENAME_FRAGMENTS)


def expand_multi_roll_filename(stem: str) -> list[str] | None:
    """Handle filenames packing multiple consecutive rolls into one file,
    e.g. '255-FR-7282,83,84_HD_MASTER' -> ['FR-7282','FR-7283','FR-7284'].
    """
    s = _RG_PREFIX.sub("", stem)
    s = _QUALITY_SUFFIX.sub("", s).strip(" -_.")
    m = re.match(
        rf"^({_PREFIX_RE})[\s\-_.]+"
        r"(\d+)((?:,\d+)+)$",
        s,
        re.IGNORECASE,
    )
    if not m:
        return None
    prefix = _canonical_prefix(m.group(1))
    base = m.group(2)
    suffixes = [x for x in m.group(3).split(",") if x]
    nums = [base] + [
        (base[: len(base) - len(suf)] + suf) if len(suf) < len(base) else suf
        for suf in suffixes
    ]
    return [f"{prefix}-{_pad_number(prefix, n)}" for n in nums]


def scan_master_files(roots: list[str]) -> tuple[
    dict[str, list[tuple[str, str]]], list[tuple[str, str]]
]:
    """Recursively walk roots, returning (ident -> [(rel, root), ...],
    unparseable -> [(rel, root), ...]).
    """
    by_ident: dict[str, list[tuple[str, str]]] = defaultdict(list)
    unparseable: list[tuple[str, str]] = []

    for root in roots:
        if not os.path.isdir(root):
            print(f"  ⚠ scan root not found, skipping: {root}")
            continue

        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [
                d for d in dirnames
                if not _is_excluded_dir(os.path.join(dirpath, d))
            ]
            if _is_excluded_dir(dirpath):
                continue

            for fn in filenames:
                if not fn.lower().endswith(VIDEO_EXTS):
                    continue
                if _is_excluded_filename(fn):
                    continue
                rel = os.path.relpath(os.path.join(dirpath, fn), root)\
                    .replace("\\", "/")
                stem = os.path.splitext(fn)[0]

                multi = expand_multi_roll_filename(stem)
                if multi:
                    for ident in multi:
                        for key in candidate_keys(ident):
                            entry = (rel, root)
                            if entry not in by_ident[key]:
                                by_ident[key].append(entry)
                    continue

                ident = normalise_identifier(stem)
                if ident is None:
                    unparseable.append((rel, root))
                    continue
                for key in candidate_keys(ident):
                    entry = (rel, root)
                    if entry not in by_ident[key]:
                        by_ident[key].append(entry)

    return by_ident, unparseable


# ---------------------------------------------------------------------------
# Audit
# ---------------------------------------------------------------------------

def expected_rolls_per_tape(db: sqlite3.Connection) -> dict[int, dict]:
    info: dict[int, dict] = defaultdict(
        lambda: {
            "fr_rolls": set(),
            "shotlist_rows": 0,
            "blank_rows": 0,
            "unparseable": [],
        }
    )

    for tape, ident in db.execute(
        "SELECT tape_number, identifier FROM discovery_shotlist"
    ):
        d = info[tape]
        d["shotlist_rows"] += 1
        if not ident or not ident.strip():
            d["blank_rows"] += 1
            continue
        for part in re.split(r"[,;/]", ident):
            n = normalise_identifier(part)
            if n is None:
                if part.strip():
                    d["unparseable"].append(part.strip())
            else:
                d["fr_rolls"].add(n)

    for reel, tape_str in db.execute(
        "SELECT reel_identifier, tape_number FROM transfers "
        "WHERE transfer_type='discovery_capture'"
    ):
        try:
            tape = int(tape_str)
        except (TypeError, ValueError):
            continue
        n = normalise_identifier(reel) or reel
        info[tape]["fr_rolls"].add(n)

    return info


def audit(db: sqlite3.Connection) -> dict:
    by_ident, unparseable_files = scan_master_files(SCAN_ROOTS)

    def find_files(roll_ident: str) -> list[tuple[str, str]]:
        seen: set[tuple[str, str]] = set()
        out: list[tuple[str, str]] = []
        for k in candidate_keys(roll_ident):
            for entry in by_ident.get(k, []):
                if entry not in seen:
                    seen.add(entry)
                    out.append(entry)
        return out

    tapes = expected_rolls_per_tape(db)
    safe_to_delete: list[dict] = []
    keep: list[dict] = []

    for tape in sorted(tapes):
        d = tapes[tape]
        expected = sorted(d["fr_rolls"])
        present_map: dict[str, list[tuple[str, str]]] = {}
        missing: list[str] = []
        for r in expected:
            files = find_files(r)
            if files:
                present_map[r] = files
            else:
                missing.append(r)

        reasons: list[str] = []
        if missing:
            reasons.append(f"{len(missing)} expected roll(s) have no master file on disk")
        if d["blank_rows"]:
            reasons.append(
                f"{d['blank_rows']} shotlist row(s) on this tape have a blank "
                "identifier (unknown content)"
            )
        if d["unparseable"]:
            uniq = sorted(set(d["unparseable"]))
            reasons.append(
                f"{len(uniq)} non-archive identifier(s) on this tape "
                f"(e.g. {', '.join(uniq[:3])})"
            )
        if not expected and not d["blank_rows"] and not d["unparseable"]:
            reasons.append("no roll identifiers known for this tape")

        record = {
            "tape": tape,
            "expected_count": len(expected),
            "present_count": len(present_map),
            "present_map": present_map,
            "missing": missing,
            "blank_rows": d["blank_rows"],
            "unparseable": sorted(set(d["unparseable"])),
            "reasons": reasons,
        }
        if reasons:
            keep.append(record)
        else:
            safe_to_delete.append(record)

    return {
        "scan_roots": SCAN_ROOTS,
        "by_ident": by_ident,
        "unparseable": unparseable_files,
        "safe_to_delete": safe_to_delete,
        "keep": keep,
    }


# ---------------------------------------------------------------------------
# Markdown report
# ---------------------------------------------------------------------------

def tape_filename(tape: int) -> str:
    return f"Tape {tape} - Self Contained.mov"


def tape_folder(tape: int) -> str:
    if 501 <= tape <= 562:
        return "Master 1"
    if 563 <= tape <= 625:
        return "Master 2"
    if 626 <= tape <= 712:
        return "Master 3"
    if 713 <= tape <= 886:
        return "Master 4"
    return "?"


def _short_root(root: str) -> str:
    return root.rsplit("/", 1)[-1] or root


def write_report(result: dict, path: str) -> None:
    safe = result["safe_to_delete"]
    keep = result["keep"]
    total = len(safe) + len(keep)
    distinct_idents = len(result["by_ident"])

    lines: list[str] = []
    lines.append("# Discovery Tape Deletion Audit\n")
    lines.append(
        "Audit of which Discovery compilation tapes in `O:/Master 1..4` are "
        "now fully replaced by individual film-roll master files anywhere "
        "else on `/o/`.\n"
    )

    lines.append("## Scan roots\n")
    for r in result["scan_roots"]:
        lines.append(f"- `{r}` (recursive)")
    lines.append(
        "\nExcluded from the scan: any path containing "
        + ", ".join(f"`{x}`" for x in EXCLUDE_PATH_FRAGMENTS)
        + " (proxies and the Discovery-tape Master 1..4 folders themselves)."
    )
    lines.append("")

    lines.append("## Summary\n")
    lines.append(f"- Total Discovery tapes catalogued: **{total}**")
    lines.append(f"- **Safe to delete:** {len(safe)}")
    lines.append(f"- **Keep (incomplete coverage or unknown content):** {len(keep)}")
    lines.append(
        f"- Distinct film-roll identifiers extracted from master filenames: "
        f"{distinct_idents}"
    )
    if result["unparseable"]:
        lines.append(
            f"- Master files whose name could not be parsed to an archive ID: "
            f"{len(result['unparseable'])} (listed at end)"
        )
    lines.append("")

    lines.append("## Methodology\n")
    lines.append(
        "For each Discovery tape, the script computes the set of *expected* "
        "film rolls from two sources:\n\n"
        "1. `discovery_shotlist.identifier` — the per-shotlist-row identifier "
        "column (authoritative when present).\n"
        "2. `transfers` rows of type `discovery_capture` — these already include "
        "FR numbers mined from the free-text `shotlist_raw` column by the "
        "ingest pipeline.\n\n"
        "It then checks whether every expected roll has a matching master file "
        "anywhere in the scan roots above. `Film` is treated as an alias for "
        "`FR`. FR numbers are matched with both 3- and 4-digit zero-padding "
        "(canonical: `FR-0748`). A tape is marked **safe to delete** only when "
        "every expected roll has a master file on disk AND the tape has no "
        "blank/unparseable shotlist rows that would imply unknown content was "
        "on that tape.\n"
    )

    # ---- Safe to delete ----
    lines.append("## ✅ Safe to Delete\n")
    if not safe:
        lines.append("_None._\n")
    else:
        lines.append(
            "These tapes have a per-roll master file on disk for every known "
            "film roll they contain.\n"
        )
        lines.append("| Tape | Folder | File | Rolls covered |")
        lines.append("|-----:|:-------|:-----|--------------:|")
        for r in safe:
            lines.append(
                f"| {r['tape']} | {tape_folder(r['tape'])} | "
                f"`{tape_filename(r['tape'])}` | {r['present_count']} |"
            )
        lines.append("")

        lines.append("### Detail per safe-to-delete tape\n")
        for r in safe:
            lines.append(
                f"#### Tape {r['tape']} — `{tape_folder(r['tape'])}/"
                f"{tape_filename(r['tape'])}`\n"
            )
            for roll in sorted(r["present_map"]):
                files = r["present_map"][roll]
                first_rel, first_root = files[0]
                extra = f" (+{len(files) - 1} more)" if len(files) > 1 else ""
                lines.append(
                    f"- `{roll}` → `{_short_root(first_root)}/{first_rel}`{extra}"
                )
            lines.append("")

    # ---- Keep ----
    lines.append("## ❌ Keep — Cannot Be Deleted\n")
    if not keep:
        lines.append("_None._\n")
    else:
        lines.append(
            "These tapes are missing one or more expected master files, or "
            "contain shotlist content with no parseable archive identifier.\n"
        )
        lines.append("| Tape | Folder | Expected | Present | Missing | Reasons |")
        lines.append("|-----:|:-------|--------:|--------:|--------:|:--------|")
        for r in keep:
            reasons_short = "; ".join(r["reasons"])
            lines.append(
                f"| {r['tape']} | {tape_folder(r['tape'])} | {r['expected_count']} "
                f"| {r['present_count']} | {len(r['missing'])} | {reasons_short} |"
            )
        lines.append("")

        lines.append("### Detail per kept tape\n")
        for r in keep:
            lines.append(
                f"#### Tape {r['tape']} — `{tape_folder(r['tape'])}/"
                f"{tape_filename(r['tape'])}`\n"
            )
            lines.append(
                f"- Expected rolls: **{r['expected_count']}**, "
                f"on disk: **{r['present_count']}**, "
                f"missing: **{len(r['missing'])}**"
            )
            if r["missing"]:
                lines.append(f"- Missing rolls ({len(r['missing'])}):")
                for m in r["missing"]:
                    lines.append(f"  - `{m}`")
            if r["blank_rows"]:
                lines.append(
                    f"- Shotlist rows with blank identifier: {r['blank_rows']} "
                    "(unknown content on this tape)"
                )
            if r["unparseable"]:
                lines.append(
                    f"- Non-archive identifiers on this tape: "
                    f"{', '.join(f'`{u}`' for u in r['unparseable'])}"
                )
            lines.append("")

    # ---- Unparseable files ----
    if result["unparseable"]:
        lines.append("## Unparseable Master Filenames\n")
        lines.append(
            "These files in the scan roots could not be matched to a film-roll "
            "identifier and were not used to satisfy any tape's coverage. "
            "Review them manually.\n"
        )
        for rel, root in result["unparseable"]:
            lines.append(f"- `{_short_root(root)}/{rel}`")
        lines.append("")

    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if not os.path.exists(DB_PATH):
        raise SystemExit(f"Database not found: {DB_PATH}")

    db = sqlite3.connect(DB_PATH)
    print("Scanning master roots for per-roll files:")
    for r in SCAN_ROOTS:
        print(f"  - {r}")
    result = audit(db)

    safe = result["safe_to_delete"]
    keep = result["keep"]
    print(f"\n  distinct identifiers found:    {len(result['by_ident']):>6,d}")
    print(f"  unparseable filenames:         {len(result['unparseable']):>6,d}")
    print(f"  tapes safe to delete:          {len(safe):>6,d}")
    print(f"  tapes to keep:                 {len(keep):>6,d}")

    write_report(result, OUTPUT_MD)
    print(f"\nReport written to: {OUTPUT_MD}")


if __name__ == "__main__":
    main()
