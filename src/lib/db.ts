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
  db.pragma("busy_timeout = 5000");

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

    CREATE TABLE IF NOT EXISTS nodalis_merchant (
      id TEXT PRIMARY KEY,
      businessName TEXT NOT NULL,
      businessType TEXT NOT NULL,
      country TEXT NOT NULL,
      contactEmail TEXT NOT NULL,
      kybStatus TEXT NOT NULL DEFAULT 'pending',
      settlementMode TEXT NOT NULL DEFAULT 'fiat',
      settlementSplitPct INTEGER NOT NULL DEFAULT 50,
      preferredCoin TEXT NOT NULL DEFAULT 'USDC',
      integrationType TEXT NOT NULL DEFAULT 'hosted_checkout',
      routingStrategy TEXT NOT NULL DEFAULT 'lowest_cost',
      preferredProviderId TEXT,
      status TEXT NOT NULL DEFAULT 'onboarding',
      onboardingStep INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS nodalis_provider (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      regions TEXT NOT NULL,
      coins TEXT NOT NULL,
      feeBps INTEGER NOT NULL,
      avgSettlementSeconds INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'healthy'
    );

    CREATE TABLE IF NOT EXISTS nodalis_payment_link (
      id TEXT PRIMARY KEY,
      merchantId TEXT NOT NULL REFERENCES nodalis_merchant(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      allowedCoins TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'link',
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS nodalis_transaction (
      id TEXT PRIMARY KEY,
      merchantId TEXT NOT NULL REFERENCES nodalis_merchant(id) ON DELETE CASCADE,
      paymentLinkId TEXT REFERENCES nodalis_payment_link(id) ON DELETE SET NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      coin TEXT NOT NULL,
      customerRegion TEXT NOT NULL,
      providerId TEXT REFERENCES nodalis_provider(id),
      feeBps INTEGER,
      feeAmount REAL,
      netAmount REAL,
      settlementMode TEXT NOT NULL,
      settledFiatAmount REAL,
      settledCryptoAmount REAL,
      status TEXT NOT NULL DEFAULT 'pending',
      routingDetail TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      settledAt TEXT,
      refundedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS nodalis_event (
      id TEXT PRIMARY KEY,
      transactionId TEXT NOT NULL REFERENCES nodalis_transaction(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_nodalis_tx_merchant ON nodalis_transaction(merchantId, createdAt);
    CREATE INDEX IF NOT EXISTS idx_nodalis_tx_link ON nodalis_transaction(paymentLinkId, createdAt);
    CREATE INDEX IF NOT EXISTS idx_nodalis_event_tx ON nodalis_event(transactionId, createdAt);
  `);

  seedNodalisProviders(db);

  return db;
}

const NODALIS_PROVIDER_SEED = [
  {
    id: "prov_bvnk",
    name: "BVNK",
    regions: ["EU", "UK"],
    coins: ["USDC", "USDT", "EURC"],
    feeBps: 20,
    avgSettlementSeconds: 18,
    status: "healthy",
  },
  {
    id: "prov_bitpay",
    name: "BitPay",
    regions: ["GLOBAL"],
    coins: ["USDC", "USDT", "BTC", "ETH"],
    feeBps: 100,
    avgSettlementSeconds: 45,
    status: "healthy",
  },
  {
    id: "prov_coinbase",
    name: "Coinbase Commerce",
    regions: ["GLOBAL"],
    coins: ["USDC", "BTC", "ETH"],
    feeBps: 100,
    avgSettlementSeconds: 12,
    status: "healthy",
  },
  {
    id: "prov_triplea",
    name: "Triple-A",
    regions: ["APAC"],
    coins: ["USDC", "USDT"],
    feeBps: 35,
    avgSettlementSeconds: 30,
    status: "degraded",
  },
] as const;

function seedNodalisProviders(db: Database.Database) {
  // INSERT OR IGNORE (not a check-then-insert) so this stays safe when multiple
  // processes import this module concurrently, e.g. Next's build-time
  // "collect page data" workers each instantiating their own db handle.
  const insert = db.prepare(
    `INSERT OR IGNORE INTO nodalis_provider (id, name, regions, coins, feeBps, avgSettlementSeconds, status)
     VALUES (@id, @name, @regions, @coins, @feeBps, @avgSettlementSeconds, @status)`,
  );
  const insertMany = db.transaction((rows: typeof NODALIS_PROVIDER_SEED) => {
    for (const row of rows) {
      insert.run({
        id: row.id,
        name: row.name,
        regions: JSON.stringify(row.regions),
        coins: JSON.stringify(row.coins),
        feeBps: row.feeBps,
        avgSettlementSeconds: row.avgSettlementSeconds,
        status: row.status,
      });
    }
  });
  insertMany(NODALIS_PROVIDER_SEED);
}

export const db = globalThis.__wealthDb ?? createDb();
if (process.env.NODE_ENV !== "production") globalThis.__wealthDb = db;
