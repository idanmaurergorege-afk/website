"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Card, Field } from "./ui";
import type { Coin, IntegrationType, Merchant, Provider, RoutingStrategy, SettlementMode } from "@/lib/nodalis/types";
import { COINS } from "@/lib/nodalis/types";

const SETTLEMENT_OPTIONS: { value: SettlementMode; label: string }[] = [
  { value: "fiat", label: "Fiat" },
  { value: "crypto", label: "Crypto" },
  { value: "split", label: "Split" },
];

const INTEGRATION_OPTIONS: { value: IntegrationType; label: string }[] = [
  { value: "hosted_checkout", label: "Hosted checkout" },
  { value: "pos", label: "QR-code POS" },
  { value: "api", label: "Developer API" },
];

export function MerchantSettingsForm() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [mode, setMode] = useState<SettlementMode>("fiat");
  const [splitPct, setSplitPct] = useState(50);
  const [preferredCoin, setPreferredCoin] = useState<Coin>("USDC");
  const [integrationType, setIntegrationType] = useState<IntegrationType>("hosted_checkout");
  const [routingStrategy, setRoutingStrategy] = useState<RoutingStrategy>("lowest_cost");
  const [preferredProviderId, setPreferredProviderId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const [merchantRes, providersRes] = await Promise.all([
      fetch("/api/nodalis/merchant").then((r) => r.json()),
      fetch("/api/nodalis/providers").then((r) => r.json()),
    ]);
    const m: Merchant = merchantRes.merchant;
    setMerchant(m);
    setProviders(providersRes.providers);
    setMode(m.settlementMode);
    setSplitPct(m.settlementSplitPct);
    setPreferredCoin(m.preferredCoin);
    setIntegrationType(m.integrationType);
    setRoutingStrategy(m.routingStrategy);
    setPreferredProviderId(m.preferredProviderId ?? providersRes.providers[0]?.id ?? "");
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/nodalis/merchant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settlementMode: mode,
        settlementSplitPct: splitPct,
        preferredCoin,
        integrationType,
        routingStrategy,
        preferredProviderId: routingStrategy === "preferred_provider" ? preferredProviderId : null,
      }),
    });
    await load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!merchant) {
    return <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-faint">Business profile, settlement, and routing preferences.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Business profile</h2>
          <dl className="mt-3 divide-y divide-border text-sm">
            <Row label="Business name" value={merchant.businessName} />
            <Row label="Business type" value={merchant.businessType} />
            <Row label="Country" value={merchant.country} />
            <Row label="Contact email" value={merchant.contactEmail} />
            <Row
              label="KYB status"
              value={
                <span className="flex items-center gap-1 text-positive">
                  <ShieldCheck size={13} />
                  Verified
                </span>
              }
            />
          </dl>
        </Card>

        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Settlement</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SETTLEMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value)}
                className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${
                  mode === opt.value ? "border-brand-500 bg-brand-500/5 text-brand-500" : "border-border text-ink hover:border-ink-faint"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {mode === "split" && (
            <div className="mt-4">
              <Field label={`Fiat share: ${splitPct}% (crypto: ${100 - splitPct}%)`}>
                <input type="range" min={0} max={100} step={5} value={splitPct} onChange={(e) => setSplitPct(Number(e.target.value))} className="w-full accent-brand-500" />
              </Field>
            </div>
          )}
          <div className="mt-4 max-w-xs">
            <Field label="Preferred settlement coin">
              <select value={preferredCoin} onChange={(e) => setPreferredCoin(e.target.value as Coin)} className="input">
                {COINS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Integration</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {INTEGRATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIntegrationType(opt.value)}
                className={`rounded-xl border p-3 text-left text-sm font-semibold transition ${
                  integrationType === opt.value ? "border-brand-500 bg-brand-500/5 text-brand-500" : "border-border text-ink hover:border-ink-faint"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-sm font-semibold text-ink">Routing strategy</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRoutingStrategy("lowest_cost")}
              className={`rounded-xl border p-3 text-left transition ${
                routingStrategy === "lowest_cost" ? "border-brand-500 bg-brand-500/5" : "border-border hover:border-ink-faint"
              }`}
            >
              <p className={`text-sm font-semibold ${routingStrategy === "lowest_cost" ? "text-brand-500" : "text-ink"}`}>Lowest cost, automatic</p>
              <p className="mt-1 text-xs text-ink-faint">Route each payment to the cheapest eligible, healthy provider.</p>
            </button>
            <button
              type="button"
              onClick={() => setRoutingStrategy("preferred_provider")}
              className={`rounded-xl border p-3 text-left transition ${
                routingStrategy === "preferred_provider" ? "border-brand-500 bg-brand-500/5" : "border-border hover:border-ink-faint"
              }`}
            >
              <p className={`text-sm font-semibold ${routingStrategy === "preferred_provider" ? "text-brand-500" : "text-ink"}`}>Prefer a specific provider</p>
              <p className="mt-1 text-xs text-ink-faint">Falls back automatically if it&rsquo;s ineligible.</p>
            </button>
          </div>
          {routingStrategy === "preferred_provider" && (
            <div className="mt-4 max-w-xs">
              <Field label="Preferred provider">
                <select value={preferredProviderId} onChange={(e) => setPreferredProviderId(e.target.value)} className="input">
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </Card>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/25 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm font-medium text-positive">
              <Check size={14} />
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
