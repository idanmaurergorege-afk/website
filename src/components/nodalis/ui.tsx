"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <Reveal className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={`mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/70" : "text-ink-dim"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className = "",
  noBorder = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  noBorder?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-6 py-16 sm:py-20 md:py-24 ${noBorder ? "" : "border-b border-border"} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-surface p-6 ${className}`}>{children}</div>
  );
}

export function DarkPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 p-6 text-white ${className}`}
      style={{ background: "linear-gradient(160deg, #0c1119 0%, #0a0e14 100%)" }}
    >
      {children}
    </div>
  );
}

export function StatTile({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <p className="font-display text-3xl font-bold tracking-tight text-brand-500 sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm leading-snug text-ink-dim">{label}</p>
    </Card>
  );
}

export function NumberedCard({
  number,
  title,
  children,
  dark,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  const Wrapper = dark ? DarkPanel : Card;
  return (
    <Wrapper>
      <span className={`font-display text-sm font-bold ${dark ? "text-brand-400" : "text-brand-500"}`}>
        {number}
      </span>
      <h3 className={`mt-2 font-display text-base font-semibold ${dark ? "text-white" : "text-ink"}`}>{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/65" : "text-ink-dim"}`}>{children}</p>
    </Wrapper>
  );
}

export function Sources({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-ink-faint">Source: {children}</p>;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-ink-dim">
      {children}
    </span>
  );
}
