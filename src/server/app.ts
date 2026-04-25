// ---------------------------------------------------------------------------
// Express application — mounts all API routes (mode-aware).
//
//   monolithic — everything mounted (today's `npm run dev` behavior)
//   catalog    — file-byte routes (/api/shotlist-pdf) NOT mounted; sessions
//                router proxies to the home gateway
//   home       — this file is not used; see src/gateway/index.ts
// ---------------------------------------------------------------------------

import express from "express";
import path from "node:path";
import fs from "node:fs";
import { config } from "./config.js";
import { ConsoleLogger } from "./logger.js";

import statsRouter from "./routes/stats.js";
import reelsRouter from "./routes/reels.js";
import videoRouter from "./routes/video.js";
import shotlistPdfRouter from "./routes/shotlistPdf.js";
import sessionsRouter from "./routes/sessions.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import { initSlaterMap } from "./slater.js";

export function createApp(): express.Application {
  const app = express();

  initSlaterMap();

  app.use(express.json());

  // Always-on catalog routes
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/reels", reelsRouter);
  app.use("/api/video", videoRouter); // /info always; /stream gated inside
  app.use("/api", sessionsRouter); // /api/video/sessions, /api/pdf/sessions, /api/gateway/status

  // Filesystem-bound PDF route only in monolithic mode. In split mode the
  // SPA always goes through /api/pdf/sessions → home gateway.
  if (config.gatewayMode === "monolithic") {
    app.use("/api/shotlist-pdf", shotlistPdfRouter);
  } else {
    ConsoleLogger.info(
      `[app] mode=${config.gatewayMode}; /api/shotlist-pdf and direct /api/video/stream not mounted`
    );
  }

  // Production: serve the built Vite SPA (skipped when SERVE_FRONTEND=false)
  if (config.isProd && config.serveFrontend) {
    const distDir = config.viteDistDir;
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distDir, "index.html"));
      });
    } else {
      ConsoleLogger.warn(`Warning: Vite dist not found at ${distDir}`);
      ConsoleLogger.warn("Run 'npm run build' first, or set VITE_DIST_DIR.");
    }
  }

  return app;
}
