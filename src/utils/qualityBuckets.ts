// ---------------------------------------------------------------------------
// Quality bucket definitions — shared between server (SQL filter) and client (UI).
// Buckets are derived from actual video_codec + video_width, NOT the stored
// quality_tier / quality_label columns (which contain misnomers, e.g. a
// 4096-wide 70mm scan stored as "ProRes HQ 1080p").
// ---------------------------------------------------------------------------

export interface QualityBucket {
  key: string;
  label: string;
  /**
   * SQL fragment referencing `ffp.video_codec` and `ffp.video_width`
   * (where `ffp` is an alias for `ffprobe_metadata`).
   * Only contains literal values — no user-supplied strings — so it is
   * safe to interpolate directly into a query.
   */
  sqlWhere: string;
}

export const QUALITY_BUCKETS: QualityBucket[] = [
  {
    key: "prores-4k",
    label: "4K+ ProRes (70mm)",
    // prores AND width ≥ 2048 covers all film-gate scans:
    //   4096×1900 (70mm anamorphic), 4096×3112/4330 (70mm full gate),
    //   3072×2334 (35mm gate masters), 2048×1556/1536 (2K film gate)
    sqlWhere: "ffp.video_codec = 'prores' AND ffp.video_width >= 2048",
  },
  {
    key: "prores-hd",
    label: "ProRes HD",
    sqlWhere: "ffp.video_codec = 'prores' AND ffp.video_width >= 1280 AND ffp.video_width < 2048",
  },
  {
    key: "prores-sd",
    label: "ProRes SD",
    sqlWhere: "ffp.video_codec = 'prores' AND ffp.video_width < 1280",
  },
  {
    key: "h264-hd",
    label: "H.264 HD",
    sqlWhere: "(ffp.video_codec = 'h264' OR ffp.video_codec = 'hevc') AND ffp.video_width >= 1280",
  },
  {
    key: "proxy",
    label: "Proxy / SD",
    sqlWhere:
      "((ffp.video_codec = 'h264' OR ffp.video_codec = 'hevc') AND ffp.video_width < 1280) OR ffp.video_codec LIKE 'mpeg%'",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a human-readable quality label from actual codec + resolution.
 * Replaces the stored quality_label which can be misleading
 * (e.g. a 4096-wide 70mm scan was stored as "ProRes HQ 1080p").
 */
export function computeQualityLabel(
  codec: string | null | undefined,
  width: number | null | undefined,
  height: number | null | undefined
): string {
  if (!codec) return "—";

  if (codec === "prores") {
    if (width == null) return "ProRes";
    if (width >= 4096) return `ProRes 4K (70mm, ${width}×${height})`;
    if (width >= 3072) return `ProRes 3K (${width}×${height})`;
    if (width >= 2048) return `ProRes 2K (${width}×${height})`;
    if (width >= 1900) return "ProRes 1080p";
    if (width >= 1280) return `ProRes HD (${width}×${height})`;
    return `ProRes SD (${width}×${height})`;
  }

  if (codec === "h264" || codec === "hevc") {
    const codecLabel = codec === "hevc" ? "HEVC" : "H.264";
    if (width == null) return codecLabel;
    if (width >= 3840) return `${codecLabel} 4K`;
    if (width >= 1920) return `${codecLabel} 1080p`;
    if (width >= 1280) return `${codecLabel} 720p`;
    if (width >= 640) return `${codecLabel} ${width}×${height}`;
    return `${codecLabel} Proxy`;
  }

  if (codec.startsWith("mpeg")) {
    const res = width ? ` ${width}×${height}` : "";
    return `${codec.toUpperCase()}${res}`;
  }

  // Fallthrough for unknown codecs
  return width ? `${codec} ${width}×${height}` : codec;
}

/** Returns the bucket key for a given codec/width combination, or null. */
export function getBucketKey(
  codec: string | null | undefined,
  width: number | null | undefined
): string | null {
  if (!codec) return null;

  if (codec === "prores") {
    if (width != null && width >= 2048) return "prores-4k";
    if (width != null && width >= 1280) return "prores-hd";
    return "prores-sd";
  }

  if (codec === "h264" || codec === "hevc") {
    if (width != null && width >= 1280) return "h264-hd";
    return "proxy";
  }

  if (codec.startsWith("mpeg")) return "proxy";

  return null;
}
