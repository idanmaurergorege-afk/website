"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
import type { AssetWithHistory } from "@/lib/types";
import { CATEGORY_COLOR, CATEGORY_ICON } from "@/lib/category";
import { formatCurrency, formatPercent } from "@/lib/format";
import { SourceBadge } from "./SourceBadge";
import { Sparkline } from "./Sparkline";
import { NewsList } from "./NewsList";

interface Props {
  asset: AssetWithHistory;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => Promise<void>;
}

export function AssetCard({ asset, onEdit, onDelete, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = CATEGORY_ICON[asset.category];
  const color = CATEGORY_COLOR[asset.category];
  const positive = (asset.changePct ?? 0) >= 0;

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
          >
            <Icon size={17} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{asset.name}</p>
            <p className="truncate text-xs text-ink-faint">{asset.identifier || "—"}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            onBlur={() => setTimeout(() => setMenuOpen(false), 120)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint opacity-0 transition-opacity hover:bg-surface-2 hover:text-ink group-hover:opacity-100"
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-10 w-32 overflow-hidden rounded-lg border border-border bg-surface-2 shadow-lg">
              <button
                onClick={onEdit}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-ink-dim hover:bg-surface-3 hover:text-ink"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-negative hover:bg-surface-3"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">
            {formatCurrency(asset.latestValue, asset.currency)}
          </p>
          {asset.changePct !== null && (
            <p className={`text-xs font-medium ${positive ? "text-positive" : "text-negative"}`}>
              {formatPercent(asset.changePct)} since purchase
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink disabled:opacity-50"
          aria-label="Refresh value"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="mt-2">
        <Sparkline data={asset.history} positive={positive} />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <SourceBadge source={asset.source} />
        {asset.sourceUrl && (
          <a
            href={asset.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-ink-faint hover:text-ink-dim"
          >
            source
          </a>
        )}
      </div>

      <NewsList assetId={asset.id} />
    </motion.div>
  );
}
