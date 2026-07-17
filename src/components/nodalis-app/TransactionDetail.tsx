"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Undo2, Sparkles, Route, Zap, RotateCcw } from "lucide-react";
import { Card, TransactionStatusBadge, ProviderStatusDot } from "./ui";
import { formatUsd, formatBps, formatDateTime } from "@/lib/nodalis/format";
import type { NodalisEventType, TransactionWithEvents } from "@/lib/nodalis/types";

const EVENT_ICON: Record<NodalisEventType, React.ComponentType<{ size?: number; className?: string }>> = {
  "payment.created": Sparkles,
  "routing.decision": Route,
  "payment.settled": CheckCircle2,
  "payment.failed": XCircle,
  "payment.refunded": Undo2,
};

export function TransactionDetail({ id }: { id: string }) {
  const [tx, setTx] = useState<TransactionWithEvents | null>(null);
  const [refunding, setRefunding] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/nodalis/transactions/${id}`);
    if (!res.ok) return setTx(null);
    const data = await res.json();
    setTx(data.transaction);
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, [load]);

  async function handleRefund() {
    setRefunding(true);
    await fetch(`/api/nodalis/transactions/${id}/refund`, { method: "POST" });
    await load();
    setRefunding(false);
  }

  if (!tx) {
    return <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />;
  }

  return (
    <div>
      <Link href="/nodalis/app/transactions" className="mb-4 flex items-center gap-1.5 text-sm text-ink-dim hover:text-ink">
        <ArrowLeft size={14} />
        Back to transactions
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{formatUsd(tx.amount)}</h1>
          <p className="mt-1 text-sm text-ink-faint">{tx.paymentLinkTitle ?? "Direct payment"}</p>
        </div>
        <div className="flex items-center gap-3">
          <TransactionStatusBadge status={tx.status} />
          {tx.status === "settled" && (
            <button
              onClick={handleRefund}
              disabled={refunding}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink-dim hover:text-negative disabled:opacity-60"
            >
              <RotateCcw size={14} />
              {refunding ? "Refunding…" : "Refund"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Payment summary</h2>
          <dl className="mt-3 divide-y divide-border text-sm">
            <Row label="Requested" value={`${formatUsd(tx.amount)} (${tx.coin})`} />
            <Row label="Customer region" value={tx.customerRegion} />
            <Row label="Provider" value={tx.providerName ?? "None (routing failed)"} />
            <Row label="Fee" value={tx.feeBps != null ? `${formatBps(tx.feeBps)} · ${formatUsd(tx.feeAmount ?? 0)}` : "—"} />
            <Row label="Net to merchant" value={tx.netAmount != null ? formatUsd(tx.netAmount) : "—"} />
            <Row
              label="Settlement"
              value={
                tx.settledFiatAmount != null
                  ? `${formatUsd(tx.settledFiatAmount)} fiat / ${formatUsd(tx.settledCryptoAmount ?? 0)} crypto`
                  : "—"
              }
            />
            <Row label="Created" value={formatDateTime(tx.createdAt)} />
            {tx.settledAt && <Row label="Settled" value={formatDateTime(tx.settledAt)} />}
            {tx.refundedAt && <Row label="Refunded" value={formatDateTime(tx.refundedAt)} />}
          </dl>
        </Card>

        <Card>
          <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
            <Zap size={14} className="text-brand-500" />
            Routing decision
          </h2>
          <p className="mt-1 text-xs text-ink-faint">{tx.routingDetail.summary}</p>
          <ul className="mt-3 space-y-2">
            {tx.routingDetail.candidates.map((c) => (
              <li
                key={c.providerId}
                className={`rounded-lg border p-2.5 text-xs ${
                  c.chosen ? "border-brand-500/40 bg-brand-500/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 font-medium ${c.chosen ? "text-brand-500" : "text-ink"}`}>
                    {c.chosen ? (
                      <CheckCircle2 size={13} />
                    ) : c.eligible ? (
                      <MinusCircle size={13} className="text-ink-faint" />
                    ) : (
                      <XCircle size={13} className="text-ink-faint" />
                    )}
                    {c.providerName}
                  </span>
                  <ProviderStatusDot status={c.status} />
                </div>
                <p className="mt-1 text-ink-faint">{c.reason}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Event timeline</h2>
          <ul className="mt-3 space-y-3">
            {tx.events.map((e) => {
              const Icon = EVENT_ICON[e.type];
              return (
                <li key={e.id} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-dim">
                    <Icon size={13} />
                  </div>
                  <div>
                    <p className="text-sm text-ink">{e.message}</p>
                    <p className="text-xs text-ink-faint">{formatDateTime(e.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-right font-medium capitalize text-ink">{value}</dd>
    </div>
  );
}
