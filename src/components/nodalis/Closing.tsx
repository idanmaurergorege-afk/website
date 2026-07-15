import { Mail, Globe } from "lucide-react";
import { Reveal } from "./ui";

export function Closing() {
  return (
    <section
      id="closing"
      className="scroll-mt-20 px-6 py-20 sm:py-28"
      style={{ background: "linear-gradient(160deg, #0a0e14 0%, #0c1119 100%)" }}
    >
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Building the merchant operating system for digital asset payments.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
            Not a processor. Not a custodian. The trusted software layer merchants and licensed providers both
            rely on.
          </p>
        </Reveal>

        <Reveal delay={0.16} className="mt-10 border-t border-white/10 pt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">Contact</p>
          <div className="mt-3 flex flex-col gap-3 text-white/80 sm:flex-row sm:items-center sm:gap-6">
            <span className="text-sm sm:text-base">Founder &amp; CEO — Nodalis</span>
            <a href="mailto:founders@nodalis.io" className="flex items-center gap-1.5 text-sm hover:text-white sm:text-base">
              <Mail size={15} />
              founders@nodalis.io
            </a>
            <span className="flex items-center gap-1.5 text-sm sm:text-base">
              <Globe size={15} />
              nodalis.io
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.24} className="mt-14 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="font-display text-sm font-bold text-white">Nodalis</span>
          <a href="#top" className="text-xs text-white/40 hover:text-white/70">
            Back to top ↑
          </a>
        </Reveal>
      </div>
    </section>
  );
}
