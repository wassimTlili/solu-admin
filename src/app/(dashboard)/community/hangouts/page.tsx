import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pager, param, query } from "@/components/data/bits";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";
import { cn } from "@/lib/utils";
import { HangoutList } from "./hangout-list";

export const metadata: Metadata = { title: "Hangouts" };

const Hangouts = graphql(`
  query AdminHangouts($page: Int, $limit: Int, $when: String, $search: String) {
    adminEvents(page: $page, limit: $limit, when: $when, search: $search) {
      total
      page
      limit
      nodes {
        id
        title
        description
        cover_image_url
        status
        city
        location_address
        venue_details
        meeting_url
        is_online
        start_time
        end_time
        doors_open_at
        capacity
        fee_amount
        host_name
        host_description
        host_image_url
        recommended_phases
        phase_tip
        topics
        going
        cancelled
        created_at
      }
    }
    adminInterests { id name }
  }
`);

export default async function HangoutsPage({ searchParams }: PageProps<"/community/hangouts">) {
  const params = await searchParams;
  const when = param(params.when) === "past" ? "past" : "upcoming";
  const q = param(params.q);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminEvents, adminInterests } = await adminRequest(Hangouts, {
    page,
    limit: 20,
    when,
    search: q || undefined,
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <nav className="glass flex w-fit gap-1 rounded-xl p-1" aria-label="When">
          {(["upcoming", "past"] as const).map((value) => (
            <Link
              key={value}
              href={`/community/hangouts${query({ when: value === "past" ? "past" : undefined, q })}`}
              aria-current={when === value ? "page" : undefined}
              className={cn(
                "inline-flex h-8 items-center rounded-lg px-3 text-sm capitalize transition-colors",
                when === value ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
            </Link>
          ))}
        </nav>
        <form className="flex items-end gap-2" action="/community/hangouts">
          {when === "past" ? <input type="hidden" name="when" value="past" /> : null}
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Title or city" className="h-9 w-64 bg-white/60 pl-8" />
          </span>
          <Button type="submit" variant="outline" className="h-9">
            Search
          </Button>
        </form>
      </div>

      <HangoutList hangouts={adminEvents.nodes} interests={adminInterests} past={when === "past"} />

      <Pager
        page={adminEvents.page}
        limit={adminEvents.limit}
        total={adminEvents.total}
        href={(next) => `/community/hangouts${query({ when: when === "past" ? "past" : undefined, q, page: next || undefined })}`}
      />
    </div>
  );
}
