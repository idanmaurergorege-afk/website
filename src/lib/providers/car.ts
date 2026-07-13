import type { Asset } from "../types";
import { getKey } from "../config";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

/**
 * Cars have no free live valuation API. Default path is manual entry
 * (VIN in `identifier`, mileage/details in `notes`, user-updated estimated
 * value in `manualCurrentValue`).
 *
 * Optional path: if the user supplies CAR_DATA_API_KEY for a paid VIN
 * valuation service such as MarketCheck, this calls their predicted-price
 * endpoint. Swap the URL/response parsing for whichever provider you sign
 * up with (MarketCheck, VinAudit, etc.) — shapes differ per vendor.
 */
export const carProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    const key = getKey("CAR_DATA_API_KEY");
    const vin = asset.identifier.trim();

    if (key && vin) {
      try {
        const url = `https://mc-api.marketcheck.com/v2/predict/car/us/marketcheck_price?vin=${encodeURIComponent(vin)}&api_key=${key}`;
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const price = json?.predicted_price;
          if (typeof price === "number" && price > 0) {
            return {
              value: price,
              currency: "USD",
              asOf: new Date().toISOString(),
              sourceUrl: "https://www.marketcheck.com/",
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
