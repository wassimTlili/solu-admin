import Link from "next/link";
import type { Metadata } from "next";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect, Pager, param, query } from "@/components/data/bits";
import { graphql } from "@/lib/gql";
import type { PostStatus } from "@/lib/gql/graphql";
import { adminRequest } from "@/lib/server/api";
import { PostList } from "./post-list";

export const metadata: Metadata = { title: "Posts" };

const Posts = graphql(`
  query AdminPosts($page: Int, $limit: Int, $status: PostStatus, $search: String, $group: String, $author: String) {
    adminPosts(page: $page, limit: $limit, status: $status, search: $search, group_id: $group, author_id: $author) {
      total
      page
      limit
      nodes {
        id
        content
        status
        group_id
        group_name
        author_phase
        likes
        comments
        helpfuls
        saves
        created_at
        author { id name email image_url }
      }
    }
  }
`);

export default async function PostsPage({ searchParams }: PageProps<"/community/posts">) {
  const params = await searchParams;
  const q = param(params.q);
  const status = param(params.status);
  const group = param(params.group);
  const groupName = param(params.group_name);
  const author = param(params.author);
  const authorName = param(params.author_name);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminPosts } = await adminRequest(Posts, {
    page,
    limit: 30,
    status: (status as PostStatus) || undefined,
    search: q || undefined,
    group: group || undefined,
    author: author || undefined,
  });
  const keep = { q, status, group, group_name: groupName, author, author_name: authorName };

  return (
    <div className="grid gap-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Posts in every group, newest first. Hiding a post takes it out of every feed, link and saved list (its author
        still sees it); it can be restored. Deleting removes it with its comments for good.
      </p>

      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/community/posts">
        {group ? <input type="hidden" name="group" value={group} /> : null}
        {groupName ? <input type="hidden" name="group_name" value={groupName} /> : null}
        {author ? <input type="hidden" name="author" value={author} /> : null}
        {authorName ? <input type="hidden" name="author_name" value={authorName} /> : null}
        <label className="grid min-w-56 flex-1 gap-1 text-xs text-muted-foreground">
          Search
          <span className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input name="q" defaultValue={q} placeholder="Words in the post" className="h-9 bg-white/60 pl-8" />
          </span>
        </label>
        <FilterSelect
          name="status"
          label="Status"
          value={status}
          options={[
            { value: "", label: "Published and hidden" },
            { value: "PUBLISHED", label: "Published" },
            { value: "REJECTED", label: "Hidden" },
          ]}
        />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {Object.values(keep).some(Boolean) ? (
          <Link href="/community/posts" className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        ) : null}
      </form>

      {group || author ? (
        <div className="flex flex-wrap gap-2">
          {group ? (
            <Link
              href={`/community/posts${query({ ...keep, group: undefined, group_name: undefined })}`}
              className="glass inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs"
            >
              Group: {groupName ?? "selected"} <X className="size-3" />
            </Link>
          ) : null}
          {author ? (
            <Link
              href={`/community/posts${query({ ...keep, author: undefined, author_name: undefined })}`}
              className="glass inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs"
            >
              By: {authorName ?? "selected member"} <X className="size-3" />
            </Link>
          ) : null}
        </div>
      ) : null}

      <PostList posts={adminPosts.nodes} />

      <Pager
        page={adminPosts.page}
        limit={adminPosts.limit}
        total={adminPosts.total}
        href={(next) => `/community/posts${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
