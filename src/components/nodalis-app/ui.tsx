import type { ProviderStatus, TransactionStatus, LinkStatus } from "@/lib/nodalis/types";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-surface p-6 ${className}`}>{children}</div>;
}

export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-dim">{label}</span>
      {children}
      {help && <span className="mt-1 block text-[11px] text-ink-faint">{help}</span>}
    </label>
  );
}

const TX_STATUS_STYLE: Record<TransactionStatus, string> = {
  pending: "bg-gold-500/15 text-gold-500",
  settled: "bg-positive/15 text-positive",
  failed: "bg-negative/15 text-negative",
  refunded: "bg-surface-3 text-ink-dim",
};

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${TX_STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

const PROVIDER_STATUS_STYLE: Record<ProviderStatus, { dot: string; label: string }> = {
  healthy: { dot: "bg-positive", label: "Healthy" },
  degraded: { dot: "bg-gold-500", label: "Degraded" },
  down: { dot: "bg-negative", label: "Down" },
};

export function ProviderStatusDot({ status }: { status: ProviderStatus }) {
  const meta = PROVIDER_STATUS_STYLE[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-dim">
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

const LINK_STATUS_STYLE: Record<LinkStatus, string> = {
  active: "bg-positive/15 text-positive",
  archived: "bg-surface-3 text-ink-faint",
};

export function LinkStatusBadge({ status }: { status: LinkStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${LINK_STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

export function CoinChip({ coin }: { coin: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-dim">
      {coin}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-faint">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
