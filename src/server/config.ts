// ---------------------------------------------------------------------------
// Server configuration — environment-aware paths
// ---------------------------------------------------------------------------
//
// All path-dependent values are resolved here so the rest of the server code
// can just import `config` and not worry about which OS / deployment target
// it's running on.
//
// Environment variables (all optional, sensible defaults provided).
// Values are loaded from .env via dotenv (override: true — always wins over
// shell environment, quiet: true — no warnings if .env is absent).
// See .env.example for the full list and Docker/UNC examples.
//
//   PORT                  – HTTP port (default 3001)
//   NODE_ENV              – "production" | "development" (default "development")
//   DB_PATH               – Absolute path to the SQLite database
//   SHOTLIST_PDF_DIR      – Folder containing shotlist PDFs (default: static_assets/shotlist_pdfs)
//   VIDEO_ARCHIVE_ROOT    – Base path for the NASA archive video share
//   WATERMARK_FONT_PATH   – Path to a TrueType font for ffmpeg watermark
//   VITE_DIST_DIR         – Path to the built Vite SPA (prod: served by Express)
//
// Home-gateway split (production deployment only):
//
//   HOME_GATEWAY_ROLE         – "home" → run this process as the home gateway
//                                (only video/PDF byte routes; no catalog API)
//                                unset → catalog API process
//   HOME_GATEWAY_BASE_URL     – Public URL of the home gateway, e.g.
//                                https://home.example.com. When set on the
//                                catalog API, it switches into "split" mode
//                                and proxies session creation to the gateway.
//                                When unset locally, the catalog API stays in
//                                "monolithic" mode and serves video/PDFs
//                                directly (today's `npm run dev` behavior).
//   HOME_GATEWAY_SHARED_SECRET – Bearer token shared between catalog API and
//                                home gateway. Required when role=home or
//                                BASE_URL is set.
//   HOME_GATEWAY_HEALTH_TTL_SECS – Cache TTL for the gateway /healthz probe
//                                  (default 30s).
//   PUBLIC_ORIGIN             – CORS allow-origin for the home gateway, e.g.
//                                https://slaterfilmcatalog.benfeist.com.
//   SESSION_TTL_SECS          – Playback-start token lifetime (default 300).
//   PDF_TOKEN_TTL_SECS        – PDF token lifetime (default 300).
//   RELEASE_VERSION           – Git SHA / release tag, validated across the
//                                catalog ↔ home boundary to prevent split-brain.
// ---------------------------------------------------------------------------

import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Load .env before any process.env reads below.
// override: true  — .env values always win over pre-existing shell variables
// quiet: true     — silently skip if .env doesn't exist (CI / Docker use real env vars)
dotenv.config({ override: true, quiet: true });

/**
 * Find the project root by walking up from the current file until we find
 * package.json.  This works whether running from source (`src/server/`) or
 * from the esbuild bundle (`.local/express/dist/`).
 */
function findProjectRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break; // filesystem root
    dir = parent;
  }
  // Fallback: assume cwd is the project root
  return process.cwd();
}

const PROJECT_ROOT = process.env.PROJECT_ROOT ?? findProjectRoot();

/** Resolve a path relative to project root */
function fromRoot(...segments: string[]): string {
  return path.resolve(PROJECT_ROOT, ...segments);
}

// ---------------------------------------------------------------------------
// Detect platform to pick sensible defaults for the archive path
// ---------------------------------------------------------------------------
function defaultArchiveRoot(): string {
  // Docker / Linux — the share is mounted as a volume
  // e.g.  docker run -v /mnt/user/NASA\ Archive:/archive ...
  if (process.platform === "linux") {
    return "/archive";
  }

  // Windows — mapped drive O:\ or UNC path
  // GitBash rewrites /o/ → O:\ automatically, but running under plain Node
  // the drive letter form is more reliable.
  if (process.platform === "win32") {
    return "O:\\";
  }

  // macOS — unlikely, but just in case
  return "/Volumes/NASA Archive";
}

// ---------------------------------------------------------------------------
// Exported config
// ---------------------------------------------------------------------------

const env = process.env.NODE_ENV ?? "development";

// ---------------------------------------------------------------------------
// Home gateway split mode detection
//   monolithic — everything in one Express process (default; today's dev)
//   catalog    — catalog API; calls home gateway for video/PDF bytes
//   home       — home gateway; only serves video/PDF bytes via tokens
// ---------------------------------------------------------------------------
const gatewayRole = (process.env.HOME_GATEWAY_ROLE ?? "").toLowerCase();
const gatewayBaseUrl = (process.env.HOME_GATEWAY_BASE_URL ?? "").replace(/\/+$/, "");
const gatewayMode: "monolithic" | "catalog" | "home" =
  gatewayRole === "home" ? "home" : gatewayBaseUrl ? "catalog" : "monolithic";

export const config = {
  env,
  isDev: env === "development",
  isProd: env === "production",
  port: parseInt(process.env.PORT ?? "3001", 10),

  /** Path to the SQLite catalog database */
  dbPath: process.env.DB_PATH ?? fromRoot("database", "catalog.db"),

  /** Directory containing the scanned shotlist PDFs */
  shotlistPdfDir: process.env.SHOTLIST_PDF_DIR ?? fromRoot("static_assets", "shotlist_pdfs"),

  /** Directory containing LLM OCR JSON outputs (one per PDF) */
  llmOcrDir: process.env.LLM_OCR_DIR ?? fromRoot("static_assets", "llm_ocr"),

  /** Root of the NASA video archive share */
  videoArchiveRoot: process.env.VIDEO_ARCHIVE_ROOT ?? defaultArchiveRoot(),

  /** Font for the ffmpeg watermark overlay */
  watermarkFontPath:
    process.env.WATERMARK_FONT_PATH ??
    (process.platform === "win32"
      ? "C:/Windows/Fonts/arial.ttf"
      : "/usr/share/fonts/dejavu/DejaVuSans.ttf"),

  /** Monospace font used for timecode / frame-number watermark burn-in.
   *  Lucida Console (lucon.ttf) on Windows — thin, clean, sans-serif monospace
   *  with a technical/instrument character; ships on Windows 95+.
   *  DejaVu Sans Mono on Linux (Alpine: /usr/share/fonts/dejavu/). */
  watermarkMonoFontPath:
    process.env.WATERMARK_MONO_FONT_PATH ??
    (process.platform === "win32"
      ? "C:/Windows/Fonts/lucon.ttf"
      : "/usr/share/fonts/dejavu/DejaVuSansMono.ttf"),

  /**
   * H.264 encoder used for video transcoding.
   * Override with VIDEO_ENCODER env var.
   * Default: h264_nvenc (GPU) on Windows, libx264 (CPU) on Linux/Docker
   * since Alpine's stock ffmpeg has no NVENC support.
   */
  videoEncoder:
    process.env.VIDEO_ENCODER ?? (process.platform === "win32" ? "h264_nvenc" : "libx264"),

  /** Built Vite SPA assets (served by Express in production) */
  viteDistDir: process.env.VITE_DIST_DIR ?? fromRoot(".local", "vite", "dist"),

  /**
   * Whether Express should serve the Vite SPA in production mode.
   * Set SERVE_FRONTEND=false in Docker when Nginx is serving the SPA instead.
   * Defaults to true (Express serves the SPA when NODE_ENV=production).
   */
  serveFrontend: process.env.SERVE_FRONTEND !== "false",

  /** Directory for activity log files */
  logDir: process.env.LOG_DIR ?? fromRoot(".local", "logs"),

  /** HMAC key used to derive Slater numbers from identifiers */
  slaterSecret: process.env.SLATER_SECRET ?? "slater-film-default-hmac-key",

  // ---- Home gateway split ----------------------------------------------
  /** Which role this process plays in the catalog/home split. */
  gatewayMode,
  /** Public URL of the home gateway (catalog mode only). */
  gatewayBaseUrl,
  /** Bearer secret shared between catalog API and home gateway. */
  gatewaySharedSecret: process.env.HOME_GATEWAY_SHARED_SECRET ?? "",
  /** Cache TTL for the home gateway /healthz probe (seconds). */
  gatewayHealthTtlSecs: parseInt(process.env.HOME_GATEWAY_HEALTH_TTL_SECS ?? "30", 10),
  /** CORS allow-origin enforced by the home gateway. */
  publicOrigin: process.env.PUBLIC_ORIGIN ?? "",
  /** Playback-start token lifetime (seconds). */
  sessionTtlSecs: parseInt(process.env.SESSION_TTL_SECS ?? "300", 10),
  /** PDF-access token lifetime (seconds). */
  pdfTokenTtlSecs: parseInt(process.env.PDF_TOKEN_TTL_SECS ?? "300", 10),
  /** Build/release version tag. Validated across the catalog ↔ home boundary. */
  releaseVersion: process.env.RELEASE_VERSION ?? "dev",
} as const;

export type Config = typeof config;
