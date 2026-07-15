import { Layers, ShieldAlert, Network } from "lucide-react";
import { Section, SectionHeading, Card, DarkPanel, Reveal, Sources } from "./ui";
import { AdoptionGapChart } from "./charts";

const problems = [
  {
    icon: Layers,
    title: "Fragmented providers",
    body: "Dozens of licensed processors (BVNK, BitPay, Coinbase Commerce, Triple-A, NOWPayments) each ship different APIs, KYC flows, settlement rules, and coin support. Merchants pick one and get locked in.",
  },
  {
    icon: ShieldAlert,
    title: "Compliance burden merchants can't absorb",
    body: "The GENIUS Act (US) and MiCA (EU — transitional period ended July 1, 2026, no extensions) require rigorous KYB, reserve transparency, and licensing most merchants have no in-house expertise for.",
  },
  {
    icon: Network,
    title: "No unified operations layer",
    body: "Even merchants who adopt one processor get siloed dashboards, no cross-provider analytics, no settlement flexibility, and no path to add a second provider without rebuilding integration.",
  },
];

export function Problem() {
  return (
    <Section id="problem">
      <SectionHeading
        eyebrow="The Problem"
        title="Accepting crypto payments is still too hard for merchants"
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <Card className="h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                <p.icon size={17} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{p.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.24} className="mt-4">
        <DarkPanel className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span className="font-display text-2xl font-bold text-brand-400 sm:text-3xl">84–90%</span>
          <span className="text-sm text-white/70 sm:text-base">
            of merchants expect crypto to go mainstream within 5 years — yet only{" "}
            <span className="font-semibold text-white">10–19%</span> accept it today. The gap is integration
            friction, not demand.
          </span>
        </DarkPanel>
      </Reveal>

      <Sources>
        Tracee Group MiCA Briefing · Gibson Dunn · PayPal/Harris Poll · Ledger Insights · Penningtons Law
      </Sources>

      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Adoption lags intent by 2–9x — the gap is integration complexity, not demand
          </h3>
        </Reveal>
        <Reveal delay={0.08} className="mt-6">
          <Card>
            <AdoptionGapChart />
          </Card>
        </Reveal>
        <Sources>PayPal/Harris Poll · Ledger Insights (J.D. Power) · Penningtons Law (Visa)</Sources>
      </div>
    </Section>
  );
}
