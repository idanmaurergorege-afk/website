import type { Asset } from "../types";
import { getKey } from "../config";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

/**
 * Watches have no official Chrono24 API, and this app does NOT scrape
 * Chrono24 directly — doing so at scale can violate its Terms of Service.
 *
 * Default path: the user manually logs purchase price and periodically
 * updates an observed market price they've checked themselves
 * (`manualCurrentValue` / `manualValueDate`).
 *
 * Optional path: if the user runs their own Apify actor that scrapes
 * Chrono24 listings (at their own risk, under their own agreement with
 * Apify/Chrono24) and supplies WATCH_DATA_API_KEY (an Apify API token),
 * this stub calls that actor's sync run endpoint. Replace ACTOR_ID below
 * with your own actor's id/slug before this path will do anything.
 */
const APIFY_ACTOR_ID = "REPLACE_WITH_YOUR_APIFY_ACTOR_ID";

export const watchProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    const apifyToken = getKey("WATCH_DATA_API_KEY");
    if (apifyToken && APIFY_ACTOR_ID !== "REPLACE_WITH_YOUR_APIFY_ACTOR_ID") {
      try {
        const url = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${apifyToken}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: `${asset.name} ${asset.identifier}` }),
          cache: "no-store",
        });
        if (res.ok) {
          const items = await res.json();
          const price = items?.[0]?.price;
          if (typeof price === "number" && price > 0) {
            return {
              value: price,
              currency: "USD",
              asOf: new Date().toISOString(),
              sourceUrl: items[0]?.url,
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
