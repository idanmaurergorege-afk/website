"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, ExternalLink, ScanLine, Archive, RotateCcw, X, Check } from "lucide-react";
import { Card, Field, LinkStatusBadge, CoinChip, EmptyState } from "./ui";
import { formatUsd, formatDateTime } from "@/lib/nodalis/format";
import type { Coin, PaymentLink } from "@/lib/nodalis/types";
import { COINS } from "@/lib/nodalis/types";

export function PaymentLinksPage() {
  const [links, setLinks] = useState<PaymentLink[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/nodalis/links");
    const data = await res.json();
    setLinks(data.links);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function toggleArchive(link: PaymentLink) {
    await fetch(`/api/nodalis/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: link.status === "active" ? "archived" : "active" }),
    });
    load();
  }

  function copyLink(link: PaymentLink) {
    const url = `${window.location.origin}/nodalis/app/pay/${link.id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Payment links</h1>
          <p className="mt-1 text-sm text-ink-faint">Hosted checkout pages and QR-code POS targets.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-3 py-1.5 text-sm font-medium text-white shadow-md shadow-brand-500/25"
        >
          <Plus size={15} />
          Create link
        </button>
      </div>

      {links === null && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      )}

      {links !== null && links.length === 0 && (
        <EmptyState
          title="No payment links yet"
          body="Create one to generate a hosted checkout page and a scan-to-pay QR code."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-500/25"
            >
              Create your first link
            </button>
          }
        />
      )}

      {links !== null && links.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <Card key={link.id}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-semibold text-ink">{link.title}</p>
                  <p className="mt-0.5 font-display text-xl font-bold text-brand-500">{formatUsd(link.amount)}</p>
                </div>
                <LinkStatusBadge status={link.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {link.allowedCoins.map((c) => (
                  <CoinChip key={c} coin={c} />
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-faint">Created {formatDateTime(link.createdAt)}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => copyLink(link)}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ink-dim hover:text-ink"
                >
                  {copiedId === link.id ? <Check size={13} className="text-positive" /> : <Copy size={13} />}
                  {copiedId === link.id ? "Copied" : "Copy link"}
                </button>
                <a
                  href={`/nodalis/app/pay/${link.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ink-dim hover:text-ink"
                >
                  <ExternalLink size={13} />
                  Open checkout
                </a>
                <Link
                  href={`/nodalis/app/pos/${link.id}`}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ink-dim hover:text-ink"
                >
                  <ScanLine size={13} />
                  POS view
                </Link>
                <button
                  onClick={() => toggleArchive(link)}
                  className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-faint hover:text-ink"
                >
                  {link.status === "active" ? <Archive size={13} /> : <RotateCcw size={13} />}
                  {link.status === "active" ? "Archive" : "Reactivate"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <CreateLinkModal
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              load();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateLinkModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [allowedCoins, setAllowedCoins] = useState<Coin[]>(["USDC", "USDT"]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCoin(coin: Coin) {
    setAllowedCoins((prev) => (prev.includes(coin) ? prev.filter((c) => c !== coin) : [...prev, coin]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amountNum = parseFloat(amount);
    if (!title.trim() || Number.isNaN(amountNum) || amountNum <= 0 || allowedCoins.length === 0) {
      setError("Title, a positive amount, and at least one accepted coin are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/nodalis/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), amount: amountNum, allowedCoins }),
      });
      if (!res.ok) throw new Error();
      onCreated();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

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
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Create payment link</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-faint hover:bg-surface-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Title">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Invoice #1042" className="input" required />
          </Field>
          <Field label="Amount (USD)">
            <input type="number" step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" required />
          </Field>
          <Field label="Accepted coins">
            <div className="flex flex-wrap gap-2">
              {COINS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCoin(c)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                    allowedCoins.includes(c) ? "border-brand-500 bg-brand-500/10 text-brand-500" : "border-border text-ink-dim"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {error && <p className="mt-3 text-sm text-negative">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-ink-dim hover:bg-surface-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-brand-500/25 disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create link"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
