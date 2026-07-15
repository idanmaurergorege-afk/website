import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, Card, DarkPanel, Reveal, Sources } from "./ui";
import { FinancialProjectionChart } from "./charts";

const gtmPhases = [
  {
    title: "Phase 1 — Direct SMB & Digital-Native Merchants",
    body: "E-commerce plugins (Shopify/WooCommerce), self-serve onboarding; land through developer community and crypto-forward verticals (gaming, digital goods, luxury retail — 76–81% adoption interest per NCA/PayPal survey).",
  },
  {
    title: "Phase 2 — Mid-Market & PSP/ISO Partnerships",
    body: "White-label deals with regional PSPs and ISOs wanting crypto capability without building it; enterprise integrations sales motion.",
  },
  {
    title: "Phase 3 — Platform & Embedded Finance Expansion",
    body: "Expand into cross-border B2B payments, treasury, invoicing, and subscription billing as an embedded finance layer for the existing merchant base.",
  },
];

const roadmap = [
  { label: "Now", body: "Merchant onboarding/KYB, dashboard, hosted checkout, 2–3 launch provider integrations (BVNK, BitPay, Coinbase Commerce)" },
  { label: "Next 6–12 months", body: "QR POS, payment links, developer SDKs, webhooks, additional integrations (Triple-A, NOWPayments), white-label admin portal" },
  { label: "12–24 months", body: "Intelligent routing engine v2 (cost/geo-optimized), premium analytics tier, enterprise integrations, partner/ISO program launch" },
  { label: "24+ months", body: "Cross-border B2B payments, treasury management, invoicing & subscription billing, embedded finance partnerships" },
];

const visionItems = [
  "Stablecoin Payments (core, today)",
  "Cross-Border Business Payments",
  "Treasury Management",
  "Subscription Billing",
  "Invoicing",
  "Embedded Finance Integrations",
  "Additional Regulated Financial Services (via partners)",
];

const moatSteps = ["More providers + more merchants", "More transaction data", "Smarter routing", "Better merchant outcomes", "More merchants"];

export function Future() {
  return (
    <Section id="future">
      <SectionHeading eyebrow="GTM" title="Go-to-market strategy" />

      <div className="mt-10 space-y-4">
        {gtmPhases.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <Card className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 font-display text-base font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{p.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.28} className="mt-4">
        <p className="text-sm italic text-ink-dim">
          Beachhead geographies aligned to regulatory clarity: US (post-GENIUS implementation, mid-2026 onward)
          and EU (post-MiCA full enforcement, July 2026 onward).
        </p>
      </Reveal>
      <Sources>PayPal/Harris Poll</Sources>

      {/* Roadmap */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Product roadmap</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r, i) => (
            <DarkPanel key={r.label} className="h-full">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-brand-400" : "border border-white/30"}`} />
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">{r.label}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{r.body}</p>
            </DarkPanel>
          ))}
        </Reveal>
      </div>

      {/* Financial projections */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Financial projections — illustrative</h3>
        </Reveal>
        <Reveal delay={0.04} className="mt-2 max-w-3xl text-sm italic text-ink-faint">
          Illustrative projection — directional ramp only, not a forecast. Actual figures depend on provider
          partnerships and routed volume attach rate.
        </Reveal>
        <Reveal delay={0.08} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <Card>
            <FinancialProjectionChart />
          </Card>
          <DarkPanel className="h-full">
            <h4 className="font-display text-base font-semibold text-white">Growth pacing benchmark</h4>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-white/70">
                <span className="font-semibold text-brand-400">Ramp:</span> $0 → $100M ARR in ~2 years
              </p>
              <p className="text-white/70">
                <span className="font-semibold text-brand-400">Brex:</span> $0 → ~$100M ARR in ~18 months
              </p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/55">
              Fintech/payments platforms compress the classic 5–7 year SaaS ramp because revenue scales with
              GMV/payment volume, not logo count alone.
            </p>
          </DarkPanel>
        </Reveal>
        <Sources>Sacra (Ramp) · Tianpan Co (Brex vs Ramp)</Sources>
      </div>

      {/* Long-term vision */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            From merchant OS to the global operating system for digital asset payments
          </h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visionItems.map((v, i) => (
            <div
              key={v}
              className={`flex items-center justify-center rounded-xl border p-5 text-center text-sm font-medium ${
                i === 0
                  ? "border-brand-500/40 bg-brand-500 text-white"
                  : "border-border bg-surface text-ink-dim"
              }`}
            >
              {v}
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.12} className="mt-4">
          <p className="text-sm italic leading-relaxed text-ink-dim sm:text-base">
            &ldquo;Just as Stripe expanded from card checkout into a full financial infrastructure platform,
            Nodalis expands from crypto checkout into the complete merchant financial operating system — without
            ever becoming a licensed processor itself.&rdquo;
          </p>
        </Reveal>
      </div>

      {/* Moat */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Technical philosophy — why this architecture wins
          </h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-4 max-w-3xl text-base leading-relaxed text-ink-dim">
          Provider-agnostic, API-first, cloud-native, and highly scalable. Every provider implements the same
          interface, so new providers add without disrupting the merchant experience. The platform intelligently
          routes based on geography, currency, merchant preference, or pricing.
        </Reveal>
        <Reveal delay={0.12} className="mt-8 flex flex-col items-stretch gap-2 overflow-x-auto pb-2 sm:flex-row sm:items-center">
          {moatSteps.map((step, i) => {
            const last = i === moatSteps.length - 1;
            return (
              <div key={step} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex-1 rounded-xl px-4 py-4 text-center text-sm font-medium ${
                    last ? "bg-brand-500 text-white" : "bg-[#141a26] text-white/85"
                  }`}
                >
                  {step}
                </div>
                {!last && <ArrowRight size={16} className="hidden shrink-0 text-ink-faint sm:block" />}
              </div>
            );
          })}
        </Reveal>
        <Reveal delay={0.18} className="mt-4">
          <p className="text-sm italic leading-relaxed text-ink-dim sm:text-base">
            This durable moat compounds over time: provider relationships and licenses can be replicated, but a
            mature routing engine, merchant trust, and a unified data layer cannot be copied overnight.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
