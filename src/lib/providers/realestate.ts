import type { Asset } from "../types";
import { getKey } from "../config";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

const FRED_SERIES_ID = "CSUSHPISA"; // S&P/Case-Shiller U.S. National Home Price Index

/**
 * Real estate has no free official per-property valuation API (Zillow shut
 * theirs down in 2021). We deliberately do NOT scrape Zillow or any other
 * ToS-restricted site.
 *
 * Priority order:
 *  1. REALESTATE_API_KEY -> RentCast's AVM endpoint (paid, user-supplied key,
 *     user accepts RentCast's own terms of service).
 *  2. FRED_API_KEY -> estimate appreciation using the free Case-Shiller
 *     national home price index as a regional trend proxy (labeled "index").
 *  3. Otherwise -> the user's manually-entered value (labeled "manual").
 */
export const realEstateProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    const rentCastKey = getKey("REALESTATE_API_KEY");
    if (rentCastKey && asset.location) {
      try {
        const url = `https://api.rentcast.io/v1/avm/value?address=${encodeURIComponent(asset.location)}`;
        const res = await fetch(url, {
          headers: { "X-Api-Key": rentCastKey, Accept: "application/json" },
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          const price = json?.price;
          if (typeof price === "number" && price > 0) {
            return {
              value: price,
              currency: "USD",
              asOf: new Date().toISOString(),
              sourceUrl: "https://www.rentcast.io/",
              source: "live",
            };
          }
        }
      } catch {
        // fall through to index estimate / manual
      }
    }

    const fredKey = getKey("FRED_API_KEY");
    if (fredKey) {
      try {
        const estimate = await estimateFromCaseShiller(asset, fredKey);
        if (estimate) return estimate;
      } catch {
        // fall through to manual
      }
    }

    return manualFallback(asset);
  },
};

async function estimateFromCaseShiller(asset: Asset, fredKey: string): Promise<PriceResult | null> {
  const baseUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=${FRED_SERIES_ID}&api_key=${fredKey}&file_type=json`;

  const res = await fetch(
    `${baseUrl}&observation_start=${asset.purchaseDate}&sort_order=asc&limit=1`,
    { cache: "no-store" },
  );
  const latestRes = await fetch(`${baseUrl}&sort_order=desc&limit=1`, { cache: "no-store" });
  if (!res.ok || !latestRes.ok) return null;

  const atPurchase = (await res.json())?.observations?.[0];
  const latest = (await latestRes.json())?.observations?.[0];
  const indexAtPurchase = parseFloat(atPurchase?.value);
  const indexLatest = parseFloat(latest?.value);
  if (!indexAtPurchase || !indexLatest) return null;

  const estimatedValue = asset.purchasePrice * (indexLatest / indexAtPurchase);
  return {
    value: estimatedValue,
    currency: "USD",
    asOf: latest.date,
    sourceUrl: "https://fred.stlouisfed.org/series/CSUSHPISA",
    source: "index",
  };
}
