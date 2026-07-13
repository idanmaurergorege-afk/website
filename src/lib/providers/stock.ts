import type { Asset } from "../types";
import { getKey } from "../config";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

// Alpha Vantage GLOBAL_QUOTE — free tier, 25 requests/day.
// https://www.alphavantage.co/documentation/#latestprice
export const stockProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    const key = getKey("ALPHA_VANTAGE_KEY");
    if (!key) return manualFallback(asset);

    const symbol = asset.identifier.trim().toUpperCase();
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return manualFallback(asset);
      const json = await res.json();
      const quote = json["Global Quote"];
      const price = quote?.["05. price"];
      if (!price) return manualFallback(asset);

      return {
        value: parseFloat(price) * asset.quantity,
        currency: "USD",
        asOf: new Date().toISOString(),
        sourceUrl: `https://www.alphavantage.co/`,
        source: "live",
      };
    } catch {
      return manualFallback(asset);
    }
  },
};
