import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, Pager, param, StatusBadge } from "@/components/data/bits";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";
import { CancelCampaign } from "./cancel-campaign";
import { Composer, type Recipient } from "./composer";

export const metadata: Metadata = { title: "Notifications" };

const History = graphql(`
  query AdminCampaignHistory($page: Int) {
    adminCampaigns(page: $page, limit: 15) {
      total
      page
      limit
      nodes {
        id
        title
        body
        audience_label
        status
        scheduled_at
        sent_at
        error
        recipients
        pushed
        queued
        inbox_only
        created_by_name
        created_at
      }
    }
  }
`);

const RecipientQuery = graphql(`
  query AdminCampaignRecipient($id: String!) {
    adminUser(id: $id) { id first_name last_name email image_url status }
  }
`);

export default async function NotificationsPage({ searchParams }: PageProps<"/notifications">) {
  const params = await searchParams;
  const page = Math.max(0, Number(param(params.page) ?? 0) || 0);
  const to = param(params.to);

  const [{ adminCampaigns }, recipient] = await Promise.all([
    adminRequest(History, { page }),
    to
      ? adminRequest(RecipientQuery, { id: to }).catch((error) => {
          unstable_rethrow(error);
          return null;
        })
      : Promise.resolve(null),
  ]);
  const initial: Recipient[] =
    recipient?.adminUser && recipient.adminUser.status === "ACTIVE" ? [recipient.adminUser] : [];

  return (
    <div className="grid gap-6">
      <Composer key={to ?? "all"} initialMembers={initial} />

      <Card className="py-0">
        <CardHeader className="pt-5">
          <CardTitle>Sent and scheduled</CardTitle>
          <CardDescription>
            Reached = members who got it in the app. Pushes are counted per device; queued ones wait for 07:00 in the
            member&apos;s time zone (quiet hours).
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[34%] pl-4">Notification</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Reached</TableHead>
                <TableHead className="text-right">Pushes</TableHead>
                <TableHead className="text-right">Queued</TableHead>
                <TableHead className="text-right">Inbox only</TableHead>
                <TableHead className="pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminCampaigns.nodes.length ? (
                adminCampaigns.nodes.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="max-w-0 pl-4">
                      <p className="truncate font-medium">{campaign.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{campaign.body}</p>
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{campaign.audience_label}</TableCell>
                    <TableCell>
                      <div className="grid gap-0.5">
                        <StatusBadge status={campaign.status} />
                        <span className="text-[11px] text-muted-foreground">
                          {(campaign.status === "SCHEDULED" || campaign.status === "CANCELLED") && campaign.scheduled_at
                            ? `${campaign.status === "CANCELLED" ? "was for" : "for"} ${formatDate(campaign.scheduled_at, true)}`
                            : campaign.sent_at
                              ? formatDate(campaign.sent_at, true)
                              : formatDate(campaign.created_at, true)}
                          {campaign.created_by_name ? ` · ${campaign.created_by_name}` : ""}
                        </span>
                        {campaign.error ? <span className="text-[11px] text-destructive">{campaign.error}</span> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{campaign.recipients}</TableCell>
                    <TableCell className="text-right tabular-nums">{campaign.pushed}</TableCell>
                    <TableCell className="text-right tabular-nums">{campaign.queued}</TableCell>
                    <TableCell className="text-right tabular-nums">{campaign.inbox_only}</TableCell>
                    <TableCell className="pr-4 text-right">
                      {campaign.status === "SCHEDULED" ? <CancelCampaign id={campaign.id} title={campaign.title} /> : null}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    Nothing sent yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pager
        page={adminCampaigns.page}
        limit={adminCampaigns.limit}
        total={adminCampaigns.total}
        href={(next) => (next ? `/notifications?page=${next}` : "/notifications")}
      />
    </div>
  );
}
