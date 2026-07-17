export type Coin = "USDC" | "USDT" | "EURC" | "BTC" | "ETH";
export type Region = "US" | "EU" | "UK" | "APAC" | "OTHER";
export type ProviderStatus = "healthy" | "degraded" | "down";
export type SettlementMode = "fiat" | "crypto" | "split";
export type IntegrationType = "api" | "hosted_checkout" | "pos";
export type RoutingStrategy = "lowest_cost" | "preferred_provider";
export type MerchantStatus = "onboarding" | "active";
export type TransactionStatus = "pending" | "settled" | "failed" | "refunded";
export type LinkKind = "link" | "pos";
export type LinkStatus = "active" | "archived";

export const COINS: Coin[] = ["USDC", "USDT", "EURC", "BTC", "ETH"];
export const REGIONS: { code: Region; label: string }[] = [
  { code: "US", label: "United States" },
  { code: "EU", label: "European Union" },
  { code: "UK", label: "United Kingdom" },
  { code: "APAC", label: "Asia-Pacific" },
  { code: "OTHER", label: "Rest of world" },
];

export interface Merchant {
  id: string;
  businessName: string;
  businessType: string;
  country: string;
  contactEmail: string;
  kybStatus: "pending" | "verified";
  settlementMode: SettlementMode;
  settlementSplitPct: number;
  preferredCoin: Coin;
  integrationType: IntegrationType;
  routingStrategy: RoutingStrategy;
  preferredProviderId: string | null;
  status: MerchantStatus;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  name: string;
  regions: (Region | "GLOBAL")[];
  coins: Coin[];
  feeBps: number;
  avgSettlementSeconds: number;
  status: ProviderStatus;
}

export interface PaymentLink {
  id: string;
  merchantId: string;
  title: string;
  amount: number;
  currency: string;
  allowedCoins: Coin[];
  kind: LinkKind;
  status: LinkStatus;
  createdAt: string;
}

export interface RoutingCandidate {
  providerId: string;
  providerName: string;
  feeBps: number;
  status: ProviderStatus;
  eligible: boolean;
  chosen: boolean;
  reason: string;
}

export interface RoutingDetail {
  coin: Coin;
  region: Region;
  candidates: RoutingCandidate[];
  chosenProviderId: string | null;
  summary: string;
}

export interface Transaction {
  id: string;
  merchantId: string;
  paymentLinkId: string | null;
  amount: number;
  currency: string;
  coin: Coin;
  customerRegion: Region;
  providerId: string | null;
  feeBps: number | null;
  feeAmount: number | null;
  netAmount: number | null;
  settlementMode: SettlementMode;
  settledFiatAmount: number | null;
  settledCryptoAmount: number | null;
  status: TransactionStatus;
  routingDetail: RoutingDetail;
  createdAt: string;
  settledAt: string | null;
  refundedAt: string | null;
}

export type NodalisEventType =
  | "payment.created"
  | "routing.decision"
  | "payment.settled"
  | "payment.failed"
  | "payment.refunded";

export interface NodalisEvent {
  id: string;
  transactionId: string;
  type: NodalisEventType;
  message: string;
  createdAt: string;
}

export interface TransactionWithEvents extends Transaction {
  events: NodalisEvent[];
  paymentLinkTitle: string | null;
  providerName: string | null;
}

export interface DashboardSummary {
  totalVolumeSettled: number;
  transactionCount: number;
  settledCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  successRate: number;
  avgSettlementSeconds: number | null;
  byProvider: { providerId: string; providerName: string; count: number; volume: number }[];
  byCoin: { coin: Coin; count: number; volume: number }[];
}

export const BUSINESS_TYPES = ["E-commerce", "Marketplace", "SaaS / Subscription", "Retail / POS", "Other"];
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "Portugal",
  "Singapore",
  "Australia",
  "Other",
];
