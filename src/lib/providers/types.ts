import type { Asset, NewsItem, ValueSource } from "../types";

export interface PriceResult {
  value: number;
  currency: string;
  asOf: string;
  sourceUrl?: string;
  source: ValueSource;
}

export interface PriceProvider {
  getValue(asset: Asset): Promise<PriceResult>;
}

export interface NewsProvider {
  getNews(asset: Asset): Promise<NewsItem[]>;
}

export function manualFallback(asset: Asset): PriceResult {
  const value = asset.manualCurrentValue ?? asset.purchasePrice;
  return {
    value,
    currency: "USD",
    asOf: asset.manualValueDate ?? asset.updatedAt,
    source: "manual",
  };
}
