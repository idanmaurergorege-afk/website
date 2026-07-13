import type { Asset } from "../types";
import { manualFallback, type PriceProvider, type PriceResult } from "./types";

// Generic catch-all category: always manual entry.
export const otherProvider: PriceProvider = {
  async getValue(asset: Asset): Promise<PriceResult> {
    return manualFallback(asset);
  },
};
