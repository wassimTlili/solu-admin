import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect, Pager, param, query } from "@/components/data/bits";
import { ImportSheet } from "@/components/content/import-sheet";
import { PHASES, POSITION_LABELS, TIMES, type Position } from "@/components/content/options";
import { graphql } from "@/lib/gql";
import type { CyclePhase, PhasePosition, TimeOfDay } from "@/lib/gql/graphql";
import { adminRequest } from "@/lib/server/api";
import { CardTable } from "./card-table";

export const metadata: Metadata = { title: "Recommendations" };

const Cards = graphql(`
  query AdminCards(
    $page: Int
    $limit: Int
    $set: String
    $phase: CyclePhase
    $position: PhasePosition
    $time: TimeOfDay
    $search: String
  ) {
    adminSmartCards(
      page: $page
      limit: $limit
      set: $set
      phase: $phase
      phase_position: $position
      time_of_day: $time
      search: $search
    ) {
      total
      page
      limit
      nodes {
        id
        set
        phase
        phase_position
        time_of_day
        content_type
        tone
        headline
        explanation
        mind
        hydration_tip
        source
        source_detail
      }
    }
  }
`);

export default async function RecommendationsPage({ searchParams }: PageProps<"/content/recommendations">) {
  const params = await searchParams;
  const set = param(params.set);
  const phase = param(params.phase);
  const position = param(params.position);
  const time = param(params.time);
  const q = param(params.q);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminSmartCards } = await adminRequest(Cards, {
    page,
    limit: 50,
    set: set || undefined,
    phase: (phase as CyclePhase) || undefined,
    position: (position as PhasePosition) || undefined,
    time: (time as TimeOfDay) || undefined,
    search: q || undefined,
  });
  const keep = { set, phase, position, time, q };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-3xl text-sm text-muted-foreground">
          The smart cards on Today. Members see Set A on odd cycles and Set B on even ones, picked by phase, position
          in the phase and time of day. The brain line shows on morning cards only; the water line on Menstrual,
          Ovulation and Late Luteal cards.
        </p>
        <ImportSheet
          kinds={["setA", "setB"]}
          title="Import recommendations from Excel"
          description={
            <>
              Set A (<span className="font-mono text-xs">Solu_Recommendations_v3_rewarmed.xlsx</span>), Set B (
              <span className="font-mono text-xs">Solu_Recommendations_SetB.xlsx</span>) or both. Each file replaces
              its whole set: cards are matched by id, and cards missing from the file are deleted. Checking first
              writes nothing and lists exactly what would change.
            </>
          }
        />
      </div>

      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/content/recommendations">
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Card id, headline or text" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect
          name="set"
          label="Set"
          value={set}
          options={[
            { value: "", label: "A and B" },
            { value: "A", label: "Set A (odd cycles)" },
            { value: "B", label: "Set B (even cycles)" },
          ]}
        />
        <FilterSelect name="phase" label="Phase" value={phase} options={[{ value: "", label: "All phases" }, ...PHASES]} />
        <FilterSelect
          name="position"
          label="Position"
          value={position}
          options={[
            { value: "", label: "Any" },
            ...(Object.keys(POSITION_LABELS) as Position[]).map((value) => ({ value, label: POSITION_LABELS[value] })),
          ]}
        />
        <FilterSelect name="time" label="Time of day" value={time} options={[{ value: "", label: "Any time" }, ...TIMES]} />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {Object.values(keep).some(Boolean) ? (
          <Link
            href="/content/recommendations"
            className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <CardTable cards={adminSmartCards.nodes} />

      <Pager
        page={adminSmartCards.page}
        limit={adminSmartCards.limit}
        total={adminSmartCards.total}
        href={(next) => `/content/recommendations${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
