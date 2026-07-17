"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, Receipt, Settings2, ArrowLeft, Layers, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const NAV_ITEMS = [
  { href: "/nodalis/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/nodalis/app/links", label: "Payment Links", icon: Link2, exact: false },
  { href: "/nodalis/app/transactions", label: "Transactions", icon: Receipt, exact: false },
  { href: "/nodalis/app/settings", label: "Settings", icon: Settings2, exact: false },
];

export function NodalisAppNav({ businessName }: { businessName: string }) {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center text-ink-faint transition hover:text-ink" title="Back to Ledger">
          <ArrowLeft size={15} />
        </Link>
        <Link href="/nodalis/app" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/25">
            <Layers size={15} strokeWidth={2.5} />
          </div>
          <span className="hidden font-display text-sm font-bold tracking-tight text-ink sm:inline">Nodalis</span>
        </Link>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <span className="hidden truncate text-sm font-medium text-ink-dim sm:inline">{businessName}</span>

        <nav className="no-scrollbar ml-auto flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  active ? "bg-surface-2 text-ink" : "text-ink-dim hover:text-ink"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
