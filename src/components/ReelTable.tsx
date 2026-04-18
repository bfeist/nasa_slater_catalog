import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHardDrive, faFilePdf, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import type { FilmReel } from "../types";
import { computeQualityLabel, getBucketKey } from "../utils/qualityBuckets";
import styles from "./ReelTable.module.css";

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
}

export default function ReelTable({ rows, onSelectReel, revealed }: ReelTableProps): JSX.Element {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {revealed && (
            <th title="Original archival identifier for this film reel (e.g. FR-A013)">
              Identifier
            </th>
          )}
          <th title="Slater Film Catalog ID — a unique catalog number assigned to each reel">
            Catalog ID
          </th>
          <th>Title</th>
          <th title="Date the film was filed or cataloged">Date</th>
          <th title="Best available digital transfer quality (codec and resolution)">Quality</th>
          <th title="A digital transfer file exists on disk and can be streamed">Disk</th>
          <th title="A scanned shotlist PDF is available for this reel">PDF</th>
          <th title="Whether the reel has an audio track (mono, stereo, or silent)">Audio</th>
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
                <button className={styles.identifierBtn} type="button">
                  {r.identifier}
                </button>
              </td>
            )}
            <td className="mono-cell">{r.slater_number}</td>
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
              {r.audio || r.has_transfer_audio ? (
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
