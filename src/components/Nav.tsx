"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, TrendingUp, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Nav() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg shadow-brand-500/25">
            <TrendingUp size={16} strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Ledger</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/" ? "bg-surface-2 text-ink" : "text-ink-dim hover:text-ink"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/settings" ? "bg-surface-2 text-ink" : "text-ink-dim hover:text-ink"
            }`}
          >
            <Settings size={14} />
            Settings
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-2 hover:text-ink"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
