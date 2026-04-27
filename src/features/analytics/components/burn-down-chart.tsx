"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BurnDownPoint } from "../queries";

export function BurnDownChart({ data }: { data: BurnDownPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="burnFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
          allowDecimals={false}
          width={32}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelStyle={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
        />
        <Area
          type="monotone"
          dataKey="open"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#burnFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
