import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, PhaseDot, StatusBadge, timeAgo } from "@/components/data/bits";
import { StatRows } from "@/components/overview/stats";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";
import { MemberActions } from "./member-actions";

export const metadata: Metadata = { title: "Member" };

const Member = graphql(`
  query AdminMember($id: String!) {
    adminMe { id }
    adminUser(id: $id) {
      id
      email
      first_name
      last_name
      username
      image_url
      status
      role
      location
      login_provider
      cycle_type
      phase
      cycle_day
      cycle_length
      timezone
      age
      suspended_at
      suspension_reason
      lifetime_points
      level
      invited_by
      device_platforms
      group_names
      created_at
      last_login
      counts {
        posts
        comments
        groups
        hangout_bookings
        moods
        journal_entries
        period_logs
        active_goals
        badges
        friends
        devices
        active_days_30
      }
      recent_posts { id excerpt group_name status created_at }
    }
    adminAuditLog(target_type: "user", target_id: $id, limit: 10) {
      nodes { id action details created_at admin_email }
    }
  }
`);

const CYCLE_LABELS: Record<string, string> = {
  NATURAL: "Natural",
  CONTRACEPTION: "Hormonal contraception",
  POST_PILL: "Post-pill",
  IRREGULAR: "Irregular",
  NOT_SURE: "Not sure",
};

const ACTION_LABELS: Record<string, string> = {
  "user.suspend": "Suspended",
  "user.reactivate": "Reactivated",
  "user.role": "Role changed",
  "user.delete": "Deleted",
  "user.notify": "Notification sent",
};

export default async function MemberPage({ params }: PageProps<"/members/[id]">) {
  const { id } = await params;
  const { adminUser: user, adminMe, adminAuditLog } = await adminRequest(Member, { id });
  const name = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const c = user.counts;

  return (
    <div className="grid gap-4">
      <Link href="/members" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Members
      </Link>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16">
            {user.image_url ? <AvatarImage src={user.image_url} alt="" /> : null}
            <AvatarFallback className="text-xl">{name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-48 flex-1">
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-sm text-muted-foreground">
              {user.email}
              {user.username ? ` · @${user.username}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <StatusBadge status={user.status} />
              {user.role === "ADMIN" ? (
                <span className="rounded bg-primary/12 px-1.5 py-0.5 text-xs font-semibold text-primary">ADMIN</span>
              ) : null}
              <span className="text-muted-foreground">Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
          <MemberActions
            id={user.id}
            email={user.email}
            status={user.status}
            role={user.role}
            isSelf={user.id === adminMe.id}
          />
        </CardContent>
      </Card>

      {user.status === "SUSPENDED" ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-800">
          Suspended {formatDate(user.suspended_at, true)}
          {user.suspension_reason ? `: ${user.suspension_reason}` : ""}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <StatRows
              rows={[
                { label: "City", value: user.location ?? "—" },
                { label: "Age", value: user.age ?? "—" },
                { label: "Time zone", value: user.timezone ?? "—" },
                { label: "Signs in with", value: user.login_provider ? user.login_provider.toLowerCase() : "—" },
                { label: "Last sign-in", value: timeAgo(user.last_login) },
                { label: "Invited by", value: user.invited_by ?? "—" },
                { label: "Push devices", value: user.device_platforms.length ? user.device_platforms.join(", ") : "None" },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cycle & Glow Up</CardTitle>
          </CardHeader>
          <CardContent>
            <StatRows
              rows={[
                { label: "Cycle type", value: user.cycle_type ? CYCLE_LABELS[user.cycle_type] : "—" },
                {
                  label: "Today",
                  value: user.cycle_day ? `Day ${user.cycle_day} of ${user.cycle_length}` : "No cycle data",
                },
                { label: "Periods logged", value: c.period_logs },
                { label: "Glow Up level", value: user.level },
                { label: "Lifetime points", value: user.lifetime_points },
                { label: "Badges", value: c.badges },
                { label: "Active goals", value: c.active_goals },
              ]}
            />
            <div className="mt-3 text-sm">
              <PhaseDot phase={user.phase} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Counts only; private entries are never shown</CardDescription>
          </CardHeader>
          <CardContent>
            <StatRows
              rows={[
                { label: "Active days (last 30)", value: c.active_days_30 },
                { label: "Moods logged", value: c.moods },
                { label: "Journal entries", value: c.journal_entries },
                { label: "Posts / comments", value: `${c.posts} / ${c.comments}` },
                { label: "Groups", value: c.groups },
                { label: "Friends", value: c.friends },
                { label: "Hangout bookings", value: c.hangout_bookings },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent posts</CardTitle>
            <CardDescription>
              {user.group_names.length ? `In ${user.group_names.join(", ")}` : "Not in any group"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {user.recent_posts.length ? (
              user.recent_posts.map((post) => (
                <div key={post.id} className="rounded-lg bg-white/50 p-3 text-sm">
                  <p>{post.excerpt}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {post.group_name} · {formatDate(post.created_at)} · {post.status.toLowerCase()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No posts.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin history</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {adminAuditLog.nodes.length ? (
              adminAuditLog.nodes.map((entry) => {
                const details = (entry.details ?? {}) as { reason?: string; to?: string };
                return (
                  <div key={entry.id} className="flex justify-between gap-3">
                    <span>
                      {ACTION_LABELS[entry.action] ?? entry.action}
                      {details.reason ? `: ${details.reason}` : details.to ? ` → ${details.to}` : ""}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {entry.admin_email} · {formatDate(entry.created_at, true)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground">No admin actions on this account.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
