"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Asset, Category } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { CATEGORIES } from "@/lib/category";

interface Props {
  asset: Asset | null;
  onClose: () => void;
  onSaved: () => void;
}

const IDENTIFIER_META: Record<Category, { label: string; placeholder: string; help?: string }> = {
  stock: { label: "Ticker symbol", placeholder: "AAPL" },
  crypto: {
    label: "CoinGecko coin id",
    placeholder: "bitcoin",
    help: "Use the CoinGecko id, not the ticker (e.g. “bitcoin”, not “BTC”).",
  },
  metal: { label: "Metal symbol", placeholder: "XAU", help: "XAU = gold. Quantity is in troy ounces." },
  realestate: { label: "Nickname / unit", placeholder: "Lake house" },
  watch: { label: "Brand + model", placeholder: "Rolex Submariner 116610LN" },
  car: { label: "VIN", placeholder: "1HGCM82633A004352" },
  other: { label: "Identifier", placeholder: "Optional" },
};

const QUANTITY_CATEGORIES: Category[] = ["stock", "crypto", "metal"];
const LOCATION_CATEGORIES: Category[] = ["realestate"];

export function AssetModal({ asset, onClose, onSaved }: Props) {
  const [category, setCategory] = useState<Category>(asset?.category ?? "stock");
  const [name, setName] = useState(asset?.name ?? "");
  const [identifier, setIdentifier] = useState(asset?.identifier ?? "");
  const [quantity, setQuantity] = useState(String(asset?.quantity ?? 1));
  const [purchasePrice, setPurchasePrice] = useState(String(asset?.purchasePrice ?? ""));
  const [purchaseDate, setPurchaseDate] = useState(asset?.purchaseDate ?? new Date().toISOString().slice(0, 10));
  const [manualCurrentValue, setManualCurrentValue] = useState(
    asset?.manualCurrentValue != null ? String(asset.manualCurrentValue) : "",
  );
  const [location, setLocation] = useState(asset?.location ?? "");
  const [notes, setNotes] = useState(asset?.notes ?? "");
  const [newsKeyword, setNewsKeyword] = useState(asset?.newsKeyword ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showQuantity = QUANTITY_CATEGORIES.includes(category);
  const showLocation = LOCATION_CATEGORIES.includes(category);
  const showNewsKeyword = category === "other";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(purchasePrice);
    if (!name.trim() || Number.isNaN(priceNum)) {
      setError("Name and purchase price are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category,
        name: name.trim(),
        identifier: identifier.trim(),
        quantity: showQuantity ? parseFloat(quantity) || 1 : 1,
        purchasePrice: priceNum,
        purchaseDate,
        manualCurrentValue: manualCurrentValue ? parseFloat(manualCurrentValue) : null,
        manualValueDate: manualCurrentValue ? new Date().toISOString() : null,
        location: showLocation ? location.trim() : null,
        notes: notes.trim() || null,
        newsKeyword: showNewsKeyword ? newsKeyword.trim() : null,
      };

      const res = await fetch(asset ? `/api/assets/${asset.id}` : "/api/assets", {
        method: asset ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      onSaved();
    } catch {
      setError("Something went wrong saving this asset. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const idMeta = IDENTIFIER_META[category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.15 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">{asset ? "Edit asset" : "Add asset"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              disabled={Boolean(asset)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple Inc."
              className="input"
              required
            />
          </Field>

          <Field label={idMeta.label} help={idMeta.help}>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={idMeta.placeholder}
              className="input"
            />
          </Field>

          {showQuantity && (
            <Field label="Quantity">
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input"
              />
            </Field>
          )}

          {showLocation && (
            <Field label="Address / ZIP" help="Used for property valuation lookups and geo-filtered news.">
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
            </Field>
          )}

          {showNewsKeyword && (
            <Field label="News search keyword" help="What to search for in the news feed for this asset.">
              <input value={newsKeyword} onChange={(e) => setNewsKeyword(e.target.value)} className="input" />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Purchase price">
              <input
                type="number"
                step="any"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="input"
                required
              />
            </Field>
            <Field label="Purchase date">
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="input"
                required
              />
            </Field>
          </div>

          <Field label="Current value (manual)" help="Used when no live price is available, or as your own estimate.">
            <input
              type="number"
              step="any"
              value={manualCurrentValue}
              onChange={(e) => setManualCurrentValue(e.target.value)}
              placeholder="Leave blank to use purchase price"
              className="input"
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={notes ?? ""}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input resize-none"
            />
          </Field>
        </div>

        {error && <p className="mt-3 text-sm text-negative">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink-dim hover:bg-surface-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-500/25 disabled:opacity-60"
          >
            {saving ? "Saving…" : asset ? "Save changes" : "Add asset"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-dim">{label}</span>
      {children}
      {help && <span className="mt-1 block text-[11px] text-ink-faint">{help}</span>}
    </label>
  );
}
