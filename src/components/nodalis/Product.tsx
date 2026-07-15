import { Fragment } from "react";
import { ArrowDown, ChevronRight } from "lucide-react";
import { Section, SectionHeading, Card, DarkPanel, Reveal } from "./ui";

const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

function LayerRow({ label, items, highlight }: { label: string; items: string[]; highlight?: boolean }) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? "text-brand-300" : "text-white/45"}`}>
        {label}
      </p>
      <div className={`mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 ${LG_COLS[items.length] ?? "lg:grid-cols-4"}`}>
        {items.map((item) => (
          <div
            key={item}
            className={`rounded-lg border px-3 py-2.5 text-center text-xs font-medium sm:text-sm ${
              highlight
                ? "border-brand-400/40 bg-brand-500/20 text-white"
                : "border-white/10 bg-white/[0.04] text-white/80"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const onboardingSteps = [
  "Sign up & business profile",
  "KYB verification (routed to partner API)",
  "Configure settlement (fiat / crypto / split)",
  "Select integration (API, plugin, or POS)",
  "Go live — accept payments",
];

const paymentFlowSteps = [
  "Customer initiates payment (checkout / QR / payment link)",
  "Nodalis routing engine selects optimal licensed provider",
  "Provider settles on-chain / processes payment",
  "Nodalis receives webhook confirmation",
  "Funds settle to merchant (fiat / stablecoin / split)",
  "Unified transaction record in merchant dashboard & analytics",
];

const routingRules = [
  {
    title: "Geography",
    body: "Route EU transactions to MiCA-licensed partners, US transactions to GENIUS Act-compliant issuers.",
  },
  {
    title: "Currency / coin support",
    body: "Route based on which provider supports the requested stablecoin or asset (e.g., USDC-only vs. broader coin support).",
  },
  {
    title: "Cost & merchant preference",
    body: "Route to lowest-cost or merchant-preferred provider dynamically, with automatic failover if a provider is degraded.",
  },
];

export function Product() {
  return (
    <Section id="product">
      <SectionHeading eyebrow="Product" title="Platform architecture" />

      <Reveal delay={0.06} className="mt-8">
        <DarkPanel className="space-y-4">
          <LayerRow label="Merchant Layer" items={["Dashboard", "Hosted Checkout", "POS App", "Payment Links", "Developer APIs/SDKs"]} />
          <div className="flex justify-center text-white/30">
            <ArrowDown size={16} />
          </div>
          <LayerRow
            label="Nodalis Orchestration Layer"
            items={["KYB Engine", "Routing Engine", "Settlement Engine", "Webhooks & Events", "Analytics Engine", "Admin/White-Label Portal"]}
            highlight
          />
          <div className="flex justify-center text-white/30">
            <ArrowDown size={16} />
          </div>
          <LayerRow label="Provider Abstraction Interface" items={["Unified Provider Interface (UPI)"]} />
          <div className="flex justify-center text-white/30">
            <ArrowDown size={16} />
          </div>
          <LayerRow label="Licensed Provider Network" items={["BVNK", "BitPay", "Coinbase Commerce", "Triple-A", "+ future providers"]} />
        </DarkPanel>
        <p className="mt-3 text-sm italic text-ink-dim">
          Every provider implements the same interface — new providers plug in without merchants changing anything.
        </p>
      </Reveal>

      {/* Onboarding workflow */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Merchant onboarding workflow</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-stretch">
          {onboardingSteps.map((step, i) => {
            const last = i === onboardingSteps.length - 1;
            return (
              <Fragment key={step}>
                <div
                  className={`flex flex-1 flex-col items-center rounded-2xl border p-4 text-center ${
                    last ? "border-brand-500/40 bg-brand-500/10" : "border-border bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
                      last ? "bg-brand-500 text-white" : "bg-surface-3 text-ink"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="mt-2 text-xs leading-snug text-ink-dim sm:text-sm">{step}</span>
                </div>
                {!last && (
                  <div className="flex shrink-0 items-center justify-center text-ink-faint">
                    <ChevronRight size={16} className="rotate-90 sm:rotate-0" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </Reveal>
        <Reveal delay={0.12} className="mt-4 text-center sm:text-left">
          <span className="text-sm font-semibold text-brand-500">Typical time: days, not weeks.</span>
        </Reveal>
      </div>

      {/* Payment flow */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Payment flow</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paymentFlowSteps.map((step, i) => (
            <Card key={step} className={i === 1 ? "border-brand-500/40 bg-brand-500/5" : ""}>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-sm font-bold ${
                  i === 1 ? "bg-brand-500 text-white" : "bg-surface-3 text-ink"
                }`}
              >
                {i + 1}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">{step}</p>
            </Card>
          ))}
        </Reveal>
      </div>

      {/* Intelligent routing */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Intelligent multi-provider routing</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {routingRules.map((r, i) => (
            <Card key={r.title}>
              <span className="font-display text-sm font-bold text-brand-500">{`0${i + 1}`}</span>
              <h4 className="mt-2 font-display text-base font-semibold text-ink">{r.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{r.body}</p>
            </Card>
          ))}
        </Reveal>
        <Reveal delay={0.16} className="mt-4">
          <Card className="bg-surface-2">
            <p className="text-sm leading-relaxed text-ink-dim">
              This &ldquo;smart routing&rdquo; concept mirrors emerging category plays: Stripe launched a
              dashboard-level &ldquo;Orchestration&rdquo; product in 2025, and Meld positions as a multi-provider
              aggregation network reaching 50+ providers — validating demand for a category with no dominant
              merchant-facing leader today.
            </p>
          </Card>
        </Reveal>
        <p className="mt-3 text-xs text-ink-faint">Source: Stripe Newsroom · PR Newswire (Meld)</p>
      </div>
    </Section>
  );
}
