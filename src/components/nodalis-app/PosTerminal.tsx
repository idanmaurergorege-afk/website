"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { Card, TransactionStatusBadge } from "./ui";
import { formatUsd } from "@/lib/nodalis/format";
import type { PaymentLink, Transaction } from "@/lib/nodalis/types";

export function PosTerminal({
  link,
  qrSvg,
  checkoutUrl,
}: {
  link: PaymentLink;
  qrSvg: string;
  checkoutUrl: string;
}) {
  const sessionStart = useRef<number | null>(null);
  const [result, setResult] = useState<Transaction | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    sessionStart.current = Date.now();
  }, [tick]);

  const poll = useCallback(async () => {
    const since = sessionStart.current;
    if (since == null) return;
    const res = await fetch(`/api/nodalis/transactions?paymentLinkId=${link.id}`);
    const data = await res.json();
    const match = (data.transactions as Transaction[]).find(
      (t) => new Date(t.createdAt).getTime() >= since && t.status !== "pending",
    );
    if (match) setResult(match);
  }, [link.id]);

  useEffect(() => {
    if (result) return;
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [poll, result]);

  function reset() {
    setResult(null);
    setTick((t) => t + 1);
  }

  return (
    <div className="mx-auto max-w-sm">
      <Card className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">QR-code POS terminal</p>
        <h1 className="mt-1 font-display text-lg font-semibold text-ink">{link.title}</h1>
        <p className="mt-1 font-display text-3xl font-bold text-brand-500">{formatUsd(link.amount)}</p>

        {!result && (
          <div key={tick}>
            <div className="mx-auto mt-5 w-fit rounded-xl bg-white p-3" dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <p className="mt-4 break-all text-[11px] text-ink-faint">{checkoutUrl}</p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-dim">
              <Loader2 size={15} className="animate-spin text-brand-500" />
              Waiting for payment…
            </div>
          </div>
        )}

        {result && (
          <div className="mt-5">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                result.status === "settled" ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
              }`}
            >
              {result.status === "settled" ? <Check size={26} /> : <X size={26} />}
            </div>
            <p className="mt-3 font-display text-base font-semibold text-ink">
              {result.status === "settled" ? "Payment received" : "Payment failed"}
            </p>
            <div className="mt-2 flex justify-center">
              <TransactionStatusBadge status={result.status} />
            </div>
            <p className="mt-2 text-sm text-ink-faint">
              {result.coin} from {result.customerRegion}
            </p>
            <button
              onClick={reset}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25"
            >
              <RotateCcw size={14} />
              New sale
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
