"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react";
import { formatUsd, formatBps } from "@/lib/nodalis/format";
import type { Coin, PaymentLink, Region, Transaction } from "@/lib/nodalis/types";
import { REGIONS } from "@/lib/nodalis/types";

type Phase = "loading" | "not_found" | "form" | "processing" | "receipt";

export function CheckoutPage({ linkId }: { linkId: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [coin, setCoin] = useState<Coin | "">("");
  const [region, setRegion] = useState<Region>("US");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/nodalis/pay/${linkId}`)
      .then(async (r) => {
        if (!r.ok) {
          setPhase("not_found");
          return;
        }
        const data = await r.json();
        if (data.link.status !== "active") {
          setPhase("not_found");
          return;
        }
        setLink(data.link);
        setBusinessName(data.businessName);
        setCoin(data.link.allowedCoins[0] ?? "");
        setPhase("form");
      })
      .catch(() => setPhase("not_found"));
  }, [linkId]);

  useEffect(() => {
    if (phase !== "processing" || !transaction) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/nodalis/transactions/${transaction.id}`);
      const data = await res.json();
      if (data.transaction.status !== "pending") {
        setTransaction(data.transaction);
        setPhase("receipt");
      }
    }, 700);
    return () => clearInterval(interval);
  }, [phase, transaction]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!coin || !link) return;
    setError(null);
    const res = await fetch(`/api/nodalis/pay/${linkId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coin, region }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setTransaction(data.transaction);
    if (data.transaction.status === "failed") {
      setPhase("receipt");
    } else {
      setPhase("processing");
    }
  }

  if (phase === "loading") {
    return <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />;
  }

  if (phase === "not_found") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <XCircle size={28} className="mx-auto text-ink-faint" />
        <p className="mt-3 font-display text-base font-semibold text-ink">This payment link is no longer available</p>
        <p className="mt-1 text-sm text-ink-faint">It may have been archived by the merchant.</p>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <Loader2 size={28} className="mx-auto animate-spin text-brand-500" />
        <p className="mt-3 font-display text-base font-semibold text-ink">Routing your payment…</p>
        <p className="mt-1 text-sm text-ink-faint">Selecting the best licensed provider for {coin} from {region}.</p>
      </div>
    );
  }

  if (phase === "receipt" && transaction) {
    const settled = transaction.status === "settled";
    const chosen = transaction.routingDetail.candidates.find((c) => c.chosen);
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            settled ? "bg-positive/15 text-positive" : "bg-negative/15 text-negative"
          }`}
        >
          {settled ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
        </div>
        <p className="mt-3 font-display text-lg font-semibold text-ink">
          {settled ? "Payment successful" : "Payment could not be routed"}
        </p>
        <p className="mt-1 text-sm text-ink-faint">{transaction.routingDetail.summary}</p>

        {settled && (
          <dl className="mt-5 space-y-2 rounded-xl border border-border bg-surface-2 p-4 text-left text-sm">
            <Row label="Provider" value={chosen?.providerName ?? "—"} />
            <Row label="Fee" value={transaction.feeBps != null ? formatBps(transaction.feeBps) : "—"} />
            <Row label="Merchant receives" value={transaction.netAmount != null ? formatUsd(transaction.netAmount) : "—"} />
            <Row label="Transaction ID" value={transaction.id.slice(0, 8)} />
          </dl>
        )}

        <p className="mt-5 text-xs text-ink-faint">
          This created a real record in the merchant&rsquo;s dashboard —{" "}
          <Link href={`/nodalis/app/transactions/${transaction.id}`} className="inline-flex items-center gap-0.5 text-brand-500 hover:underline">
            view it
            <ArrowUpRight size={11} />
          </Link>
        </p>

        {!settled && (
          <button
            onClick={() => setPhase("form")}
            className="mt-5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/25"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!link) return null;

  return (
    <form onSubmit={handlePay} className="rounded-2xl border border-border bg-surface p-8">
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-ink-faint">{businessName}</p>
      <h1 className="mt-1 text-center font-display text-lg font-semibold text-ink">{link.title}</h1>
      <p className="mt-1 text-center font-display text-3xl font-bold text-brand-500">{formatUsd(link.amount)}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-dim">Paying from</label>
          <select value={region} onChange={(e) => setRegion(e.target.value as Region)} className="input">
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-dim">Pay with</label>
          <div className="flex flex-wrap gap-2">
            {link.allowedCoins.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCoin(c)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  coin === c ? "border-brand-500 bg-brand-500/10 text-brand-500" : "border-border text-ink-dim"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-negative">{error}</p>}

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25"
      >
        Pay {formatUsd(link.amount)}
      </button>
      <p className="mt-3 text-center text-[11px] text-ink-faint">Powered by Nodalis · not a processor, exchange, or custodian</p>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
