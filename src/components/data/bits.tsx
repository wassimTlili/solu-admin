import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Dates are shown in the team's time zone, wherever the page renders (Vercel servers run in
 * UTC). Set NEXT_PUBLIC_ADMIN_TIME_ZONE to change it.
 */
export const ADMIN_TIME_ZONE = process.env.NEXT_PUBLIC_ADMIN_TIME_ZONE || "Asia/Dubai";

/** A "YYYY-MM-DDTHH:mm" wall-clock time in the team's time zone, as a real instant. */
export const teamTimeToDate = (local: string): Date => {
  const asUtc = new Date(`${local}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ADMIN_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(asUtc);
  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value);
  const shown = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
  return new Date(asUtc.getTime() - (shown - asUtc.getTime()));
};

/** An instant as "YYYY-MM-DDTHH:mm" in the team's time zone (for datetime-local inputs). */
export const toTeamTimeInput = (value: string | null | undefined): string => {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ADMIN_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "00";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
};

export const formatDate = (value: string | null | undefined, withTime = false) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        timeZone: ADMIN_TIME_ZONE,
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : "—";

export const timeAgo = (value: string | null | undefined) => {
  if (!value) return "Never";
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return formatDate(value);
};

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-500/12 text-emerald-700",
  SUSPENDED: "bg-rose-500/12 text-rose-700",
  INACTIVE: "bg-amber-500/15 text-amber-700",
  DELETED: "bg-neutral-500/15 text-neutral-600",
  PUBLISHED: "bg-emerald-500/12 text-emerald-700",
  ARCHIVED: "bg-neutral-500/15 text-neutral-600",
  REJECTED: "bg-rose-500/12 text-rose-700",
  HIDDEN: "bg-amber-500/15 text-amber-700",
  CANCELED: "bg-neutral-500/15 text-neutral-600",
  SCHEDULED: "bg-violet-500/12 text-violet-700",
  SENDING: "bg-amber-500/15 text-amber-700",
  SENT: "bg-emerald-500/12 text-emerald-700",
  CANCELLED: "bg-neutral-500/15 text-neutral-600",
  FAILED: "bg-rose-500/12 text-rose-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("border-transparent font-medium capitalize", STATUS_STYLES[status])}>
      {status.toLowerCase().replaceAll("_", " ")}
    </Badge>
  );
}

/** The app's phase colours. */
export const PHASE_COLORS: Record<string, string> = {
  MENSTRUAL: "#E8648C",
  FOLLICULAR: "#F5921E",
  OVULATION: "#1D9E75",
  LUTEAL: "#6B3FA0",
};

export function PhaseDot({ phase }: { phase?: string | null }) {
  if (!phase) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5 capitalize">
      <span className="size-2 rounded-full" style={{ background: PHASE_COLORS[phase] }} />
      {phase.toLowerCase()}
    </span>
  );
}

/** A styled native select for GET filter forms (works without JavaScript). */
export function FilterSelect({
  name,
  value,
  options,
  label,
}: {
  name: string;
  value?: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-1 text-xs text-muted-foreground">
      {label}
      <select
        name={name}
        defaultValue={value ?? ""}
        className="glass h-9 rounded-lg px-2.5 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Previous / next links that keep the current filters. */
export function Pager({
  page,
  limit,
  total,
  href,
}: {
  page: number;
  limit: number;
  total: number;
  href: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = total ? page * limit + 1 : 0;
  const to = Math.min(total, (page + 1) * limit);
  const link = "glass inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-sm";
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        {from}–{to} of {total}
      </span>
      <div className="flex gap-2">
        {page > 0 ? (
          <Link href={href(page - 1)} className={link}>
            <ChevronLeft className="size-4" /> Previous
          </Link>
        ) : null}
        {page + 1 < pages ? (
          <Link href={href(page + 1)} className={link}>
            Next <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Builds a query string from defined values only. */
export const query = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : "";
};

/** First value of a search param. */
export const param = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
