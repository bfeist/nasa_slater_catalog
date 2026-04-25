// ---------------------------------------------------------------------------
// gatewayClient.ts — HTTP client used by the catalog API (split mode) to talk
// to the home video gateway. Uses a shared bearer secret. Caches /healthz so
// degraded UX shows up quickly instead of every request blocking on the home
// network.
// ---------------------------------------------------------------------------

import { config } from "./config.js";
import { ConsoleLogger } from "./logger.js";

export interface VideoSessionResponse {
  sessionId: string;
  token: string;
  expiresAtMs: number;
  releaseVersion: string;
}

export interface PdfTokenResponse {
  token: string;
  expiresAtMs: number;
  releaseVersion: string;
}

export interface GatewayHealth {
  ok: boolean;
  releaseVersion: string | null;
  checkedAtMs: number;
}

let cachedHealth: GatewayHealth | null = null;

function authHeaders(): Record<string, string> {
  if (!config.gatewaySharedSecret) {
    throw new Error("HOME_GATEWAY_SHARED_SECRET is not configured on the catalog API");
  }
  return {
    Authorization: `Bearer ${config.gatewaySharedSecret}`,
    "Content-Type": "application/json",
    "X-Release-Version": config.releaseVersion,
  };
}

async function gatewayFetch(pathname: string, init: RequestInit = {}): Promise<Response> {
  if (!config.gatewayBaseUrl) {
    throw new Error("HOME_GATEWAY_BASE_URL is not configured");
  }
  const url = `${config.gatewayBaseUrl}${pathname}`;
  // 5s timeout — anything slower means home is effectively down.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: { ...(init.headers as Record<string, string> | undefined), ...authHeaders() },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function checkGatewayHealth(force = false): Promise<GatewayHealth> {
  const now = Date.now();
  if (
    !force &&
    cachedHealth &&
    now - cachedHealth.checkedAtMs < config.gatewayHealthTtlSecs * 1000
  ) {
    return cachedHealth;
  }
  try {
    const r = await gatewayFetch("/healthz");
    if (!r.ok) {
      cachedHealth = { ok: false, releaseVersion: null, checkedAtMs: now };
    } else {
      const body = (await r.json()) as { releaseVersion?: string };
      cachedHealth = {
        ok: true,
        releaseVersion: body.releaseVersion ?? null,
        checkedAtMs: now,
      };
    }
  } catch (err) {
    ConsoleLogger.warn(
      `[gateway] /healthz failed: ${err instanceof Error ? err.message : String(err)}`
    );
    cachedHealth = { ok: false, releaseVersion: null, checkedAtMs: now };
  }
  return cachedHealth;
}

export async function mintVideoSession(opts: {
  fileId: number;
  startSecs: number;
  username: string;
}): Promise<VideoSessionResponse> {
  const r = await gatewayFetch("/internal/sessions", {
    method: "POST",
    body: JSON.stringify(opts),
  });
  if (!r.ok) {
    throw new Error(`gateway /internal/sessions: ${r.status}`);
  }
  return (await r.json()) as VideoSessionResponse;
}

export async function renewVideoSession(opts: {
  sessionId: string;
  startSecs: number;
  username: string;
}): Promise<VideoSessionResponse> {
  const r = await gatewayFetch(`/internal/sessions/${encodeURIComponent(opts.sessionId)}/renew`, {
    method: "POST",
    body: JSON.stringify({ startSecs: opts.startSecs, username: opts.username }),
  });
  if (!r.ok) {
    throw new Error(`gateway /internal/sessions/renew: ${r.status}`);
  }
  return (await r.json()) as VideoSessionResponse;
}

export async function mintPdfToken(opts: {
  filename: string;
  username: string;
}): Promise<PdfTokenResponse> {
  const r = await gatewayFetch("/internal/pdf-tokens", {
    method: "POST",
    body: JSON.stringify(opts),
  });
  if (!r.ok) {
    throw new Error(`gateway /internal/pdf-tokens: ${r.status}`);
  }
  return (await r.json()) as PdfTokenResponse;
}
