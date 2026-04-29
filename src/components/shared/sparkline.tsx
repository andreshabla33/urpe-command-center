"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

type Props = {
  data: { day: string; count: number }[];
  tone?: "default" | "danger" | "warning" | "success";
  height?: number;
};

const TONE_COLOR: Record<NonNullable<Props["tone"]>, string> = {
  default: "var(--color-chart-1)",
  danger: "var(--destructive)",
  warning: "var(--color-chart-4)",
  success: "var(--color-chart-3)",
};

export function Sparkline({ data, tone = "default", height = 28 }: Props) {
  if (!data || data.length === 0) return <div style={{ height }} />;

  const color = TONE_COLOR[tone];
  const gradientId = `spark-grad-${tone}`;

  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
