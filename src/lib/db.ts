import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, "wealth.db");

declare global {
  var __wealthDb: Database.Database | undefined;
}

function createDb(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      identifier TEXT NOT NULL DEFAULT '',
      quantity REAL NOT NULL DEFAULT 1,
      purchasePrice REAL NOT NULL DEFAULT 0,
      purchaseDate TEXT NOT NULL,
      manualCurrentValue REAL,
      manualValueDate TEXT,
      location TEXT,
      notes TEXT,
      newsKeyword TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS value_snapshots (
      id TEXT PRIMARY KEY,
      assetId TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
      value REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      source TEXT NOT NULL,
      sourceUrl TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_snapshots_asset ON value_snapshots(assetId, timestamp);
  `);

  return db;
}

export const db = globalThis.__wealthDb ?? createDb();
if (process.env.NODE_ENV !== "production") globalThis.__wealthDb = db;
