import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect, Pager, param, query } from "@/components/data/bits";
import { PHASES } from "@/components/content/options";
import { graphql } from "@/lib/gql";
import type { ContentKind, CyclePhase } from "@/lib/gql/graphql";
import { adminRequest } from "@/lib/server/api";
import { cn } from "@/lib/utils";
import { LibraryList } from "./library-list";

export const metadata: Metadata = { title: "Insights & prompts" };

const Items = graphql(`
  query AdminLibrary($page: Int, $limit: Int, $kind: ContentKind, $phase: CyclePhase, $search: String, $active: Boolean) {
    adminLibraryItems(page: $page, limit: $limit, kind: $kind, phase: $phase, search: $search, active: $active) {
      total
      page
      limit
      nodes {
        id
        kind
        phase
        title
        body
        details {
          icon
          title
          body
        }
        is_active
        updated_at
      }
    }
  }
`);

const KINDS = [
  { value: "INSIGHT", label: "Insights", blurb: "The insight sheet on Today: a title, a short text and up to 6 explained points." },
  { value: "JOURNAL_PROMPT", label: "Journal prompts", blurb: "The Mind prompt on Today and in the journal, rotating within the member's phase." },
] as const;

export default async function LibraryPage({ searchParams }: PageProps<"/content/library">) {
  const params = await searchParams;
  const kind = (KINDS.find((item) => item.value === param(params.kind)) ?? KINDS[0]).value;
  const phase = param(params.phase);
  const active = param(params.active);
  const q = param(params.q);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminLibraryItems } = await adminRequest(Items, {
    page,
    limit: 50,
    kind: kind as ContentKind,
    phase: (phase as CyclePhase) || undefined,
    search: q || undefined,
    active: active === "yes" ? true : active === "no" ? false : undefined,
  });
  const keep = { kind, phase, active, q };

  return (
    <div className="grid gap-4">
      <nav className="glass flex w-fit gap-1 rounded-xl p-1" aria-label="Kind">
        {KINDS.map((item) => (
          <Link
            key={item.value}
            href={`/content/library?kind=${item.value}`}
            aria-current={item.value === kind ? "page" : undefined}
            className={cn(
              "inline-flex h-8 items-center rounded-lg px-3 text-sm transition-colors",
              item.value === kind ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <p className="max-w-3xl text-sm text-muted-foreground">
        {KINDS.find((item) => item.value === kind)?.blurb} Items for the member's phase are used first; items with no phase
        fill in when there are none.
      </p>

      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/content/library">
        <input type="hidden" name="kind" value={kind} />
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Title or text" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect name="phase" label="Phase" value={phase} options={[{ value: "", label: "All phases" }, ...PHASES]} />
        <FilterSelect
          name="active"
          label="Status"
          value={active}
          options={[
            { value: "", label: "Live and paused" },
            { value: "yes", label: "Live" },
            { value: "no", label: "Paused" },
          ]}
        />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {phase || active || q ? (
          <Link
            href={`/content/library?kind=${kind}`}
            className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <LibraryList kind={kind} items={adminLibraryItems.nodes} />

      <Pager
        page={adminLibraryItems.page}
        limit={adminLibraryItems.limit}
        total={adminLibraryItems.total}
        href={(next) => `/content/library${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
