import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect, Pager, param, query } from "@/components/data/bits";
import { graphql } from "@/lib/gql";
import type { GroupType } from "@/lib/gql/graphql";
import { adminRequest } from "@/lib/server/api";
import { GroupGrid } from "./group-grid";

export const metadata: Metadata = { title: "Groups" };

const Groups = graphql(`
  query AdminGroups($page: Int, $limit: Int, $search: String, $type: GroupType) {
    adminGroups(page: $page, limit: $limit, search: $search, type: $type) {
      total
      page
      limit
      nodes {
        id
        name
        description
        type
        image_url
        location
        phase_tag
        members
        posts
        pending
        created_at
        owner { id name email image_url }
      }
    }
  }
`);

export default async function GroupsPage({ searchParams }: PageProps<"/community/groups">) {
  const params = await searchParams;
  const q = param(params.q);
  const type = param(params.type);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminGroups } = await adminRequest(Groups, {
    page,
    limit: 24,
    search: q || undefined,
    type: (type as GroupType) || undefined,
  });
  const keep = { q, type };

  return (
    <div className="grid gap-4">
      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/community/groups">
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Group name or city" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect
          name="type"
          label="Type"
          value={type}
          options={[
            { value: "", label: "Public and private" },
            { value: "PUBLIC", label: "Public" },
            { value: "PRIVATE", label: "Private" },
          ]}
        />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {q || type ? (
          <Link href="/community/groups" className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        ) : null}
      </form>

      <GroupGrid groups={adminGroups.nodes} />

      <Pager
        page={adminGroups.page}
        limit={adminGroups.limit}
        total={adminGroups.total}
        href={(next) => `/community/groups${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
