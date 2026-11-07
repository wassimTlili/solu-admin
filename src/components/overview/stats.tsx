import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const formatNumber = (value: number) => new Intl.NumberFormat("en").format(value);

/** A glass KPI tile: label, big number, and an optional line underneath (trend, share). */
export function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
  icon: LucideIcon;
  tone?: "default" | "good" | "bad";
}) {
  return (
    <div data-slot="card" className="glass rounded-xl p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {hint ? (
        <p
          className={cn(
            "mt-1 text-xs text-muted-foreground",
            tone === "good" && "text-emerald-700",
            tone === "bad" && "text-rose-700",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** A ranked list with proportional bars, for categories with long names. */
export function BarList({
  items,
  color = "var(--primary)",
  empty = "No data yet",
}: {
  items: { key: string; label: string; count: number; color?: string }[];
  color?: string;
  empty?: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.count));
  if (!items.length || items.every((item) => item.count === 0)) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <ul className="grid gap-2.5">
      {items.map((item) => (
        <li key={item.key} className="grid gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{item.label}</span>
            <span className="tabular-nums text-muted-foreground">{formatNumber(item.count)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.count / max) * 100}%`, background: item.color ?? color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Small "label · number" rows for a stats panel. */
export function StatRows({ rows }: { rows: { label: string; value: number | string }[] }) {
  return (
    <dl className="grid gap-2 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="font-medium tabular-nums">
            {typeof row.value === "number" ? formatNumber(row.value) : row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
