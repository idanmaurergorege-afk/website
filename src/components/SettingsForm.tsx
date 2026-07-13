"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Check } from "lucide-react";
import type { KeyName } from "@/lib/config";

interface KeyStatus {
  set: boolean;
  masked: string | null;
  from: "env" | "settings" | null;
}

const KEY_META: {
  name: KeyName;
  label: string;
  usedFor: string;
  docsUrl: string;
  note?: string;
}[] = [
  {
    name: "ALPHA_VANTAGE_KEY",
    label: "Alpha Vantage",
    usedFor: "Live stock & ETF quotes",
    docsUrl: "https://www.alphavantage.co/support/#api-key",
    note: "Free tier, instant signup, 25 requests/day.",
  },
  {
    name: "METALS_API_KEY",
    label: "metals-api.com",
    usedFor: "Live gold/silver spot prices",
    docsUrl: "https://metals-api.com/",
    note: "Without this key, gold falls back to a free CoinGecko token price.",
  },
  {
    name: "REALESTATE_API_KEY",
    label: "RentCast",
    usedFor: "Automated valuation model (AVM) for real estate",
    docsUrl: "https://www.rentcast.io/api",
    note: "Paid API. Zillow's API was discontinued in 2021 and is not scraped here.",
  },
  {
    name: "FRED_API_KEY",
    label: "FRED (St. Louis Fed)",
    usedFor: "Case-Shiller home price index fallback for real estate trend",
    docsUrl: "https://fred.stlouisfed.org/docs/api/api_key.html",
    note: "Free, instant signup. Used only when RentCast isn't configured.",
  },
  {
    name: "WATCH_DATA_API_KEY",
    label: "Apify",
    usedFor: "Watch market price lookups",
    docsUrl: "https://apify.com/",
    note: "Requires your own Chrono24-scraping actor — scraping Chrono24 at scale may violate its ToS. Use at your own risk; manual entry is the default.",
  },
  {
    name: "CAR_DATA_API_KEY",
    label: "MarketCheck",
    usedFor: "VIN-based car valuation",
    docsUrl: "https://www.marketcheck.com/apis",
    note: "Paid API. Manual entry is the default without this key.",
  },
];

export function SettingsForm() {
  const [statuses, setStatuses] = useState<Record<string, KeyStatus> | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<KeyName, string>>>({});
  const [savedFlash, setSavedFlash] = useState<KeyName | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setStatuses(data.keys));
  }, []);

  async function save(name: KeyName) {
    const value = drafts[name] ?? "";
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [name]: value }),
    });
    const data = await res.json();
    setStatuses(data.keys);
    setDrafts((d) => ({ ...d, [name]: "" }));
    setSavedFlash(name);
    setTimeout(() => setSavedFlash(null), 1600);
  }

  return (
    <div className="mt-6 space-y-4">
      {KEY_META.map((meta) => {
        const status = statuses?.[meta.name];
        return (
          <div key={meta.name} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold">{meta.label}</h3>
                  {status?.set && (
                    <span className="rounded-full bg-positive/15 px-2 py-0.5 text-[10px] font-medium text-positive">
                      {status.from === "env" ? "set via .env.local" : "configured"}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-ink-dim">{meta.usedFor}</p>
              </div>
              <a
                href={meta.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-brand-500 hover:underline"
              >
                Get a key <ExternalLink size={11} />
              </a>
            </div>

            {meta.note && <p className="mt-2 text-[11px] text-ink-faint">{meta.note}</p>}

            <div className="mt-3 flex gap-2">
              <input
                type="password"
                value={drafts[meta.name] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [meta.name]: e.target.value }))}
                placeholder={status?.masked ?? "Paste API key"}
                disabled={status?.from === "env"}
                className="input"
              />
              <button
                onClick={() => save(meta.name)}
                disabled={status?.from === "env"}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-medium text-ink-dim transition hover:text-ink disabled:opacity-50"
              >
                {savedFlash === meta.name ? <Check size={13} className="text-positive" /> : "Save"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
