import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect, Pager, param, query } from "@/components/data/bits";
import { DYK_CATEGORIES } from "@/components/content/options";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";
import { FactTable } from "./fact-table";

export const metadata: Metadata = { title: "Did You Know" };

const Facts = graphql(`
  query AdminFacts($page: Int, $limit: Int, $search: String, $category: String, $active: Boolean) {
    adminDidYouKnow(page: $page, limit: $limit, search: $search, category: $category, active: $active) {
      total
      page
      limit
      nodes {
        id
        external_id
        category
        title
        full_text
        source_url
        is_active
        position
      }
    }
  }
`);

export default async function DidYouKnowPage({ searchParams }: PageProps<"/content/did-you-know">) {
  const params = await searchParams;
  const q = param(params.q);
  const category = param(params.category);
  const active = param(params.active);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminDidYouKnow } = await adminRequest(Facts, {
    page,
    limit: 50,
    search: q || undefined,
    category: category || undefined,
    active: active === "yes" ? true : active === "no" ? false : undefined,
  });
  const keep = { q, category, active };

  return (
    <div className="grid gap-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        One fact a day on Today, rotating through the active facts in order (#1 first) by account age. Retired facts
        stay here but leave the rotation.
      </p>

      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/content/did-you-know">
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Title or id (DYK-CAB-01)" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect
          name="category"
          label="Category"
          value={category}
          options={[{ value: "", label: "All categories" }, ...DYK_CATEGORIES.map((value) => ({ value, label: value }))]}
        />
        <FilterSelect
          name="active"
          label="Status"
          value={active}
          options={[
            { value: "", label: "Active and retired" },
            { value: "yes", label: "In rotation" },
            { value: "no", label: "Retired" },
          ]}
        />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {Object.values(keep).some(Boolean) ? (
          <Link href="/content/did-you-know" className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        ) : null}
      </form>

      <FactTable facts={adminDidYouKnow.nodes} />

      <Pager
        page={adminDidYouKnow.page}
        limit={adminDidYouKnow.limit}
        total={adminDidYouKnow.total}
        href={(next) => `/content/did-you-know${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
