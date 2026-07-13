import { Bitcoin, Building2, Car, Gem, LineChart, Watch as WatchIcon, Package } from "lucide-react";
import type { Category } from "./types";

export const CATEGORY_COLOR: Record<Category, string> = {
  stock: "var(--color-cat-stock)",
  crypto: "var(--color-cat-crypto)",
  metal: "var(--color-cat-metal)",
  realestate: "var(--color-cat-realestate)",
  watch: "var(--color-cat-watch)",
  car: "var(--color-cat-car)",
  other: "var(--color-cat-other)",
};

export const CATEGORY_ICON: Record<Category, typeof LineChart> = {
  stock: LineChart,
  crypto: Bitcoin,
  metal: Gem,
  realestate: Building2,
  watch: WatchIcon,
  car: Car,
  other: Package,
};

export const CATEGORIES: Category[] = [
  "stock",
  "crypto",
  "metal",
  "realestate",
  "watch",
  "car",
  "other",
];
