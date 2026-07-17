"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { Card, Field } from "./ui";
import type { Merchant, Provider, Coin, SettlementMode, IntegrationType, RoutingStrategy } from "@/lib/nodalis/types";
import { BUSINESS_TYPES, COUNTRIES, COINS } from "@/lib/nodalis/types";

const STEPS = ["Business profile", "KYB verification", "Settlement", "Integration", "Go live"];

export function OnboardingWizard({ initialMerchant }: { initialMerchant: Merchant | null }) {
  const router = useRouter();
  const [merchant, setMerchant] = useState<Merchant | null>(initialMerchant);
  const [step, setStep] = useState(initialMerchant?.onboardingStep ?? 1);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    fetch("/api/nodalis/providers")
      .then((r) => r.json())
      .then((d) => setProviders(d.providers ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-0">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">Merchant onboarding</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Set up your Nodalis account</h1>
      </div>

      <Stepper current={step} />

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <BusinessProfileStep
                onDone={(m) => {
                  setMerchant(m);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && merchant && (
              <KybStep
                merchant={merchant}
                onDone={(m) => {
                  setMerchant(m);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && merchant && (
              <SettlementStep
                merchant={merchant}
                onDone={(m) => {
                  setMerchant(m);
                  setStep(4);
                }}
              />
            )}
            {step === 4 && merchant && (
              <IntegrationStep
                merchant={merchant}
                providers={providers}
                onDone={(m) => {
                  setMerchant(m);
                  setStep(5);
                }}
              />
            )}
            {step === 5 && merchant && (
              <ReviewStep
                merchant={merchant}
                providers={providers}
                onDone={() => router.push("/nodalis/app")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-2 last:flex-none">
            <div className="flex w-full items-center">
              {i > 0 && <div className={`h-px flex-1 ${done || active ? "bg-brand-500" : "bg-border"}`} />}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${
                  done
                    ? "bg-brand-500 text-white"
                    : active
                      ? "bg-brand-500/15 text-brand-500 ring-2 ring-brand-500"
                      : "bg-surface-3 text-ink-faint"
                }`}
              >
                {done ? <Check size={14} /> : n}
              </span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? "bg-brand-500" : "bg-border"}`} />}
            </div>
            <span className={`hidden text-center text-[11px] sm:block ${active ? "text-ink" : "text-ink-faint"}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function BusinessProfileStep({ onDone }: { onDone: (m: Merchant) => void }) {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [contactEmail, setContactEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!businessName.trim() || !contactEmail.trim()) {
      setError("Business name and contact email are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/nodalis/merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, businessType, country, contactEmail }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onDone(data.merchant);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepCard title="Tell us about your business" subtitle="This creates your merchant profile.">
        <div className="space-y-4">
          <Field label="Business name">
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Storefront" className="input" required />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Business type">
              <select value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="input">
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Country">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="input">
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Contact email">
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="finance@acme.com"
              className="input"
              required
            />
          </Field>
        </div>
        {error && <p className="mt-3 text-sm text-negative">{error}</p>}
        <div className="mt-6">
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Continue"}</PrimaryButton>
        </div>
      </StepCard>
    </form>
  );
}

function KybStep({ merchant, onDone }: { merchant: Merchant; onDone: (m: Merchant) => void }) {
  const [verifying, setVerifying] = useState(false);

  async function handleVerify() {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1300));
    const res = await fetch("/api/nodalis/merchant/verify", { method: "POST" });
    const data = await res.json();
    setVerifying(false);
    onDone(data.merchant);
  }

  return (
    <StepCard title="Know-your-business verification" subtitle="Routed to our licensed partners' compliance API.">
      <div className="rounded-xl border border-border bg-surface-2 p-4 text-sm">
        <p className="font-medium text-ink">{merchant.businessName}</p>
        <p className="mt-0.5 text-ink-faint">{merchant.businessType} · {merchant.country} · {merchant.contactEmail}</p>
      </div>
      <div className="mt-5">
        <PrimaryButton type="button" onClick={handleVerify} disabled={verifying}>
          {verifying ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={15} className="animate-spin" />
              Verifying with partner compliance API…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShieldCheck size={15} />
              Run KYB verification
            </span>
          )}
        </PrimaryButton>
      </div>
    </StepCard>
  );
}

const SETTLEMENT_OPTIONS: { value: SettlementMode; label: string; body: string }[] = [
  { value: "fiat", label: "Fiat", body: "Receive net proceeds converted to USD." },
  { value: "crypto", label: "Crypto", body: "Keep net proceeds in your preferred stablecoin." },
  { value: "split", label: "Split", body: "Divide net proceeds between fiat and crypto." },
];

function SettlementStep({ merchant, onDone }: { merchant: Merchant; onDone: (m: Merchant) => void }) {
  const [mode, setMode] = useState<SettlementMode>(merchant.settlementMode);
  const [splitPct, setSplitPct] = useState(merchant.settlementSplitPct);
  const [preferredCoin, setPreferredCoin] = useState<Coin>(merchant.preferredCoin);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    const res = await fetch("/api/nodalis/merchant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settlementMode: mode, settlementSplitPct: splitPct, preferredCoin, onboardingStep: 4 }),
    });
    const data = await res.json();
    setSaving(false);
    onDone(data.merchant);
  }

  return (
    <StepCard title="Configure settlement" subtitle="How should proceeds land after a payment settles?">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SETTLEMENT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            className={`rounded-xl border p-3 text-left transition ${
              mode === opt.value ? "border-brand-500 bg-brand-500/5" : "border-border hover:border-ink-faint"
            }`}
          >
            <p className={`text-sm font-semibold ${mode === opt.value ? "text-brand-500" : "text-ink"}`}>{opt.label}</p>
            <p className="mt-1 text-xs text-ink-faint">{opt.body}</p>
          </button>
        ))}
      </div>

      {mode === "split" && (
        <div className="mt-4">
          <Field label={`Fiat share: ${splitPct}% (crypto: ${100 - splitPct}%)`}>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={splitPct}
              onChange={(e) => setSplitPct(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </Field>
        </div>
      )}

      <div className="mt-4">
        <Field label="Preferred settlement coin" help="Used when proceeds settle in crypto.">
          <select value={preferredCoin} onChange={(e) => setPreferredCoin(e.target.value as Coin)} className="input">
            {COINS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <PrimaryButton type="button" onClick={handleSubmit} disabled={saving}>{saving ? "Saving…" : "Continue"}</PrimaryButton>
      </div>
    </StepCard>
  );
}

const INTEGRATION_OPTIONS: { value: IntegrationType; label: string; body: string }[] = [
  { value: "hosted_checkout", label: "Hosted checkout", body: "Shareable payment links & branded checkout pages." },
  { value: "pos", label: "QR-code POS", body: "Scan-to-pay for in-person sales." },
  { value: "api", label: "Developer API", body: "Integrate the unified API directly." },
];

function IntegrationStep({
  merchant,
  providers,
  onDone,
}: {
  merchant: Merchant;
  providers: Provider[];
  onDone: (m: Merchant) => void;
}) {
  const [integrationType, setIntegrationType] = useState<IntegrationType>(merchant.integrationType);
  const [routingStrategy, setRoutingStrategy] = useState<RoutingStrategy>(merchant.routingStrategy);
  const [preferredProviderId, setPreferredProviderId] = useState(merchant.preferredProviderId ?? providers[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    const res = await fetch("/api/nodalis/merchant", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        integrationType,
        routingStrategy,
        preferredProviderId: routingStrategy === "preferred_provider" ? preferredProviderId : null,
        onboardingStep: 5,
      }),
    });
    const data = await res.json();
    setSaving(false);
    onDone(data.merchant);
  }

  return (
    <StepCard title="Select your integration" subtitle="You can change this anytime in Settings.">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {INTEGRATION_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setIntegrationType(opt.value)}
            className={`rounded-xl border p-3 text-left transition ${
              integrationType === opt.value ? "border-brand-500 bg-brand-500/5" : "border-border hover:border-ink-faint"
            }`}
          >
            <p className={`text-sm font-semibold ${integrationType === opt.value ? "text-brand-500" : "text-ink"}`}>{opt.label}</p>
            <p className="mt-1 text-xs text-ink-faint">{opt.body}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <p className="text-xs font-medium text-ink-dim">Routing strategy</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <p className="mt-1 text-xs text-ink-faint">Fall back automatically only if it&rsquo;s ineligible.</p>
          </button>
        </div>
        {routingStrategy === "preferred_provider" && (
          <Field label="Preferred provider">
            <select value={preferredProviderId} onChange={(e) => setPreferredProviderId(e.target.value)} className="input">
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <div className="mt-6">
        <PrimaryButton type="button" onClick={handleSubmit} disabled={saving}>{saving ? "Saving…" : "Continue"}</PrimaryButton>
      </div>
    </StepCard>
  );
}

function ReviewStep({
  merchant,
  providers,
  onDone,
}: {
  merchant: Merchant;
  providers: Provider[];
  onDone: () => void;
}) {
  const [activating, setActivating] = useState(false);
  const preferredProvider = providers.find((p) => p.id === merchant.preferredProviderId);

  async function handleActivate() {
    setActivating(true);
    await fetch("/api/nodalis/merchant/activate", { method: "POST" });
    onDone();
  }

  return (
    <StepCard title="Review & go live" subtitle="Typical time: days, not weeks — for you, a click.">
      <dl className="divide-y divide-border rounded-xl border border-border text-sm">
        <Row label="Business" value={merchant.businessName} />
        <Row label="KYB status" value="Verified" />
        <Row label="Settlement" value={merchant.settlementMode === "split" ? `Split ${merchant.settlementSplitPct}/${100 - merchant.settlementSplitPct} (fiat/crypto)` : merchant.settlementMode} />
        <Row label="Preferred coin" value={merchant.preferredCoin} />
        <Row label="Integration" value={merchant.integrationType.replace("_", " ")} />
        <Row
          label="Routing"
          value={merchant.routingStrategy === "lowest_cost" ? "Lowest cost, automatic" : `Prefer ${preferredProvider?.name ?? "provider"}`}
        />
      </dl>
      <div className="mt-6">
        <PrimaryButton type="button" onClick={handleActivate} disabled={activating}>
          {activating ? "Going live…" : "Go live — accept payments"}
        </PrimaryButton>
      </div>
    </StepCard>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="font-medium capitalize text-ink">{value}</dd>
    </div>
  );
}
