import type { Category } from "../types";
import type { NewsProvider, PriceProvider } from "./types";
import { stockProvider } from "./stock";
import { cryptoProvider } from "./crypto";
import { metalProvider } from "./metal";
import { realEstateProvider } from "./realestate";
import { watchProvider } from "./watch";
import { carProvider } from "./car";
import { otherProvider } from "./other";
import { googleNewsProvider } from "./news";

const PRICE_PROVIDERS: Record<Category, PriceProvider> = {
  stock: stockProvider,
  crypto: cryptoProvider,
  metal: metalProvider,
  realestate: realEstateProvider,
  watch: watchProvider,
  car: carProvider,
  other: otherProvider,
};

export function getPriceProvider(category: Category): PriceProvider {
  return PRICE_PROVIDERS[category];
}

export function getNewsProvider(): NewsProvider {
  return googleNewsProvider;
}

export type { PriceProvider, NewsProvider, PriceResult } from "./types";
