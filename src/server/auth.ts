// ---------------------------------------------------------------------------
// User authentication — HMAC-signed self-contained tokens
//
// Tokens encode {username, role, expiry} and are signed with a stable secret
// stored in auth.config.json. No server-side session store is required, so
// auth survives HMR reloads and server restarts without logging users out.
// ---------------------------------------------------------------------------

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type UserRole = "super" | "full" | "guest";

export interface UserEntry {
  username: string;
  password: string;
  role: UserRole;
  suspended?: boolean;
}

interface AuthConfig {
  secret?: string;
  users: UserEntry[];
}

export interface Session {
  username: string;
  role: UserRole;
}

// Session TTL: 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// In-memory revocation set for explicit logouts.
// Small and bounded — entries auto-clear after SESSION_TTL_MS.
// Losing it on restart is acceptable: those sessions were intentionally ended.
const revokedTokens = new Set<string>();

/** Find the project root by walking up from the current file. */
function findProjectRoot(): string {
  let dir = path.dirname(new URL(import.meta.url).pathname);
  // On Windows, strip leading / from /C:/... paths
  if (process.platform === "win32" && dir.startsWith("/")) {
    dir = dir.slice(1);
  }
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

const AUTH_CONFIG_PATH =
  process.env.AUTH_CONFIG_PATH ?? path.join(findProjectRoot(), "auth.config.json");

/** Read auth config fresh from disk on every call — no caching. */
function getAuthConfig(): AuthConfig {
  if (!fs.existsSync(AUTH_CONFIG_PATH)) {
    console.warn(`[auth] No auth config found at ${AUTH_CONFIG_PATH} — no users configured`);
    return { users: [] };
  }
  const raw = fs.readFileSync(AUTH_CONFIG_PATH, "utf-8");
  return JSON.parse(raw) as AuthConfig;
}

/**
 * Get or generate the HMAC signing secret.
 * On first run, generates a random secret and persists it to auth.config.json
 * so it survives process restarts (tokens remain valid).
 */
function getOrCreateSecret(): string {
  const config = getAuthConfig();
  if (config.secret && config.secret.length >= 32) return config.secret;

  const secret = crypto.randomBytes(48).toString("hex");
  const updated: AuthConfig = { ...config, secret };
  fs.writeFileSync(AUTH_CONFIG_PATH, JSON.stringify(updated, null, 2) + "\n", "utf-8");
  console.info("[auth] Generated and saved new signing secret to auth.config.json");
  return secret;
}

// Cache for the process lifetime — secret doesn't change once loaded.
let _secret: string | null = null;
function signingSecret(): string {
  return (_secret ??= getOrCreateSecret());
}

function b64url(buf: Buffer): string {
  return buf.toString("base64url");
}

/** Create a signed token encoding {username, role, expiry}. */
function createToken(username: string, role: UserRole): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ u: username, r: role, e: Date.now() + SESSION_TTL_MS }))
  );
  const sig = b64url(crypto.createHmac("sha256", signingSecret()).update(payload).digest());
  return `${payload}.${sig}`;
}

/** Verify and decode a token. Returns null if invalid, expired, or revoked. */
function verifyToken(token: string): Session | null {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expectedBuf = crypto.createHmac("sha256", signingSecret()).update(payload).digest();
  let sigBuf: Buffer;
  try {
    sigBuf = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  // Lengths must match before timingSafeEqual
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  if (revokedTokens.has(token)) return null;

  let data: { u: unknown; r: unknown; e: unknown };
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      u: unknown;
      r: unknown;
      e: unknown;
    };
  } catch {
    return null;
  }

  if (typeof data.u !== "string" || typeof data.r !== "string" || typeof data.e !== "number")
    return null;
  if (data.r !== "super" && data.r !== "full" && data.r !== "guest") return null;
  if (Date.now() > data.e) return null;

  return { username: data.u, role: data.r };
}

/**
 * Authenticate a username/password pair. Returns a signed token on success,
 * or null on failure.
 */
export function authenticate(
  username: string,
  password: string
): { token: string; username: string; role: UserRole } | null {
  const config = getAuthConfig();
  const user = config.users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim());
  if (!user) return null;
  if (user.password !== password) return null;
  if (user.suspended) return null;

  const token = createToken(user.username, user.role);
  return { token, username: user.username, role: user.role };
}

/** Verify a token and return the session. Returns null if invalid, expired, revoked, or suspended. */
export function getSession(token: string): Session | null {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Hydrate live user state so role changes and suspensions take effect immediately
  const config = getAuthConfig();
  const user = config.users.find(
    (u) => u.username.toLowerCase() === decoded.username.toLowerCase()
  );
  if (!user) return null;
  if (user.suspended) return null;

  return { username: user.username, role: user.role };
}

/** Revoke a token (logout). The token will be rejected until it naturally expires. */
export function destroySession(token: string): void {
  revokedTokens.add(token);
  // Auto-clear after SESSION_TTL_MS to keep the set small
  setTimeout(() => revokedTokens.delete(token), SESSION_TTL_MS).unref();
}

// ---------------------------------------------------------------------------
// Admin helpers — read/write auth.config.json user list
// ---------------------------------------------------------------------------

/** Return all users (without the signing secret). */
export function listUsers(): UserEntry[] {
  return getAuthConfig().users;
}

/** Persist an updated user list back to auth.config.json, preserving the secret. */
function saveUsers(users: UserEntry[]): void {
  const config = getAuthConfig();
  const updated = { ...config, users };
  fs.writeFileSync(AUTH_CONFIG_PATH, JSON.stringify(updated, null, 2) + "\n", "utf-8");
}

/** Add a new user. Returns false if username already exists. */
export function addUser(entry: UserEntry): boolean {
  const config = getAuthConfig();
  const exists = config.users.some(
    (u) => u.username.toLowerCase() === entry.username.toLowerCase()
  );
  if (exists) return false;
  saveUsers([...config.users, entry]);
  return true;
}

/** Update an existing user. Returns false if user not found. */
export function updateUser(
  username: string,
  updates: Partial<Pick<UserEntry, "password" | "role" | "suspended">>
): boolean {
  const config = getAuthConfig();
  const idx = config.users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return false;
  const user = { ...config.users[idx] };
  if (updates.password !== undefined) user.password = updates.password;
  if (updates.role !== undefined) user.role = updates.role;
  if (updates.suspended !== undefined) user.suspended = updates.suspended;
  const users = [...config.users];
  users[idx] = user;
  saveUsers(users);
  return true;
}

/** Delete a user by username. Returns false if user not found. */
export function deleteUser(username: string): boolean {
  const config = getAuthConfig();
  const filtered = config.users.filter((u) => u.username.toLowerCase() !== username.toLowerCase());
  if (filtered.length === config.users.length) return false;
  saveUsers(filtered);
  return true;
}
