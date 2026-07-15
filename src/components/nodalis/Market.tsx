import { CheckCircle2, XCircle } from "lucide-react";
import { Section, SectionHeading, Card, DarkPanel, StatTile, Reveal, Sources } from "./ui";
import { StablecoinGrowthChart } from "./charts";

const opportunityStats = [
  { value: "$307–323B", label: "Stablecoin market cap (Dec 2025–May 2026), up ~50% YoY" },
  { value: "$350–550B", label: "Real-economy stablecoin payment volume in 2025 (ex-trading), growing ~60% YoY" },
  { value: "733%", label: "YoY growth in B2B stablecoin payments in 2025, reaching ~$226B" },
  { value: "0.02%", label: "Share of the ~$200T global payments market that real-economy stablecoin payments represent today" },
];

export function Market() {
  return (
    <Section id="market">
      <SectionHeading
        eyebrow="Market Opportunity"
        title="A trillion-dollar market still in its first inning"
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {opportunityStats.map((s, i) => (
          <Reveal key={s.value} delay={i * 0.06}>
            <StatTile value={s.value} label={s.label} className="h-full" />
          </Reveal>
        ))}
      </div>
      <Sources>BCG 2026 White Paper · McKinsey · Bancoli (McKinsey/Artemis)</Sources>

      {/* TAM / SAM / SOM */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Market sizing: TAM / SAM / SOM</h3>
        </Reveal>

        <div className="mt-6 space-y-3">
          <Reveal>
            <DarkPanel className="w-full">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-400">TAM</p>
              <p className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">≈$200 Trillion</p>
              <p className="mt-1 text-sm text-white/60">
                Global payments market — the ultimate ceiling if stablecoins become a standard settlement rail
              </p>
            </DarkPanel>
          </Reveal>
          <Reveal delay={0.06} className="pl-0 sm:pl-8">
            <div className="w-full rounded-2xl bg-brand-600 p-6 text-white sm:w-[80%]">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">SAM</p>
              <p className="mt-1 font-display text-xl font-bold sm:text-2xl">$202M → $485M by 2030</p>
              <p className="mt-1 text-sm text-white/75">
                Crypto/stablecoin payments software &amp; platform market (16% CAGR); broader crypto payments
                market $1.8B → $3.5B+ by 2030 (14.2% CAGR)
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="pl-0 sm:pl-16">
            <div className="w-full rounded-2xl bg-brand-500 p-6 text-white sm:w-[58%]">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/85">SOM</p>
              <p className="mt-1 font-display text-xl font-bold sm:text-2xl">Blended SaaS + bps share</p>
              <p className="mt-1 text-sm text-white/80">
                Merchant orchestration layer share of real-economy stablecoin volume ($350–550B in 2025), scaling
                toward $2–4T by 2030
              </p>
            </div>
          </Reveal>
        </div>
        <p className="mt-4 text-xs italic text-ink-faint">
          Note: sources use differing methodologies (top-down TAM vs. bottom-up software-market sizing); figures
          are directional, not reconciled to a single model.
        </p>
        <Sources>BCG · Grand View Research · SQ Magazine · Cyclops (Citi)</Sources>
      </div>

      {/* Stablecoin growth */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Stablecoin market cap grew ~60x in six years
          </h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <Reveal>
            <Card>
              <StablecoinGrowthChart />
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <DarkPanel className="h-full">
              <p className="font-display text-base font-semibold text-white">2028 forecasts diverge sharply</p>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-white/60">J.P. Morgan (conservative)</p>
                  <p className="font-display text-lg font-bold text-brand-400">$500–750B</p>
                </div>
                <div>
                  <p className="text-white/60">Standard Chartered (bullish)</p>
                  <p className="font-display text-lg font-bold text-brand-400">$2 Trillion</p>
                </div>
              </div>
            </DarkPanel>
          </Reveal>
        </div>
        <Sources>StablecoinInsider · Bancoli</Sources>
      </div>

      {/* Why now / regulatory tailwinds */}
      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Why now: regulatory tailwinds</h3>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">US — GENIUS Act</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink-dim">
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />Signed into law July 18, 2025</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />First comprehensive federal stablecoin framework</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />Only licensed &ldquo;Permitted Payment Stablecoin Issuers&rdquo; may issue</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />Final implementing rules due July 18, 2026</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />OCC/FDIC actively rulemaking through 2026</li>
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full">
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-ink">EU — MiCA</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink-dim">
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />Full CASP licensing regime in force since Dec 30, 2024</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />Transitional/grandfathering period ended July 1, 2026</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-500" />No extensions confirmed by ESMA</li>
                <li className="flex gap-2"><XCircle size={16} className="mt-0.5 shrink-0 text-negative" />Unlicensed crypto-asset service providers must now cease EU operations</li>
              </ul>
            </Card>
          </Reveal>
        </div>
        <Reveal delay={0.14} className="mt-4">
          <DarkPanel>
            <p className="text-sm italic text-white/75 sm:text-base">
              Regulation now favors a non-custodial software layer that partners with licensed issuers/processors
              rather than becoming one — exactly Nodalis&rsquo;s model.
            </p>
          </DarkPanel>
        </Reveal>
        <Sources>Gibson Dunn · Elliptic 2026 Outlook · Tracee Group</Sources>
      </div>
    </Section>
  );
}
