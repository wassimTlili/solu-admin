import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect, Pager, param, query } from "@/components/data/bits";
import { PHASES } from "@/components/content/options";
import { graphql } from "@/lib/gql";
import type { CyclePhase } from "@/lib/gql/graphql";
import { adminRequest } from "@/lib/server/api";
import { ArticleGrid } from "./article-grid";

export const metadata: Metadata = { title: "Articles" };

const Articles = graphql(`
  query AdminArticles($page: Int, $limit: Int, $search: String, $active: Boolean, $phase: CyclePhase) {
    adminBlogArticles(page: $page, limit: $limit, search: $search, active: $active, phase: $phase) {
      total
      page
      limit
      nodes {
        id
        slug
        title
        url
        cover_image
        first_para
        phase_tags
        interest_tags
        topic_tags
        published_at
        is_active
        impressions
      }
    }
  }
`);

export default async function ArticlesPage({ searchParams }: PageProps<"/content/articles">) {
  const params = await searchParams;
  const q = param(params.q);
  const active = param(params.active);
  const phase = param(params.phase);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminBlogArticles } = await adminRequest(Articles, {
    page,
    limit: 24,
    search: q || undefined,
    active: active === "yes" ? true : active === "no" ? false : undefined,
    phase: (phase as CyclePhase) || undefined,
  });
  const keep = { q, active, phase };

  return (
    <div className="grid gap-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Two blog articles a day on Today: articles tagged with the member&apos;s phase come first, then the best match with their
        interests, newest first. Hidden articles are never recommended. Note: running the blog sync (
        <code className="text-xs">npm run db:sync-blog</code>) resets tags and visibility to the tagging spreadsheet.
      </p>

      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/content/articles">
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Title or slug" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect name="phase" label="Phase tag" value={phase} options={[{ value: "", label: "Any phase" }, ...PHASES]} />
        <FilterSelect
          name="active"
          label="Status"
          value={active}
          options={[
            { value: "", label: "Shown and hidden" },
            { value: "yes", label: "Shown" },
            { value: "no", label: "Hidden" },
          ]}
        />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {Object.values(keep).some(Boolean) ? (
          <Link href="/content/articles" className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        ) : null}
      </form>

      <ArticleGrid articles={adminBlogArticles.nodes} />

      <Pager
        page={adminBlogArticles.page}
        limit={adminBlogArticles.limit}
        total={adminBlogArticles.total}
        href={(next) => `/content/articles${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
