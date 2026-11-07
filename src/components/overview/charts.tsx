"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface SeriesPoint {
  date: string;
  value: number;
}

const shortDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Merges several daily series into one row per day for Recharts. */
const byDay = (series: Record<string, SeriesPoint[]>) => {
  const keys = Object.keys(series);
  return (series[keys[0]] ?? []).map((point, index) => ({
    date: point.date,
    ...Object.fromEntries(keys.map((key) => [key, series[key][index]?.value ?? 0])),
  }));
};

/** Smooth stacked-free areas, e.g. active members and new members per day. */
export function TrendChart({
  series,
  config,
  height = 260,
}: {
  series: Record<string, SeriesPoint[]>;
  config: ChartConfig;
  height?: number;
}) {
  const data = byDay(series);
  return (
    <ChartContainer config={config} className="aspect-auto w-full min-w-0" style={{ height }}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          {Object.keys(series).map((key) => (
            <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.35} />
              <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeOpacity={0.4} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={shortDate} />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => shortDate(String(value))} />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(series).map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            fill={`url(#fill-${key})`}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

/** Daily bars side by side, e.g. posts, moods and period logs. */
export function DailyBars({
  series,
  config,
  height = 240,
}: {
  series: Record<string, SeriesPoint[]>;
  config: ChartConfig;
  height?: number;
}) {
  const data = byDay(series);
  return (
    <ChartContainer config={config} className="aspect-auto w-full min-w-0" style={{ height }}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.4} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={28} tickFormatter={shortDate} />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => shortDate(String(value))} />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(series).map((key) => (
          <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export interface Slice {
  key: string;
  label: string;
  count: number;
  color: string;
}

/** A donut with the total in the middle. */
export function Donut({ slices, height = 220 }: { slices: Slice[]; height?: number }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);
  const config = Object.fromEntries(slices.map((slice) => [slice.key, { label: slice.label, color: slice.color }]));
  return (
    <ChartContainer config={config} className="relative aspect-auto w-full min-w-0" style={{ height }}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
        <Pie
          data={slices}
          dataKey="count"
          nameKey="key"
          innerRadius="62%"
          outerRadius="92%"
          strokeWidth={2}
          stroke="rgba(255,255,255,0.8)"
          animationDuration={500}
        >
          {slices.map((slice) => (
            <Cell key={slice.key} fill={slice.color} />
          ))}
        </Pie>
        <text x="50%" y="48%" textAnchor="middle" className="fill-foreground text-2xl font-semibold">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="fill-muted-foreground text-xs">
          members
        </text>
      </PieChart>
    </ChartContainer>
  );
}
