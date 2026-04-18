import { useState, useRef, type JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive,
  faFilePdf,
  faVolumeHigh,
  faCopy,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import type { FilmReel } from "../types";
import { computeQualityLabel, getBucketKey } from "../utils/qualityBuckets";
import styles from "./ReelTable.module.css";

function CopyCell({
  text,
  children,
  cellId,
  activeId,
  setActiveId,
}: {
  text: string;
  children: React.ReactNode;
  cellId: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}): JSX.Element {
  const [copied, setCopied] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setActiveId(cellId);
  };

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => {
      setActiveId(null);
    }, 800);
  };

  const visible = activeId === cellId;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {}
    );
  };

  return (
    <span className={styles.copyCell} onMouseEnter={showTooltip} onMouseLeave={scheduleHide}>
      {children}
      {visible && (
        <span className={styles.copyTooltip} onMouseEnter={showTooltip} onMouseLeave={scheduleHide}>
          <button
            className={clsx(styles.copyBtn, copied && styles.copyBtnDone)}
            onClick={handleCopy}
            type="button"
            title={copied ? "Copied!" : `Copy "${text}"`}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          </button>
        </span>
      )}
    </span>
  );
}

export type SortColumn =
  | "identifier"
  | "slater_number"
  | "title"
  | "date"
  | "quality"
  | "has_transfer_on_disk"
  | "has_shotlist_pdf"
  | "audio";
export type SortDirection = "asc" | "desc";

function QualityBadge({
  codec,
  width,
  height,
}: {
  codec: string | null | undefined;
  width: number | null | undefined;
  height: number | null | undefined;
}): JSX.Element {
  const label = computeQualityLabel(codec, width, height);
  if (!codec) return <span className={clsx(styles.qualityBadge, styles.qualityBadgeNone)}>—</span>;
  const bucketKey = getBucketKey(codec, width);
  return (
    <span
      className={clsx(styles.qualityBadge, bucketKey && `quality-bucket-${bucketKey}`)}
      title={`${codec} ${width ?? "?"}\xd7${height ?? "?"}`}
    >
      {label}
    </span>
  );
}

interface ReelTableProps {
  rows: FilmReel[];
  onSelectReel: (identifier: string) => void;
  revealed: boolean;
  sortColumn?: SortColumn | null;
  sortDirection?: SortDirection;
  onSort?: (column: SortColumn) => void;
}

function SortIndicator({
  column,
  active,
  direction,
}: {
  column: SortColumn;
  active: SortColumn | null | undefined;
  direction: SortDirection | undefined;
}): JSX.Element | null {
  if (active !== column) return <span className={styles.sortIndicator} />;
  // prettier-ignore
  return <span className={styles.sortIndicatorActive}>{direction === "asc" ? "▲" : "▼"}</span>;
}

export default function ReelTable({
  rows,
  onSelectReel,
  revealed,
  sortColumn,
  sortDirection,
  onSort,
}: ReelTableProps): JSX.Element {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {revealed && (
            <th
              title="Original archival identifier for this film reel (e.g. FR-A013)"
              onClick={() => onSort?.("identifier")}
              className={clsx(sortColumn === "identifier" && styles.thActive)}
            >
              Identifier
              <SortIndicator column="identifier" active={sortColumn} direction={sortDirection} />
            </th>
          )}
          <th
            title="Slater Film Catalog ID — a unique catalog number assigned to each reel"
            onClick={() => onSort?.("slater_number")}
            className={clsx(sortColumn === "slater_number" && styles.thActive)}
          >
            Catalog ID
            <SortIndicator column="slater_number" active={sortColumn} direction={sortDirection} />
          </th>
          <th
            onClick={() => onSort?.("title")}
            className={clsx(sortColumn === "title" && styles.thActive)}
          >
            Title
            <SortIndicator column="title" active={sortColumn} direction={sortDirection} />
          </th>
          <th
            title="Date the film was filed or cataloged"
            onClick={() => onSort?.("date")}
            className={clsx(sortColumn === "date" && styles.thActive)}
          >
            Date
            <SortIndicator column="date" active={sortColumn} direction={sortDirection} />
          </th>
          <th
            title="Best available digital transfer quality (codec and resolution)"
            onClick={() => onSort?.("quality")}
            className={clsx(sortColumn === "quality" && styles.thActive)}
          >
            Quality
            <SortIndicator column="quality" active={sortColumn} direction={sortDirection} />
          </th>
          <th
            title="A digital transfer file exists on disk and can be streamed"
            onClick={() => onSort?.("has_transfer_on_disk")}
            className={clsx(sortColumn === "has_transfer_on_disk" && styles.thActive)}
          >
            Disk
            <SortIndicator
              column="has_transfer_on_disk"
              active={sortColumn}
              direction={sortDirection}
            />
          </th>
          <th
            title="A scanned shotlist PDF is available for this reel"
            onClick={() => onSort?.("has_shotlist_pdf")}
            className={clsx(sortColumn === "has_shotlist_pdf" && styles.thActive)}
          >
            PDF
            <SortIndicator
              column="has_shotlist_pdf"
              active={sortColumn}
              direction={sortDirection}
            />
          </th>
          <th
            title="A digital transfer file on disk has a confirmed audio track"
            onClick={() => onSort?.("audio")}
            className={clsx(sortColumn === "audio" && styles.thActive)}
          >
            Audio
            <SortIndicator column="audio" active={sortColumn} direction={sortDirection} />
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.identifier}
            onClick={() => onSelectReel(r.identifier)}
            className={styles.clickableRow}
          >
            {revealed && (
              <td className="mono-cell">
                <CopyCell
                  text={r.identifier}
                  cellId={`${r.identifier}-id`}
                  activeId={activeTooltipId}
                  setActiveId={setActiveTooltipId}
                >
                  <button className={styles.identifierBtn} type="button">
                    {r.identifier}
                  </button>
                </CopyCell>
              </td>
            )}
            <td className="mono-cell">
              <CopyCell
                text={r.slater_number ?? ""}
                cellId={`${r.identifier}-slater`}
                activeId={activeTooltipId}
                setActiveId={setActiveTooltipId}
              >
                {r.slater_number}
              </CopyCell>
            </td>
            <td className={styles.titleCell}>
              {revealed ? (
                <span className={styles.titleRevealed}>
                  <span title={r.title ?? ""}>
                    {r.title ? (r.title.length > 80 ? r.title.slice(0, 80) + "…" : r.title) : "—"}
                  </span>
                  {r.alternate_title && (
                    <span
                      className={styles.altBadge}
                      title={`Alt: ${r.alternate_title}`}
                      aria-label="Alternate title"
                    >
                      alt
                    </span>
                  )}
                </span>
              ) : (
                <span title={r.alternate_title ?? r.title ?? ""}>
                  {(() => {
                    const t = r.alternate_title ?? r.title;
                    return t ? (t.length > 80 ? t.slice(0, 80) + "…" : t) : "—";
                  })()}
                </span>
              )}
            </td>
            <td className="mono-cell">{r.date || "—"}</td>
            <td>
              <QualityBadge
                codec={r.best_quality_codec}
                width={r.best_quality_width}
                height={r.best_quality_height}
              />
            </td>
            <td className={styles.iconCell}>
              {r.has_transfer_on_disk ? <FontAwesomeIcon icon={faHardDrive} /> : ""}
            </td>
            <td className={styles.iconCell}>
              {r.has_shotlist_pdf ? <FontAwesomeIcon icon={faFilePdf} /> : ""}
            </td>
            <td className={styles.iconCell}>
              {r.has_transfer_audio ? (
                <FontAwesomeIcon
                  icon={faVolumeHigh}
                  title={r.audio ? `Audio: ${r.audio}` : "Has audio track"}
                />
              ) : null}
            </td>
          </tr>
        ))}
        {rows.length === 0 && (
          <tr>
            <td colSpan={revealed ? 8 : 7} className={styles.empty}>
              No results
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
