"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, TransactionStatusBadge, EmptyState } from "./ui";
import { formatUsd, formatDateTime } from "@/lib/nodalis/format";
import type { Transaction, TransactionStatus } from "@/lib/nodalis/types";

const FILTERS: { value: TransactionStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "settled", label: "Settled" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export function TransactionsListPage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [filter, setFilter] = useState<TransactionStatus | "all">("all");

  const load = useCallback(async (status: TransactionStatus | "all") => {
    const qs = status === "all" ? "" : `?status=${status}`;
    const res = await fetch(`/api/nodalis/transactions${qs}`);
    const data = await res.json();
    setTransactions(data.transactions);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(filter);
    const interval = setInterval(() => load(filter), 4000);
    return () => clearInterval(interval);
  }, [load, filter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Transactions</h1>
        <p className="mt-1 text-sm text-ink-faint">Every payment routed through your provider network.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === f.value ? "bg-brand-500/15 text-brand-500 ring-1 ring-brand-500/30" : "bg-surface text-ink-dim hover:text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {transactions === null && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      )}

      {transactions !== null && transactions.length === 0 && (
        <EmptyState title="No transactions" body="Payments processed through your checkout, links, or POS will show up here." />
      )}

      {transactions !== null && transactions.length > 0 && (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Coin</th>
                  <th className="px-4 py-3 font-medium">Region</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-surface-2">
                    <td className="px-4 py-3">
                      <Link href={`/nodalis/app/transactions/${tx.id}`} className="font-medium text-ink hover:text-brand-500">
                        {formatUsd(tx.amount)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-dim">{tx.coin}</td>
                    <td className="px-4 py-3 text-ink-dim">{tx.customerRegion}</td>
                    <td className="px-4 py-3 text-ink-dim">
                      {tx.routingDetail.candidates.find((c) => c.chosen)?.providerName ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <TransactionStatusBadge status={tx.status} />
                    </td>
                    <td className="px-4 py-3 text-ink-faint">{formatDateTime(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
