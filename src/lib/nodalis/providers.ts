import { db } from "@/lib/db";
import type { Provider } from "./types";

interface ProviderRow {
  id: string;
  name: string;
  regions: string;
  coins: string;
  feeBps: number;
  avgSettlementSeconds: number;
  status: string;
}

function rowToProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    name: row.name,
    regions: JSON.parse(row.regions),
    coins: JSON.parse(row.coins),
    feeBps: row.feeBps,
    avgSettlementSeconds: row.avgSettlementSeconds,
    status: row.status as Provider["status"],
  };
}

export function listProviders(): Provider[] {
  const rows = db.prepare(`SELECT * FROM nodalis_provider ORDER BY name ASC`).all() as ProviderRow[];
  return rows.map(rowToProvider);
}

export function getProvider(id: string): Provider | undefined {
  const row = db.prepare(`SELECT * FROM nodalis_provider WHERE id = ?`).get(id) as ProviderRow | undefined;
  return row ? rowToProvider(row) : undefined;
}
