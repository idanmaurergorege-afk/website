import type { Asset } from "../types";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

// CoinGecko /simple/price — free, no API key required.
// `identifier` must be the CoinGecko coin id (e.g. "bitcoin", "ethereum"),
// not the ticker symbol.
export const cryptoProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    const id = asset.identifier.trim().toLowerCase();
    if (!id) return manualFallback(asset);

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return manualFallback(asset);
      const json = await res.json();
      const price = json[id]?.usd;
      if (typeof price !== "number") return manualFallback(asset);

      return {
        value: price * asset.quantity,
        currency: "USD",
        asOf: new Date().toISOString(),
        sourceUrl: `https://www.coingecko.com/en/coins/${id}`,
        source: "live",
      };
    } catch {
      return manualFallback(asset);
    }
  },
};
