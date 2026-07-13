"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AssetWithHistory, Category } from "@/lib/types";
import { CATEGORY_COLOR, CATEGORY_ICON } from "@/lib/category";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/format";

export function NetWorthSummary({ assets }: { assets: AssetWithHistory[] }) {
  const totalValue = assets.reduce((sum, a) => sum + a.latestValue, 0);
  const totalCost = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
  const changePct = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
  const positive = changePct >= 0;

  const byCategory = new Map<Category, number>();
  for (const a of assets) byCategory.set(a.category, (byCategory.get(a.category) ?? 0) + a.latestValue);
  const breakdown = Array.from(byCategory.entries())
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-ink-faint">Total net worth</p>
          <p className="font-display text-4xl font-bold tracking-tight">
            {formatCurrency(totalValue)}
          </p>
          {assets.length > 0 && (
            <p className={`mt-1 text-sm font-medium ${positive ? "text-positive" : "text-negative"}`}>
              {formatPercent(changePct)} vs. total cost basis
            </p>
          )}
        </div>

        {assets.length > 0 && (
          <div className="flex items-center gap-6">
            <div className="h-28 w-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    nameKey="category"
                    innerRadius={38}
                    outerRadius={54}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {breakdown.map((d) => (
                      <Cell key={d.category} fill={CATEGORY_COLOR[d.category]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => CATEGORY_LABELS[label as Category] ?? label}
                    contentStyle={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="space-y-1.5">
              {breakdown.map(({ category, value }) => {
                const Icon = CATEGORY_ICON[category];
                const pct = totalValue > 0 ? (value / totalValue) * 100 : 0;
                return (
                  <li key={category} className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-md"
                      style={{
                        background: `color-mix(in oklab, ${CATEGORY_COLOR[category]} 18%, transparent)`,
                        color: CATEGORY_COLOR[category],
                      }}
                    >
                      <Icon size={11} />
                    </span>
                    <span className="text-ink-dim">{CATEGORY_LABELS[category]}</span>
                    <span className="font-medium text-ink">{pct.toFixed(0)}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
