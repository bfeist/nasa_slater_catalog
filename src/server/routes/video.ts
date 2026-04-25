// ---------------------------------------------------------------------------
// /api/video/* — DB-backed info + (monolithic mode only) direct streaming
//
// In split mode (HOME_GATEWAY_BASE_URL set), only /info is mounted here.
// /stream, /heartbeat, /stop move to the home gateway. Catalog API mints
// short-lived tokens via /api/video/sessions (see routes/sessions.ts).
// ---------------------------------------------------------------------------

import { Router } from "express";
import { getDb } from "../db.js";
import { config } from "../config.js";
import { redactFileOnDiskEntry } from "../redaction.js";
import { isRevealed, getRequestUser } from "../slater.js";
import { streamFile, heartbeat, deregisterStream } from "../streamingPipeline.js";

const router = Router();

// ---- GET /api/video/:file_id/info — always available (DB-only) ----
router.get("/:file_id/info", (req, res) => {
  const d = getDb();
  const fileId = parseInt(req.params.file_id, 10);
  const file = d.prepare("SELECT * FROM files_on_disk WHERE id = ?").get(fileId) as
    | Record<string, unknown>
    | undefined;
  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  const probe = d.prepare("SELECT * FROM ffprobe_metadata WHERE file_id = ?").get(fileId);
  res.json({ file: isRevealed(req) ? file : redactFileOnDiskEntry(file), probe });
});

// ---------------------------------------------------------------------------
// Monolithic-mode-only routes: direct streaming, heartbeat, stop.
// In split mode, the SPA hits the home gateway directly via a tokenized URL
// returned from POST /api/video/sessions, so these handlers are not mounted.
// ---------------------------------------------------------------------------
if (config.gatewayMode === "monolithic") {
  router.get("/heartbeat", (req, res) => {
    const streamId = req.query.streamId as string | undefined;
    if (!streamId || !heartbeat(streamId)) {
      res.status(404).json({ error: "Unknown streamId" });
      return;
    }
    res.json({ ok: true });
  });

  router.post("/stop", (req, res) => {
    const streamId = req.query.streamId as string | undefined;
    if (streamId) deregisterStream(streamId, "client stop");
    res.json({ ok: true });
  });

  router.get("/:file_id/stream", (req, res) => {
    const fileId = parseInt(req.params.file_id, 10);
    const startSecs = parseFloat((req.query.start as string) ?? "0") || 0;
    const streamId = (req.query.streamId as string | undefined) ?? "";
    const fail = streamFile(req, res, {
      fileId,
      startSecs,
      streamId,
      username: getRequestUser(req),
    });
    if (fail) res.status(fail.status).send(fail.message);
  });
}

export default router;
