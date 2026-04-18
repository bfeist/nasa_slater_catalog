// ---------------------------------------------------------------------------
// Database singleton — lazy-loaded, read-only better-sqlite3 connection
// ---------------------------------------------------------------------------

import Database from "better-sqlite3";
import { config } from "./config.js";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  db = new Database(config.dbPath, { readonly: true });
  // Skip WAL pragma — the connection is read-only so WAL mode is irrelevant,
  // and setting it would require creating .db-shm/.db-wal sidecar files in
  // the database directory, which fails when that directory is mounted :ro
  // in Docker.
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
