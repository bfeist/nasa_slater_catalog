// ---------------------------------------------------------------------------
// /api/admin/* — user management (superuser only)
// ---------------------------------------------------------------------------

import { Router, type Request, type Response, type NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { getSession, listUsers, addUser, updateUser, deleteUser, type UserRole } from "../auth.js";
import { logActivity } from "../logger.js";
import { config } from "../config.js";

const router = Router();

/** Extract bearer token from Authorization header. */
function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const m = authHeader.match(/^Bearer\s+(\S+)$/i);
  return m ? m[1] : null;
}

/** Middleware: require a valid session with role === "super". */
function requireSuper(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Session expired" });
    return;
  }
  if (session.role !== "super") {
    res.status(403).json({ error: "Superuser access required" });
    return;
  }
  // Stash session for downstream handlers
  (req as Request & { adminSession: { username: string; role: UserRole } }).adminSession = session;
  next();
}

router.use(requireSuper);

/** Read all lines from a log file, newest first. Streams in 64KB chunks to avoid loading large files entirely. */
function readLogLines(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];

  const fileSize = fs.statSync(filePath).size;
  if (fileSize < 1024 * 100) {
    return fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .filter((l) => l.length > 0)
      .reverse();
  }

  const chunkSize = 64 * 1024;
  const lines: string[] = [];
  let buffer = "";
  let pos = fileSize;

  while (pos > 0) {
    const readSize = Math.min(chunkSize, pos);
    const fd = fs.openSync(filePath, "r");
    const chunk = Buffer.alloc(readSize);
    fs.readSync(fd, chunk, 0, readSize, pos - readSize);
    fs.closeSync(fd);
    pos -= readSize;

    const parts = (chunk.toString("utf-8") + buffer).split("\n");
    buffer = parts[0];
    for (let i = parts.length - 1; i > 0; i--) {
      if (parts[i].length > 0) lines.push(parts[i]);
    }
  }
  if (buffer.length > 0) lines.push(buffer);
  return lines;
}

// ---- GET /api/admin/logs ----
router.get("/logs", (req: Request, res: Response) => {
  const file = (req.query.file as string) || "activity.log";

  if (!file.match(/^[\w-]+\.log$/)) {
    res.status(400).json({ error: "Invalid log file name" });
    return;
  }

  const logPath = path.join(config.logDir, file);
  if (!path.resolve(logPath).startsWith(path.resolve(config.logDir))) {
    res.status(400).json({ error: "Invalid log file path" });
    return;
  }

  try {
    res.json({ lines: readLogLines(logPath) });
  } catch {
    res.status(500).json({ error: "Failed to read log file" });
  }
});

// ---- GET /api/admin/logs/list ----
// List available log files
router.get("/logs/list", (_req, res) => {
  try {
    if (!fs.existsSync(config.logDir)) {
      res.json({ files: [] });
      return;
    }

    const files = fs
      .readdirSync(config.logDir)
      .filter((f) => f.endsWith(".log"))
      .map((f) => {
        const filePath = path.join(config.logDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          size: stats.size,
          mtime: stats.mtime.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime());

    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "Failed to list log files" });
  }
});

// ---- GET /api/admin/users ----
router.get("/users", (_req, res) => {
  const users = listUsers().map(({ username, role, suspended }) => ({
    username,
    role,
    suspended: !!suspended,
  }));
  res.json({ users });
});

// ---- POST /api/admin/users ----
router.post("/users", (req: Request, res: Response) => {
  const { username, password, role } = req.body as {
    username?: string;
    password?: string;
    role?: string;
  };

  if (!username?.trim()) {
    res.status(400).json({ error: "Username is required" });
    return;
  }
  if (!password || password.length < 4) {
    res.status(400).json({ error: "Password must be at least 4 characters" });
    return;
  }
  if (role !== "super" && role !== "full" && role !== "guest") {
    res.status(400).json({ error: "Role must be super, full, or guest" });
    return;
  }

  const ok = addUser({ username: username.trim(), password, role });
  if (!ok) {
    res.status(409).json({ error: "Username already exists" });
    return;
  }

  const admin = (req as Request & { adminSession: { username: string } }).adminSession;
  logActivity({
    action: "admin_add_user",
    username: admin.username,
    details: `added user ${username.trim()} (${role})`,
  });
  res.status(201).json({ ok: true });
});

// ---- PUT /api/admin/users/:username ----
router.put("/users/:username", (req: Request, res: Response) => {
  const target = req.params.username as string;
  const { password, role, suspended } = req.body as {
    password?: string;
    role?: string;
    suspended?: boolean;
  };

  if (role !== undefined && role !== "super" && role !== "full" && role !== "guest") {
    res.status(400).json({ error: "Role must be super, full, or guest" });
    return;
  }
  if (password !== undefined && password.length < 4) {
    res.status(400).json({ error: "Password must be at least 4 characters" });
    return;
  }

  const updates: { password?: string; role?: UserRole; suspended?: boolean } = {};
  if (password !== undefined) updates.password = password;
  if (role !== undefined) updates.role = role as UserRole;
  if (suspended !== undefined) updates.suspended = Boolean(suspended);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Nothing to update" });
    return;
  }

  const admin = (req as Request & { adminSession: { username: string } }).adminSession;

  // Prevent self-suspension
  if (updates.suspended === true && target.toLowerCase() === admin.username.toLowerCase()) {
    res.status(400).json({ error: "Cannot suspend your own account" });
    return;
  }

  const ok = updateUser(target, updates);
  if (!ok) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  logActivity({
    action: "admin_update_user",
    username: admin.username,
    details: `updated user ${target}${role ? ` role→${role}` : ""}${password ? " password changed" : ""}${suspended !== undefined ? ` suspended→${suspended}` : ""}`,
  });
  res.json({ ok: true });
});

// ---- DELETE /api/admin/users/:username ----
router.delete("/users/:username", (req: Request, res: Response) => {
  const target = req.params.username as string;
  const admin = (req as Request & { adminSession: { username: string } }).adminSession;

  // Prevent self-deletion
  if (target.toLowerCase() === admin.username.toLowerCase()) {
    res.status(400).json({ error: "Cannot delete your own account" });
    return;
  }

  const ok = deleteUser(target);
  if (!ok) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  logActivity({
    action: "admin_delete_user",
    username: admin.username,
    details: `deleted user ${target}`,
  });
  res.json({ ok: true });
});

export default router;
