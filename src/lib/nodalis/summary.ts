import { listProviders } from "./providers";
import { listTransactions } from "./transactions";
import type { Coin, DashboardSummary } from "./types";

export function getDashboardSummary(merchantId: string): DashboardSummary {
  const transactions = listTransactions(merchantId);
  const providers = listProviders();

  const settled = transactions.filter((t) => t.status === "settled");
  const pending = transactions.filter((t) => t.status === "pending");
  const failed = transactions.filter((t) => t.status === "failed");
  const refunded = transactions.filter((t) => t.status === "refunded");

  const totalVolumeSettled = settled.reduce((sum, t) => sum + (t.netAmount ?? 0), 0);
  const attempted = transactions.filter((t) => t.status !== "pending");
  const successRate = attempted.length > 0 ? ((settled.length + refunded.length) / attempted.length) * 100 : 0;

  const settlementDurations = settled
    .filter((t) => t.settledAt)
    .map((t) => (new Date(t.settledAt!).getTime() - new Date(t.createdAt).getTime()) / 1000);
  const avgSettlementSeconds =
    settlementDurations.length > 0
      ? settlementDurations.reduce((a, b) => a + b, 0) / settlementDurations.length
      : null;

  const byProviderMap = new Map<string, { count: number; volume: number }>();
  for (const t of settled) {
    if (!t.providerId) continue;
    const entry = byProviderMap.get(t.providerId) ?? { count: 0, volume: 0 };
    entry.count += 1;
    entry.volume += t.netAmount ?? 0;
    byProviderMap.set(t.providerId, entry);
  }
  const byProvider = Array.from(byProviderMap.entries()).map(([providerId, v]) => ({
    providerId,
    providerName: providers.find((p) => p.id === providerId)?.name ?? providerId,
    ...v,
  }));

  const byCoinMap = new Map<Coin, { count: number; volume: number }>();
  for (const t of settled) {
    const entry = byCoinMap.get(t.coin) ?? { count: 0, volume: 0 };
    entry.count += 1;
    entry.volume += t.netAmount ?? 0;
    byCoinMap.set(t.coin, entry);
  }
  const byCoin = Array.from(byCoinMap.entries()).map(([coin, v]) => ({ coin, ...v }));

  return {
    totalVolumeSettled,
    transactionCount: transactions.length,
    settledCount: settled.length,
    pendingCount: pending.length,
    failedCount: failed.length,
    refundedCount: refunded.length,
    successRate,
    avgSettlementSeconds,
    byProvider,
    byCoin,
  };
}
