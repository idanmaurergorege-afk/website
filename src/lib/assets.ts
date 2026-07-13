import { randomUUID } from "node:crypto";
import { db } from "./db";
import type { Asset, AssetWithHistory, ValueSnapshot } from "./types";

export interface CreateAssetInput {
  category: Asset["category"];
  name: string;
  identifier?: string;
  quantity?: number;
  purchasePrice: number;
  purchaseDate: string;
  manualCurrentValue?: number | null;
  manualValueDate?: string | null;
  location?: string | null;
  notes?: string | null;
  newsKeyword?: string | null;
}

export function listAssets(): Asset[] {
  return db.prepare(`SELECT * FROM assets ORDER BY createdAt DESC`).all() as Asset[];
}

export function getAsset(id: string): Asset | undefined {
  return db.prepare(`SELECT * FROM assets WHERE id = ?`).get(id) as Asset | undefined;
}

export function createAsset(input: CreateAssetInput): Asset {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO assets
      (id, category, name, identifier, quantity, purchasePrice, purchaseDate,
       manualCurrentValue, manualValueDate, location, notes, newsKeyword, createdAt, updatedAt)
     VALUES (@id, @category, @name, @identifier, @quantity, @purchasePrice, @purchaseDate,
       @manualCurrentValue, @manualValueDate, @location, @notes, @newsKeyword, @createdAt, @updatedAt)`,
  ).run({
    id,
    category: input.category,
    name: input.name,
    identifier: input.identifier ?? "",
    quantity: input.quantity ?? 1,
    purchasePrice: input.purchasePrice,
    purchaseDate: input.purchaseDate,
    manualCurrentValue: input.manualCurrentValue ?? null,
    manualValueDate: input.manualValueDate ?? null,
    location: input.location ?? null,
    notes: input.notes ?? null,
    newsKeyword: input.newsKeyword ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return getAsset(id)!;
}

export function updateAsset(id: string, patch: Partial<CreateAssetInput>): Asset | undefined {
  const existing = getAsset(id);
  if (!existing) return undefined;

  const definedPatch = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  );
  const merged = { ...existing, ...definedPatch, updatedAt: new Date().toISOString() };
  db.prepare(
    `UPDATE assets SET
      category = @category, name = @name, identifier = @identifier, quantity = @quantity,
      purchasePrice = @purchasePrice, purchaseDate = @purchaseDate,
      manualCurrentValue = @manualCurrentValue, manualValueDate = @manualValueDate,
      location = @location, notes = @notes, newsKeyword = @newsKeyword, updatedAt = @updatedAt
     WHERE id = @id`,
  ).run(merged);
  return getAsset(id);
}

export function deleteAsset(id: string): void {
  db.prepare(`DELETE FROM value_snapshots WHERE assetId = ?`).run(id);
  db.prepare(`DELETE FROM assets WHERE id = ?`).run(id);
}

export function addSnapshot(snapshot: Omit<ValueSnapshot, "id">): ValueSnapshot {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO value_snapshots (id, assetId, value, currency, source, sourceUrl, timestamp)
     VALUES (@id, @assetId, @value, @currency, @source, @sourceUrl, @timestamp)`,
  ).run({ id, ...snapshot });
  return { id, ...snapshot };
}

export function getSnapshots(assetId: string, limit = 60): ValueSnapshot[] {
  return db
    .prepare(
      `SELECT * FROM value_snapshots WHERE assetId = ? ORDER BY timestamp ASC LIMIT ?`,
    )
    .all(assetId, limit) as ValueSnapshot[];
}

export function getLatestSnapshot(assetId: string): ValueSnapshot | undefined {
  return db
    .prepare(`SELECT * FROM value_snapshots WHERE assetId = ? ORDER BY timestamp DESC LIMIT 1`)
    .get(assetId) as ValueSnapshot | undefined;
}

export function getAssetsWithHistory(): AssetWithHistory[] {
  return listAssets().map((asset) => {
    const history = getSnapshots(asset.id);
    const latest = history[history.length - 1];
    const latestValue = latest?.value ?? asset.manualCurrentValue ?? asset.purchasePrice;
    const changePct =
      asset.purchasePrice > 0 ? ((latestValue - asset.purchasePrice) / asset.purchasePrice) * 100 : null;

    return {
      ...asset,
      latestValue,
      currency: latest?.currency ?? "USD",
      source: latest?.source ?? "manual",
      sourceUrl: latest?.sourceUrl ?? null,
      asOf: latest?.timestamp ?? null,
      changePct,
      history: history.map((h) => ({ value: h.value, timestamp: h.timestamp })),
    };
  });
}
