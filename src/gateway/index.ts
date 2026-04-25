// ---------------------------------------------------------------------------
// Home video gateway — Express app + entry point.
//
// Started independently from the catalog API. Owns video streaming, PDF
// serving, and the /internal/* token-mint endpoints. Reuses src/server/db.ts
// and src/server/streamingPipeline.ts so file-id resolution and ffmpeg
// behavior stay identical to monolithic mode.
// ---------------------------------------------------------------------------

import express from "express";
import { config } from "../server/config.js";
import { closeDb } from "../server/db.js";
import { ConsoleLogger } from "../server/logger.js";
import { healthRouter, internalRouter, streamRouter, pdfRouter } from "./routes.js";

if (config.gatewayMode !== "home") {
  ConsoleLogger.error(
    `[gateway] Refusing to start: HOME_GATEWAY_ROLE must be "home" (got "${config.gatewayMode}")`
  );
  process.exit(2);
}
if (!config.gatewaySharedSecret) {
  ConsoleLogger.error("[gateway] HOME_GATEWAY_SHARED_SECRET is required");
  process.exit(2);
}

const app = express();
app.use(express.json());
app.use("/", healthRouter());
app.use("/internal", internalRouter());
app.use("/stream", streamRouter());
app.use("/pdf", pdfRouter());

const port = config.port;
const server = app.listen(port, "0.0.0.0", () => {
  ConsoleLogger.info(`Slater Home Video Gateway`);
  ConsoleLogger.info(`Release:      ${config.releaseVersion}`);
  ConsoleLogger.info(`Listening:    http://0.0.0.0:${port}`);
  ConsoleLogger.info(`Database:     ${config.dbPath}`);
  ConsoleLogger.info(`PDF dir:      ${config.shotlistPdfDir}`);
  ConsoleLogger.info(`Archive root: ${config.videoArchiveRoot}`);
  ConsoleLogger.info(`CORS origin:  ${config.publicOrigin || "(unset — public stream blocked)"}`);
});

function shutdown(): void {
  ConsoleLogger.info("[gateway] shutting down…");
  server.close(() => {
    closeDb();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
