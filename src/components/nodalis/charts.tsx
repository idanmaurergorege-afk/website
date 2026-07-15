"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
  LabelList,
} from "recharts";

const tooltipStyle = {
  background: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--color-ink)",
};

const axisTick = { fill: "var(--color-ink-faint)", fontSize: 12 };

const hesitationData = [
  { label: "Visa/MRC 2025 — currently accept", value: 11 },
  { label: "J.D. Power 2026 (US SMB) — currently accept", value: 19 },
  { label: "NCA/PayPal 2025 — currently accept", value: 39 },
  { label: "NCA/PayPal — expect mainstream in 5 yrs", value: 84 },
  { label: "NCA/PayPal — would accept if as simple as cards", value: 90 },
];

export function AdoptionGapChart() {
  return (
    <div className="w-full">
      <div className="h-[320px] w-full sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hesitationData} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={axisTick} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              width={0}
              tick={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface-2)" }}
              contentStyle={tooltipStyle}
              formatter={(value) => [`${Number(value)}%`, "Currently accept / would accept"]}
              labelFormatter={() => ""}
            />
            <Bar dataKey="value" fill="var(--color-brand-500)" radius={[0, 6, 6, 0]} barSize={22}>
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v: unknown) => (typeof v === "number" || typeof v === "string" ? `${v}%` : "")}
                fill="var(--color-ink)"
                fontSize={12}
                fontWeight={600}
              />
              {hesitationData.map((d) => (
                <Cell key={d.label} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-1.5 text-xs text-ink-dim">
        {hesitationData.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
            {d.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const growthData = [
  { year: "2020", value: 5 },
  { year: "2021", value: 30 },
  { year: "2022", value: 138 },
  { year: "2023", value: 130 },
  { year: "2024", value: 195 },
  { year: "2025", value: 312 },
  { year: "May 2026", value: 322 },
];

export function StablecoinGrowthChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={growthData} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="nodalisGrowthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="year" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} width={56} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value)}B`, "Market cap"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-brand-500)"
            strokeWidth={2.5}
            fill="url(#nodalisGrowthFill)"
            dot={{ r: 4, fill: "var(--color-brand-500)", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const projectionData = [
  { year: "Year 1", value: 1 },
  { year: "Year 2", value: 1.8 },
  { year: "Year 3", value: 4.3 },
  { year: "Year 4", value: 7.6 },
  { year: "Year 5", value: 10 },
];

export function FinancialProjectionChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={projectionData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="year" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}x`}
            width={44}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value)}x`, "Illustrative index"]} />
          <Bar dataKey="value" fill="var(--color-brand-500)" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
