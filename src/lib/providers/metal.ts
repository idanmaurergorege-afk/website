import type { Asset } from "../types";
import { getKey } from "../config";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

const COINGECKO_TOKEN_BY_SYMBOL: Record<string, string> = {
  XAU: "pax-gold", // PAX Gold — 1 token ≈ 1 troy oz of gold
  GOLD: "pax-gold",
};

/**
 * Precious metals. `identifier` is expected to be a metal symbol (XAU gold,
 * XAG silver…) and `quantity` the number of troy ounces held.
 *
 * If METALS_API_KEY is set, calls metals-api.com for a direct spot price.
 * Otherwise falls back to CoinGecko's PAX Gold token price (free, no key)
 * for gold specifically; other metals without a key fall back to manual.
 */
export const metalProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    const symbol = asset.identifier.trim().toUpperCase();
    const metalsApiKey = getKey("METALS_API_KEY");

    if (metalsApiKey) {
      try {
        const url = `https://metals-api.com/api/latest?access_key=${metalsApiKey}&base=USD&symbols=${encodeURIComponent(symbol)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const rate = json?.rates?.[symbol];
          if (typeof rate === "number" && rate > 0) {
            // metals-api returns USD-per-unit-of-metal as a fraction; invert to get USD per oz.
            const pricePerOz = 1 / rate;
            return {
              value: pricePerOz * asset.quantity,
              currency: "USD",
              asOf: new Date().toISOString(),
              sourceUrl: "https://metals-api.com/",
              source: "live",
            };
          }
        }
      } catch {
        // fall through to free fallback below
      }
    }

    const coingeckoId = COINGECKO_TOKEN_BY_SYMBOL[symbol];
    if (coingeckoId) {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const price = json[coingeckoId]?.usd;
          if (typeof price === "number") {
            return {
              value: price * asset.quantity,
              currency: "USD",
              asOf: new Date().toISOString(),
              sourceUrl: `https://www.coingecko.com/en/coins/${coingeckoId}`,
              source: "live",
            };
          }
        }
      } catch {
        // fall through to manual
      }
    }

    return manualFallback(asset);
  },
};
