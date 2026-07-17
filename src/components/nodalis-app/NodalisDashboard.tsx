"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Store, ArrowUpRight, Settings2 } from "lucide-react";
import { Card, ProviderStatusDot, TransactionStatusBadge } from "./ui";
import { formatUsd, formatSeconds, formatDateTime, formatBps } from "@/lib/nodalis/format";
import type { DashboardSummary, Merchant, Provider, Transaction } from "@/lib/nodalis/types";

export function NodalisDashboard() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);

  const load = useCallback(async () => {
    const [merchantRes, summaryRes, providersRes, txRes] = await Promise.all([
      fetch("/api/nodalis/merchant").then((r) => r.json()),
      fetch("/api/nodalis/dashboard").then((r) => r.json()),
      fetch("/api/nodalis/providers").then((r) => r.json()),
      fetch("/api/nodalis/transactions").then((r) => r.json()),
    ]);
    setMerchant(merchantRes.merchant);
    setSummary(summaryRes.summary);
    setProviders(providersRes.providers);
    setRecent((txRes.transactions ?? []).slice(0, 6));
  }, []);

  useEffect(() => {
    // Fetch-on-mount: state updates happen after the awaited fetch resolves,
    // not synchronously during the effect itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, [load]);

  if (!merchant || !summary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-surface" />
        ))}
      </div>
    );
  }

  const maxVolume = Math.max(1, ...summary.byProvider.map((p) => p.volume), ...summary.byCoin.map((c) => c.volume));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">{merchant.businessName}</h1>
            <span className="inline-flex items-center rounded-full bg-positive/15 px-2.5 py-0.5 text-xs font-medium text-positive">
              Active
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-faint">
            {merchant.businessType} · Settlement: {merchant.settlementMode}
            {merchant.settlementMode === "split" ? ` (${merchant.settlementSplitPct}/${100 - merchant.settlementSplitPct})` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/nodalis/app/links"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-md shadow-brand-500/25"
          >
            <Plus size={15} />
            New payment link
          </Link>
          <Link
            href="/nodalis/app/settings"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-dim hover:text-ink"
          >
            <Settings2 size={14} />
            Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total volume settled" value={formatUsd(summary.totalVolumeSettled)} />
        <StatTile label="Transactions" value={String(summary.transactionCount)} />
        <StatTile label="Success rate" value={`${summary.successRate.toFixed(0)}%`} />
        <StatTile label="Avg. settlement time" value={formatSeconds(summary.avgSettlementSeconds)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Volume by provider</h2>
          {summary.byProvider.length === 0 ? (
            <EmptyMini />
          ) : (
            <div className="mt-4 space-y-3">
              {summary.byProvider.map((p) => (
                <MiniBar key={p.providerId} label={p.providerName} value={p.volume} max={maxVolume} sub={`${p.count} tx`} />
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Volume by coin</h2>
          {summary.byCoin.length === 0 ? (
            <EmptyMini />
          ) : (
            <div className="mt-4 space-y-3">
              {summary.byCoin.map((c) => (
                <MiniBar key={c.coin} label={c.coin} value={c.volume} max={maxVolume} sub={`${c.count} tx`} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Licensed provider network</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {providers.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-surface-2 p-3">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <Store size={13} className="text-ink-faint" />
                    {p.name}
                  </p>
                  <ProviderStatusDot status={p.status} />
                </div>
                <p className="mt-2 text-xs text-ink-faint">{formatBps(p.feeBps)}</p>
                <p className="mt-1 text-xs text-ink-faint">{p.coins.join(", ")}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-ink">Recent transactions</h2>
            <Link href="/nodalis/app/transactions" className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:underline">
              View all
              <ArrowUpRight size={12} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyMini />
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <tbody>
                  {recent.map((tx) => (
                    <tr key={tx.id} className="border-t border-border">
                      <td className="py-2.5 pr-3">
                        <Link href={`/nodalis/app/transactions/${tx.id}`} className="font-medium text-ink hover:text-brand-500">
                          {formatUsd(tx.amount)}
                        </Link>
                      </td>
                      <td className="py-2.5 pr-3 text-ink-faint">{tx.coin}</td>
                      <td className="py-2.5 pr-3 text-ink-faint">{tx.customerRegion}</td>
                      <td className="py-2.5 pr-3">
                        <TransactionStatusBadge status={tx.status} />
                      </td>
                      <td className="py-2.5 text-ink-faint">{formatDateTime(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-xs font-medium text-ink-faint">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold text-ink">{value}</p>
    </Card>
  );
}

function MiniBar({ label, value, max, sub }: { label: string; value: number; max: number; sub: string }) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-ink-faint">
          {formatUsd(value)} · {sub}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EmptyMini() {
  return <p className="mt-4 text-sm text-ink-faint">No settled volume yet — create a payment link and try a checkout.</p>;
}
