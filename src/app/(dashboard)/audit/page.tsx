import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilterSelect, formatDate, Pager, param, query } from "@/components/data/bits";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";

export const metadata: Metadata = { title: "Audit log" };

const Audit = graphql(`
  query AdminAudit($page: Int, $limit: Int, $action: String, $type: String, $target: String) {
    adminAuditLog(page: $page, limit: $limit, action: $action, target_type: $type, target_id: $target) {
      total
      page
      limit
      nodes {
        id
        action
        target_type
        target_id
        details
        created_at
        admin_email
        admin_name
      }
    }
  }
`);

/** What each recorded action means, in words. */
const ACTIONS: Record<string, string> = {
  "admin.login": "Signed in to the dashboard",
  "user.suspend": "Suspended a member",
  "user.reactivate": "Reactivated a member",
  "user.role": "Changed a member's role",
  "user.delete": "Deleted a member's account",
  "campaign.send": "Sent a notification",
  "campaign.schedule": "Scheduled a notification",
  "campaign.cancel": "Cancelled a scheduled notification",
  "content.import": "Imported spreadsheets",
  "content.smart_card.create": "Added a recommendation",
  "content.smart_card.update": "Edited a recommendation",
  "content.smart_card.delete": "Deleted a recommendation",
  "content.did_you_know.create": "Added a Did You Know fact",
  "content.did_you_know.update": "Edited a Did You Know fact",
  "content.did_you_know.delete": "Deleted a Did You Know fact",
  "content.cycle_day.save": "Saved a cycle-day line",
  "content.cycle_day.delete": "Deleted a cycle-day line",
  "content.article.update": "Edited an article",
  "content.article.refresh": "Refreshed an article from the blog",
  "content.library.create": "Added an insight or prompt",
  "content.library.update": "Edited an insight or prompt",
  "content.library.delete": "Deleted an insight or prompt",
  "post.hide": "Hid a post",
  "post.restore": "Restored a post",
  "post.delete": "Deleted a post",
  "comment.delete": "Deleted a comment",
  "group.delete": "Deleted a group",
  "event.create": "Created a hangout",
  "event.update": "Edited a hangout",
  "event.cancel": "Cancelled a hangout",
};

const AREAS = [
  { value: "", label: "Everything" },
  { value: "user.", label: "Members" },
  { value: "campaign.", label: "Notifications" },
  { value: "content.", label: "Content" },
  { value: "post.", label: "Posts" },
  { value: "comment.", label: "Comments" },
  { value: "group.", label: "Groups" },
  { value: "event.", label: "Hangouts" },
  { value: "admin.", label: "Sign-ins" },
];

/** The most telling detail of a change: why, and what it was about. */
const summary = (details: unknown): string | null => {
  if (!details || typeof details !== "object") return null;
  const record = details as Record<string, unknown>;
  const parts = [record.reason, record.title, record.name, record.audience, record.excerpt, record.role]
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  return parts.length ? parts.join(" · ") : null;
};

const targetHref = (type: string | null, id: string | null) => {
  if (!id) return null;
  if (type === "user") return `/members/${id}`;
  return null;
};

export default async function AuditPage({ searchParams }: PageProps<"/audit">) {
  const params = await searchParams;
  const area = param(params.area);
  const type = param(params.type);
  const target = param(params.target);
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);

  const { adminAuditLog } = await adminRequest(Audit, {
    page,
    limit: 50,
    action: area || undefined,
    type: type || undefined,
    target: target || undefined,
  });
  const keep = { area, type, target };

  return (
    <div className="grid gap-4">
      <p className="max-w-3xl text-sm text-muted-foreground">
        Every change made from this dashboard: who made it, when, and why. Entries can&apos;t be edited or removed.
      </p>

      <form className="glass flex flex-wrap items-end gap-3 rounded-xl p-3" action="/audit">
        {type ? <input type="hidden" name="type" value={type} /> : null}
        {target ? <input type="hidden" name="target" value={target} /> : null}
        <FilterSelect name="area" label="Area" value={area} options={AREAS} />
        <Button type="submit" className="h-9">
          Apply
        </Button>
        {area || type || target ? (
          <Link href="/audit" className="h-9 content-center px-1 text-sm text-muted-foreground hover:text-foreground">
            Clear
          </Link>
        ) : null}
        {target ? (
          <span className="h-9 content-center text-xs text-muted-foreground">
            Showing one {type ?? "record"} only
          </span>
        ) : null}
      </form>

      <Card className="py-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44 pl-4">When</TableHead>
                <TableHead className="w-52">Who</TableHead>
                <TableHead>What</TableHead>
                <TableHead className="w-[38%] pr-4">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminAuditLog.nodes.length ? (
                adminAuditLog.nodes.map((entry) => {
                  const href = targetHref(entry.target_type, entry.target_id);
                  const text = summary(entry.details);
                  return (
                    <TableRow key={entry.id} className="align-top">
                      <TableCell className="pl-4 text-muted-foreground">{formatDate(entry.created_at, true)}</TableCell>
                      <TableCell>
                        <span className="grid leading-tight">
                          <span>{entry.admin_name || "—"}</span>
                          <span className="text-xs text-muted-foreground">{entry.admin_email ?? "Removed admin"}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="grid leading-tight">
                          <span>{ACTIONS[entry.action] ?? entry.action}</span>
                          {entry.target_id ? (
                            href ? (
                              <Link href={href} className="text-xs text-primary">
                                Open {entry.target_type}
                              </Link>
                            ) : (
                              <Link
                                href={`/audit${query({ type: entry.target_type, target: entry.target_id })}`}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                History of this {entry.target_type?.replaceAll("_", " ")}
                              </Link>
                            )
                          ) : null}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-0 pr-4">
                        {text ? <p className="line-clamp-2 text-sm">{text}</p> : null}
                        {entry.details ? (
                          <details className="mt-1 text-xs text-muted-foreground">
                            <summary className="cursor-pointer select-none">All details</summary>
                            <pre className="mt-1 max-h-48 overflow-auto rounded-lg bg-black/5 p-2 whitespace-pre-wrap">
                              {JSON.stringify(entry.details, null, 2)}
                            </pre>
                          </details>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    Nothing recorded for these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pager
        page={adminAuditLog.page}
        limit={adminAuditLog.limit}
        total={adminAuditLog.total}
        href={(next) => `/audit${query({ ...keep, page: next || undefined })}`}
      />
    </div>
  );
}
