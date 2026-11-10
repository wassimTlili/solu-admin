import Link from "next/link";
import type { Metadata } from "next";
import { param, PHASE_COLORS } from "@/components/data/bits";
import { ImportSheet } from "@/components/content/import-sheet";
import { PHASES, type Phase } from "@/components/content/options";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";
import { cn } from "@/lib/utils";
import { DayRows } from "./day-rows";

export const metadata: Metadata = { title: "Cycle-day lines" };

const Rows = graphql(`
  query AdminDayRows {
    adminCycleDayRows {
      row_id
      phase
      phase_position
      variation
      body_text
      energy_text
    }
  }
`);

export default async function CycleDaysPage({ searchParams }: PageProps<"/content/cycle-days">) {
  const params = await searchParams;
  const requested = param(params.phase) as Phase | undefined;
  const phase: Phase = PHASES.some((item) => item.value === requested) ? (requested as Phase) : "MENSTRUAL";
  const { adminCycleDayRows } = await adminRequest(Rows);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted-foreground">
          The first two lines of the Today hero: what&apos;s happening in the body and what it means for energy.
          Each phase is split into early, mid and late days (Ovulation: early and late), and members rotate through
          the variations day by day.
        </p>
        <ImportSheet
          kinds={["cycleDays"]}
          title="Import cycle-day lines from Excel"
          description={
            <>
              The cycle-day spreadsheet (<span className="font-mono text-xs">Solu_CycleDayRows.xlsx</span>, 88 rows).
              Lines are matched by their ids (MEN-E-01…) and updated in place; lines missing from the file are
              deleted. Checking first writes nothing and lists exactly what would change.
            </>
          }
        />
      </div>

      <nav className="glass flex w-fit flex-wrap gap-1 rounded-xl p-1" aria-label="Phase">
        {PHASES.map((item) => {
          const count = adminCycleDayRows.filter((row) => row.phase === item.value).length;
          const active = item.value === phase;
          return (
            <Link
              key={item.value}
              href={`/content/cycle-days?phase=${item.value}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm transition-colors",
                active ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="size-2 rounded-full" style={{ background: PHASE_COLORS[item.value] }} />
              {item.label}
              <span className="text-xs tabular-nums text-muted-foreground">{count}</span>
            </Link>
          );
        })}
      </nav>

      <DayRows phase={phase} rows={adminCycleDayRows.filter((row) => row.phase === phase)} />
    </div>
  );
}
