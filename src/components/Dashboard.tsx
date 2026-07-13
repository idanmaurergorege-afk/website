"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, RefreshCw, Wallet } from "lucide-react";
import type { Asset, AssetWithHistory, Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICON } from "@/lib/category";
import { NetWorthSummary } from "./NetWorthSummary";
import { AssetCard } from "./AssetCard";
import { AssetModal } from "./AssetModal";
import { ConfirmDialog } from "./ConfirmDialog";

export function Dashboard() {
  const [assets, setAssets] = useState<AssetWithHistory[] | null>(null);
  const [modalAsset, setModalAsset] = useState<Asset | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssetWithHistory | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [refreshingAll, setRefreshingAll] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/assets");
    const data = await res.json();
    setAssets(data.assets);
  }, []);

  useEffect(() => {
    // Fetch-on-mount: setAssets happens after the awaited fetch resolves,
    // not synchronously during the effect itself.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleRefreshAll() {
    setRefreshingAll(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
      await load();
    } finally {
      setRefreshingAll(false);
    }
  }

  async function handleRefreshOne(id: string) {
    await fetch(`/api/assets/${id}/refresh`, { method: "POST" });
    await load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch(`/api/assets/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    await load();
  }

  const filtered = assets?.filter((a) => filter === "all" || a.category === filter) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <NetWorthSummary assets={assets ?? []} />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c];
            return (
              <FilterChip
                key={c}
                active={filter === c}
                onClick={() => setFilter(c)}
                label={CATEGORY_LABELS[c]}
                icon={<Icon size={12} />}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            disabled={refreshingAll}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink-dim transition hover:text-ink disabled:opacity-60"
          >
            <RefreshCw size={14} className={refreshingAll ? "animate-spin" : ""} />
            Refresh all
          </button>
          <button
            onClick={() => setModalAsset("new")}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-md shadow-brand-500/25"
          >
            <Plus size={15} />
            Add asset
          </button>
        </div>
      </div>

      {assets === null && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      )}

      {assets !== null && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
            <Wallet size={22} />
          </div>
          <p className="font-display text-lg font-semibold">
            {assets.length === 0 ? "No assets yet" : "Nothing in this category"}
          </p>
          <p className="mt-1 max-w-xs text-sm text-ink-faint">
            Add a stock, some crypto, a property, a watch, a car — anything you want to track in one place.
          </p>
          <button
            onClick={() => setModalAsset("new")}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-500/25"
          >
            <Plus size={15} />
            Add your first asset
          </button>
        </div>
      )}

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={() => setModalAsset(asset)}
              onDelete={() => setDeleteTarget(asset)}
              onRefresh={() => handleRefreshOne(asset.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {modalAsset && (
          <AssetModal
            asset={modalAsset === "new" ? null : modalAsset}
            onClose={() => setModalAsset(null)}
            onSaved={() => {
              setModalAsset(null);
              load();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            title="Delete this asset?"
            message={`"${deleteTarget.name}" and its full value history will be permanently removed.`}
            confirmLabel="Delete"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? "bg-brand-500/15 text-brand-500 ring-1 ring-brand-500/30" : "bg-surface text-ink-dim hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
