import { Section, SectionHeading, Card, DarkPanel, StatTile, Reveal, Sources } from "./ui";

const revenueStreams = [
  "Monthly SaaS Subscriptions",
  "Merchant Setup & Onboarding Fees",
  "Transaction-Based Revenue (via commercial agreements with providers)",
  "Enterprise Integrations",
  "White-Label Licensing",
  "Premium Analytics & API Plans",
];

const pricingRows: { label: string; starter: string; growth: string; enterprise: string }[] = [
  { label: "Target", starter: "SMBs", growth: "Mid-market", enterprise: "Enterprise" },
  { label: "Monthly fee", starter: "Low", growth: "Moderate", enterprise: "Custom" },
  { label: "Take rate (bps on routed volume)", starter: "Higher", growth: "Lower", enterprise: "Lowest at scale" },
  { label: "Dashboard analytics", starter: "Basic", growth: "Included", enterprise: "Included + custom" },
  { label: "Support", starter: "Standard", growth: "Priority", enterprise: "Dedicated" },
  { label: "White-label option", starter: "—", growth: "—", enterprise: "Available" },
];

const unitEconomics = [
  { value: "~0.8%", label: "Median net payments take rate as % of GMV, vertical SaaS benchmark (1st quartile 0.33%, 3rd quartile 1.00%)" },
  { value: "25–40%", label: "Share of total revenue mature vertical SaaS + embedded fintech platforms generate from embedded fintech; 2–5x expanded TAM per customer" },
  { value: "10–30%", label: "Share of ARR payments programs typically reach within 18–36 months of launch" },
];

export function Business() {
  return (
    <Section id="business">
      <SectionHeading
        eyebrow="Revenue Model"
        title="Six revenue streams, blending predictable SaaS with volume-linked upside"
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {revenueStreams.map((r, i) => (
          <Reveal key={r} delay={i * 0.05}>
            <Card className="h-full">
              <span className="font-display text-sm font-bold text-brand-500">{`0${i + 1}`}</span>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">{r}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Pricing */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Monetization detail — illustrative pricing framework
          </h3>
        </Reveal>
        <Reveal delay={0.04} className="mt-2 max-w-3xl text-sm italic text-ink-faint">
          Illustrative pricing framework — these tiers are the company&rsquo;s own assumptions, not sourced
          third-party data.
        </Reveal>

        <Reveal delay={0.08} className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="bg-surface-2 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  &nbsp;
                </th>
                <th className="bg-[#141a26] px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-white">Starter</th>
                <th className="bg-brand-500 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-white">Growth</th>
                <th className="bg-[#141a26] px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-white">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {pricingRows.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2"}>
                  <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-ink-dim">{row.starter}</td>
                  <td className="px-4 py-3 text-ink-dim">{row.growth}</td>
                  <td className="px-4 py-3 text-ink-dim">{row.enterprise}</td>
                </tr>
              ))}
              <tr className="bg-brand-500/10">
                <td className="px-4 py-3 font-semibold text-ink" colSpan={1}>
                  Est. blended take rate
                </td>
                <td className="px-4 py-3 font-semibold text-brand-500" colSpan={3}>
                  15–40 bps net, blended with recurring SaaS fees
                </td>
              </tr>
            </tbody>
          </table>
        </Reveal>
        <Reveal delay={0.12} className="mt-3 max-w-4xl text-xs italic text-ink-faint">
          Comparable orchestration/infrastructure models (BVNK, Zero Hash) run 10–40 bps blended take rate; full
          PayFac-style vertical SaaS payment models run 50–100+ bps. This deck assumes a blended model in between,
          reflecting software-plus-orchestration positioning.
        </Reveal>
        <Sources>Fintech Blueprint / Lex Substack · Sacra (Zero Hash) · Apideck</Sources>
      </div>

      {/* Unit economics */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Unit economics / financial assumptions
          </h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {unitEconomics.map((s, i) => (
            <Reveal key={s.value} delay={i * 0.06}>
              <StatTile value={s.value} label={s.label} className="h-full" />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-4">
          <DarkPanel>
            <p className="text-sm leading-relaxed text-white/80 sm:text-base">
              <span className="font-semibold text-brand-400">Illustrative target:</span>{" "}
              Nodalis&rsquo;s model targets a &ldquo;PayFac-Lite&rdquo; style blended take rate (15–40 bps net)
              combined with recurring SaaS fees — a hybrid designed to de-risk pure-volume dependency in early
              stages.
            </p>
          </DarkPanel>
        </Reveal>
        <Sources>CFO Desk 2024 Vertical SMB SaaS Survey · Windsor Drake Vertical SaaS Valuation Report · Margin Labs</Sources>
      </div>
    </Section>
  );
}
