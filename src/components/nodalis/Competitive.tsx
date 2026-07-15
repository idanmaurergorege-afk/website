import { Section, SectionHeading, Reveal, Sources } from "./ui";

type Point = { name: string; x: number; y: number; highlight?: boolean };

const points: Point[] = [
  { name: "Zero Hash", x: 13, y: 24 },
  { name: "Meld", x: 30, y: 32 },
  { name: "Bridge (pre-acq.)", x: 21, y: 44 },
  { name: "Stripe (Orchestration)", x: 57, y: 47 },
  { name: "Nodalis", x: 69, y: 18, highlight: true },
  { name: "BitPay", x: 60, y: 69 },
  { name: "NOWPayments", x: 79, y: 62 },
  { name: "Coinbase Commerce", x: 66, y: 78 },
  { name: "Triple-A", x: 62, y: 88 },
];

function Quadrant() {
  return (
    <div className="min-w-[640px]">
      <div className="mb-2 flex text-xs font-semibold uppercase tracking-wide text-ink-faint">
        <div className="flex-1 text-center">Infrastructure / B2B2B</div>
        <div className="flex-1 text-center text-brand-500">Merchant-Facing</div>
      </div>
      <div className="flex">
        <div className="flex h-[380px] w-6 shrink-0 flex-col">
          <div className="flex flex-1 items-center justify-center">
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-ink-faint [transform:rotate(-90deg)]">
              Multi-Provider Orchestration
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-ink-faint [transform:rotate(-90deg)]">
              Single Provider
            </span>
          </div>
        </div>
        <div className="relative ml-2 h-[380px] flex-1 rounded-2xl border border-border bg-surface">
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-border" />
          <div className="absolute inset-0 bg-brand-500/[0.04]" style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }} />

          {points.map((p) => (
            <div
              key={p.name}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span
                className={`block rounded-full ${
                  p.highlight ? "h-4 w-4 ring-4 ring-brand-500/25" : "h-3 w-3"
                }`}
                style={{ background: p.highlight ? "var(--color-brand-500)" : "var(--color-ink-faint)" }}
              />
              <span
                className={`whitespace-nowrap text-[11px] ${
                  p.highlight ? "font-display font-bold text-brand-500" : "text-ink-dim"
                }`}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const compareRows = [
  { company: "BVNK", type: "Licensed processor/infra", merchant: "Partial", multi: "No", funding: "~$90–100M raised; acquired by Mastercard for up to $1.8B (Mar 2026)", signal: "Card network validates category at 2.4x last valuation" },
  { company: "BitPay", type: "Licensed processor", merchant: "Yes", multi: "No", funding: "$103M raised total", signal: "Oldest dedicated crypto processor (2011)" },
  { company: "Coinbase Commerce", type: "Licensed processor", merchant: "Yes", multi: "No", funding: "N/A (Coinbase subsidiary)", signal: "Flat 1% fee, rebuilt on Base in 2026" },
  { company: "Triple-A", type: "Licensed processor (MAS)", merchant: "Yes", multi: "No", funding: "$10M+ raised", signal: 'Explicit "remove blockchain complexity" positioning' },
  { company: "Stripe (Bridge/Orch.)", type: "Horizontal payments platform", merchant: "Yes", multi: "Building", funding: "Acquired Bridge for $1.1B; valued $159B (Feb 2026)", signal: "Biggest potential threat; Orchestration adjacent to thesis" },
  { company: "Zero Hash", type: "Infrastructure/B2B2B", merchant: "No", multi: "Yes", funding: "$275M raised; $1B+ valuation (Sept 2025)", signal: '"AWS of on-chain infrastructure," not merchant-facing' },
  { company: "Meld", type: "Infrastructure/B2B2B", merchant: "No", multi: "Yes (50+)", funding: "$15M raised", signal: 'Likened to "Visa for crypto," not merchant-facing' },
];

export function Competitive() {
  return (
    <Section id="competitive">
      <SectionHeading
        eyebrow="Competitive Landscape"
        title="No company has yet claimed the merchant-facing, multi-provider orchestration quadrant"
      />

      <Reveal delay={0.06} className="mt-10 overflow-x-auto pb-2">
        <Quadrant />
      </Reveal>
      <Sources>CNBC (BVNK/Mastercard) · Blockworks (Zero Hash) · PR Newswire (Meld)</Sources>

      <div className="mt-16">
        <Reveal>
          <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">Competitive comparison</h3>
        </Reveal>
        <Reveal delay={0.06} className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#141a26] text-white">
                {["Company", "Type", "Merchant-Facing?", "Multi-Provider?", "Funding / Valuation", "Notable Signal"].map((h) => (
                  <th key={h} className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r, i) => (
                <tr key={r.company} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2"}>
                  <td className="px-4 py-3 font-medium text-ink">{r.company}</td>
                  <td className="px-4 py-3 text-ink-dim">{r.type}</td>
                  <td className="px-4 py-3 text-ink-dim">{r.merchant}</td>
                  <td className="px-4 py-3 text-ink-dim">{r.multi}</td>
                  <td className="px-4 py-3 text-ink-dim">{r.funding}</td>
                  <td className="px-4 py-3 text-ink-dim">{r.signal}</td>
                </tr>
              ))}
              <tr className="bg-brand-500/15">
                <td className="px-4 py-3 font-display font-bold text-brand-500">Nodalis</td>
                <td className="px-4 py-3 font-semibold text-brand-500">Merchant OS / orchestration</td>
                <td className="px-4 py-3 font-semibold text-brand-500">Yes</td>
                <td className="px-4 py-3 font-semibold text-brand-500">Yes</td>
                <td className="px-4 py-3 text-ink-dim">—</td>
                <td className="px-4 py-3 font-semibold text-brand-500">
                  Only player combining merchant-facing UX with true multi-provider orchestration
                </td>
              </tr>
            </tbody>
          </table>
        </Reveal>
        <Sources>CNBC · iGaming Payment Solutions · Payyd · DigFin · Stripe Newsroom · Blockworks · PR Newswire</Sources>
      </div>
    </Section>
  );
}
