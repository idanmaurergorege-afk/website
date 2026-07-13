export type Category =
  | "stock"
  | "crypto"
  | "metal"
  | "realestate"
  | "watch"
  | "car"
  | "other";

export type ValueSource = "live" | "index" | "manual";

export interface Asset {
  id: string;
  category: Category;
  name: string;
  identifier: string;
  /**
   * Units held (shares, coins, troy ounces…). Not in the original spec's
   * schema, but required to turn a live per-unit price into a total value —
   * defaults to 1 for one-of-a-kind assets (real estate, watch, car, other).
   */
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  manualCurrentValue: number | null;
  manualValueDate: string | null;
  location: string | null;
  notes: string | null;
  newsKeyword: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ValueSnapshot {
  id: string;
  assetId: string;
  value: number;
  currency: string;
  source: ValueSource;
  sourceUrl: string | null;
  timestamp: string;
}

export interface NewsItem {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
}

export interface AssetWithHistory extends Asset {
  latestValue: number;
  currency: string;
  source: ValueSource;
  sourceUrl: string | null;
  asOf: string | null;
  changePct: number | null;
  history: { value: number; timestamp: string }[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  stock: "Stock / ETF",
  crypto: "Crypto",
  metal: "Precious metal",
  realestate: "Real estate",
  watch: "Watch",
  car: "Car",
  other: "Other",
};
