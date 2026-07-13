import { addSnapshot, getAsset } from "./assets";
import { getPriceProvider } from "./providers";
import type { ValueSnapshot } from "./types";

export async function refreshAsset(assetId: string): Promise<ValueSnapshot | null> {
  const asset = getAsset(assetId);
  if (!asset) return null;

  const provider = getPriceProvider(asset.category);
  const result = await provider.getValue(asset);

  return addSnapshot({
    assetId: asset.id,
    value: result.value,
    currency: result.currency,
    source: result.source,
    sourceUrl: result.sourceUrl ?? null,
    timestamp: new Date().toISOString(),
  });
}

export async function refreshAllAssets(assetIds: string[]): Promise<
  { assetId: string; ok: boolean; error?: string }[]
> {
  const results: { assetId: string; ok: boolean; error?: string }[] = [];
  for (const id of assetIds) {
    try {
      const snapshot = await refreshAsset(id);
      results.push({ assetId: id, ok: Boolean(snapshot) });
    } catch (err) {
      results.push({ assetId: id, ok: false, error: err instanceof Error ? err.message : "unknown error" });
    }
  }
  return results;
}
