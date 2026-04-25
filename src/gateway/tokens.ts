// ---------------------------------------------------------------------------
// In-memory token store for the home video gateway.
// Tokens are short-lived opaque random strings minted by the catalog API
// over the shared-secret /internal/* endpoints.
// ---------------------------------------------------------------------------

import crypto from "node:crypto";
import { config } from "../server/config.js";

export interface VideoTokenData {
  kind: "video";
  sessionId: string;
  fileId: number;
  startSecs: number;
  username: string;
  expiresAtMs: number;
  releaseVersion: string;
}

export interface PdfTokenData {
  kind: "pdf";
  filename: string;
  username: string;
  expiresAtMs: number;
  releaseVersion: string;
}

type TokenData = VideoTokenData | PdfTokenData;

const tokens = new Map<string, TokenData>();
const sessionIdToCurrentToken = new Map<string, string>();
const sessionIdToFileId = new Map<string, number>();

function newToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}
function newSessionId(): string {
  return crypto.randomBytes(16).toString("base64url");
}

export function mintVideoToken(opts: { fileId: number; startSecs: number; username: string }): {
  token: string;
  sessionId: string;
  expiresAtMs: number;
} {
  const sessionId = newSessionId();
  const token = newToken();
  const expiresAtMs = Date.now() + config.sessionTtlSecs * 1000;
  tokens.set(token, {
    kind: "video",
    sessionId,
    fileId: opts.fileId,
    startSecs: opts.startSecs,
    username: opts.username,
    expiresAtMs,
    releaseVersion: config.releaseVersion,
  });
  sessionIdToCurrentToken.set(sessionId, token);
  sessionIdToFileId.set(sessionId, opts.fileId);
  return { token, sessionId, expiresAtMs };
}

export function renewVideoToken(opts: {
  sessionId: string;
  startSecs: number;
  username: string;
}): { token: string; sessionId: string; expiresAtMs: number } | null {
  const fileId = sessionIdToFileId.get(opts.sessionId);
  if (!fileId) return null;

  const oldToken = sessionIdToCurrentToken.get(opts.sessionId);
  if (oldToken) tokens.delete(oldToken);

  const token = newToken();
  const expiresAtMs = Date.now() + config.sessionTtlSecs * 1000;
  tokens.set(token, {
    kind: "video",
    sessionId: opts.sessionId,
    fileId,
    startSecs: opts.startSecs,
    username: opts.username,
    expiresAtMs,
    releaseVersion: config.releaseVersion,
  });
  sessionIdToCurrentToken.set(opts.sessionId, token);
  return { token, sessionId: opts.sessionId, expiresAtMs };
}

export function mintPdfToken(opts: { filename: string; username: string }): {
  token: string;
  expiresAtMs: number;
} {
  const token = newToken();
  const expiresAtMs = Date.now() + config.pdfTokenTtlSecs * 1000;
  tokens.set(token, {
    kind: "pdf",
    filename: opts.filename,
    username: opts.username,
    expiresAtMs,
    releaseVersion: config.releaseVersion,
  });
  return { token, expiresAtMs };
}

export function consumeVideoToken(token: string): VideoTokenData | null {
  const data = tokens.get(token);
  if (!data || data.kind !== "video") return null;
  if (Date.now() > data.expiresAtMs) {
    tokens.delete(token);
    return null;
  }
  return data;
}

export function consumePdfToken(token: string): PdfTokenData | null {
  const data = tokens.get(token);
  if (!data || data.kind !== "pdf") return null;
  if (Date.now() > data.expiresAtMs) {
    tokens.delete(token);
    return null;
  }
  return data;
}

// Periodic GC.
setInterval(() => {
  const now = Date.now();
  for (const [tok, data] of tokens.entries()) {
    if (now > data.expiresAtMs) tokens.delete(tok);
  }
  for (const [sid, tok] of sessionIdToCurrentToken.entries()) {
    if (!tokens.has(tok)) {
      sessionIdToCurrentToken.delete(sid);
      sessionIdToFileId.delete(sid);
    }
  }
}, 60_000).unref();
