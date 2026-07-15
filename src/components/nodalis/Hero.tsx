"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border px-6 pb-20 pt-16 sm:pt-24"
      style={{ background: "linear-gradient(180deg, #0a0e14 0%, #0c1119 55%, #0a0e14 100%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 15% 0%, color-mix(in oklab, var(--color-brand-500) 25%, transparent), transparent 60%), radial-gradient(500px circle at 85% 20%, color-mix(in oklab, var(--color-brand-400) 18%, transparent), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/25">
            <Layers size={17} strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">Nodalis</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400"
        >
          Merchant Operating System · Digital Asset Payments
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          The merchant operating system for digital asset payments
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
        >
          One dashboard. Every licensed crypto payment provider. Zero blockchain complexity for merchants.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href="#problem"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition hover:brightness-110"
          >
            Read the case
            <ArrowRight size={15} />
          </a>
          <a
            href="#closing"
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            Get in touch
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/50"
        >
          <span>Investor Presentation — 2026</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
          <span>Lisbon</span>
          <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
          <span>Not a processor, exchange, or custodian</span>
        </motion.div>
      </div>
    </section>
  );
}
