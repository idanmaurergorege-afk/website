"use client";

import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface Props {
  data: { value: number; timestamp: string }[];
  positive: boolean;
}

export function Sparkline({ data, positive }: Props) {
  if (data.length < 2) {
    return <div className="flex h-12 items-center text-[11px] text-ink-faint">Not enough history yet</div>;
  }

  const color = positive ? "var(--color-positive)" : "var(--color-negative)";
  const gradientId = `spark-${positive ? "up" : "down"}`;

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
