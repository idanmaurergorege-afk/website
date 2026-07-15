import { Sparkles, Store, Building2, TrendingUp } from "lucide-react";
import { Section, SectionHeading, Card, DarkPanel, Reveal, Sources } from "./ui";

const merchantFeatures = [
  { title: "Merchant Onboarding & KYB Workflow", body: "Guided signup routed to partner compliance APIs" },
  { title: "Merchant Dashboard", body: "Unified control center across all providers" },
  { title: "Hosted Crypto Checkout Pages", body: "Ready-made, branded checkout flows" },
  { title: "QR-Code POS Payments", body: "In-person acceptance via scan-to-pay" },
  { title: "Payment Links", body: "Shareable links for remote & invoice payments" },
  { title: "Transaction History", body: "Full cross-provider record with search & filters" },
  { title: "Refund Management", body: "One workflow to process refunds across providers" },
];

const infraFeatures = [
  { title: "Multi-Provider Payment Routing", body: "Smart routing engine across all licensed partners" },
  { title: "Developer APIs & SDKs", body: "Node.js, Python, PHP, Java client libraries" },
  { title: "Webhooks", body: "Real-time events for payments, refunds, settlement" },
  { title: "Analytics & Reporting", body: "Cross-provider performance and reconciliation views" },
  { title: "Settlement Management", body: "Fiat, crypto, or split settlement configuration" },
  { title: "Team Management", body: "Role-based access for merchant staff" },
  { title: "White-Label Capability", body: "Admin Portal for partners & platform-level management" },
];

function FeatureGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((f) => (
        <Card key={f.title}>
          <h4 className="font-display text-sm font-semibold text-ink">{f.title}</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{f.body}</p>
        </Card>
      ))}
    </div>
  );
}

export function ProductFeatures() {
  return (
    <Section id="features" noBorder>
      <SectionHeading eyebrow="Product" title="Core platform features" />

      <div className="mt-10">
        <Reveal>
          <h3 className="font-display text-lg font-semibold text-ink">Merchant-facing</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-4">
          <FeatureGrid items={merchantFeatures} />
        </Reveal>
      </div>

      <div className="mt-10">
        <Reveal>
          <h3 className="font-display text-lg font-semibold text-ink">Infrastructure &amp; partner</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-4">
          <FeatureGrid items={infraFeatures} />
        </Reveal>
      </div>

      {/* Developer platform */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Built API-first, for engineering teams who don&rsquo;t want to touch blockchain infrastructure
          </h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
          <Card>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
              <Sparkles size={17} />
            </div>
            <h4 className="mt-4 font-display text-base font-semibold text-ink">API &amp; SDK layer</h4>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-dim">
              <li>
                Single unified REST API + SDKs (Node.js, Python, PHP, Java) abstracting every provider&rsquo;s
                distinct API
              </li>
              <li>Webhook event system for payment confirmations, refunds, and settlement status</li>
              <li>Sandbox / test-mode environment for safe integration testing</li>
            </ul>
          </Card>
          <DarkPanel>
            <h4 className="font-display text-base font-semibold text-white">Plugin ecosystem targets</h4>
            <div className="mt-3 space-y-2">
              {["Shopify", "WooCommerce", "Magento"].map((p) => (
                <div key={p} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/85">
                  {p}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs italic text-white/55">
              Coinbase, Shopify, and Stripe are already integrating USDC checkout into Shopify&rsquo;s ecosystem —
              a clear market signal.
            </p>
          </DarkPanel>
        </Reveal>
        <Sources>WhiteSight</Sources>
      </div>

      {/* White label */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            A platform partners can rebrand as their own
          </h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-4 max-w-3xl text-base leading-relaxed text-ink-dim">
          PSPs, ISOs, and fintechs can white-label Nodalis&rsquo;s full merchant OS under their own brand, with a
          dedicated Admin Portal for platform-level management.
        </Reveal>
        <Reveal delay={0.1} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Store, title: "Merchant Oversight", body: "Full visibility into onboarded merchants across the partner's book" },
            { icon: Building2, title: "Provider Configuration", body: "Partner-level control over which licensed providers are routed to" },
            { icon: TrendingUp, title: "Revenue Share Reporting", body: "Transparent reporting for partner economics and reconciliation" },
          ].map((c) => (
            <Card key={c.title}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                <c.icon size={17} />
              </div>
              <h4 className="mt-4 font-display text-sm font-semibold text-ink">{c.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{c.body}</p>
            </Card>
          ))}
        </Reveal>
        <Reveal delay={0.16} className="mt-4">
          <p className="text-sm italic text-brand-500">
            Positioned as a channel-expansion strategy alongside direct merchant acquisition.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
