import { Link2, LayoutGrid, ShieldQuestion } from "lucide-react";
import { Section, SectionHeading, DarkPanel, Reveal } from "./ui";

const solutions = [
  {
    icon: Link2,
    title: "One integration, every provider",
    body: "A single API / plugin / POS integration routes to BVNK, BitPay, Coinbase Commerce, Triple-A, or any future licensed partner.",
  },
  {
    icon: LayoutGrid,
    title: "One dashboard, full control",
    body: "Merchants configure settlement (fiat / crypto / split), see unified analytics, and manage refunds and team access in one place.",
  },
  {
    icon: ShieldQuestion,
    title: "Zero blockchain complexity",
    body: "KYC/KYB, wallets, compliance, and settlement are fully abstracted away from the merchant experience.",
  },
];

const comparison: { label: string; without: string; with: string }[] = [
  { label: "Integration effort", without: "Multiple SDKs; rebuild per provider", with: "One API, all providers" },
  { label: "Compliance", without: "Merchant manages KYB per provider", with: "Managed onboarding, routed to licensed partners" },
  { label: "Settlement", without: "Locked to one provider's rails", with: "Configurable fiat / crypto / split, switch anytime" },
  { label: "Analytics", without: "Siloed per provider", with: "Unified cross-provider dashboard" },
  { label: "Time to launch", without: "Weeks per integration", with: "Days, one integration" },
  { label: "Provider risk", without: "Vendor lock-in", with: "Multi-provider redundancy & smart routing" },
];

export function Solution() {
  return (
    <Section id="solution">
      <SectionHeading
        eyebrow="The Solution"
        title="Nodalis: the merchant-facing software layer between businesses and licensed crypto payment providers"
      />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {solutions.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <DarkPanel className="h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
                <s.icon size={17} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-brand-400">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
            </DarkPanel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.24} className="mt-4">
        <p className="text-sm italic leading-relaxed text-ink-dim sm:text-base">
          <span className="font-semibold not-italic text-ink">
            We are not a payment processor, exchange, or custodian.
          </span>{" "}
          We are the orchestration and merchant-experience layer on top of regulated partners.
        </p>
      </Reveal>

      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            Before / after: the merchant experience
          </h3>
        </Reveal>
        <Reveal delay={0.08} className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="bg-surface-2 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  &nbsp;
                </th>
                <th className="bg-[#141a26] px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-white">
                  Without Nodalis
                </th>
                <th className="bg-brand-500 px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide text-white">
                  With Nodalis
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2"}>
                  <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-ink-faint">{row.without}</td>
                  <td className="px-4 py-3 font-medium text-brand-500">{row.with}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </Section>
  );
}
