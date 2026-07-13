import { Radio, TrendingUpDown, PenLine } from "lucide-react";
import type { ValueSource } from "@/lib/types";

const META: Record<ValueSource, { label: string; icon: typeof Radio; className: string }> = {
  live: {
    label: "Live",
    icon: Radio,
    className: "bg-positive/15 text-positive",
  },
  index: {
    label: "Index estimate",
    icon: TrendingUpDown,
    className: "bg-gold-500/15 text-gold-500",
  },
  manual: {
    label: "Manual",
    icon: PenLine,
    className: "bg-ink-faint/15 text-ink-dim",
  },
};

export function SourceBadge({ source }: { source: ValueSource }) {
  const { label, icon: Icon, className } = META[source];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}
