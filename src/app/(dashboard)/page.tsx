import Link from "next/link";
import type { Metadata } from "next";
import { Activity, HeartPulse, Smartphone, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyBars, Donut, TrendChart } from "@/components/overview/charts";
import { BarList, formatNumber, KpiTile, StatRows } from "@/components/overview/stats";
import { graphql } from "@/lib/gql";
import { adminRequest } from "@/lib/server/api";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const Overview = graphql(`
  query AdminOverview($days: Int) {
    adminOverview(days: $days) {
      range_days
      from
      to
      kpis {
        total_members
        new_members
        new_members_previous
        active_today
        active_week
        active_month
        stickiness
        with_cycle
        push_reachable
        suspended
      }
      series { key points { date value } }
      cycle_types { key label count }
      phases_today { key label count }
      cities { key label count }
      glow_levels { key label count }
      interests { key label count }
      moods { key label count }
      goals { key label count }
      community { posts comments likes groups bookings upcoming_hangouts }
      top_groups { key label count }
      content {
        insight_views
        insight_views_set_a
        insight_views_set_b
        discoveries_shown
        discoveries_dismissed
        article_impressions
        ai_questions
      }
      top_articles { key label count }
      notifications { sent read by_topic { key label count } }
    }
  }
`);

const RANGES = [7, 30, 90, 365];

/** The app's phase colours (PHASE_STRONG). */
const PHASE_COLORS: Record<string, string> = {
  MENSTRUAL: "#E8648C",
  FOLLICULAR: "#F5921E",
  OVULATION: "#1D9E75",
  LUTEAL: "#6B3FA0",
};
const CYCLE_COLORS = ["#FA7521", "#8B6FE0", "#587CEF", "#1D9E75", "#9897A0"];
const MOOD_COLORS: Record<string, string> = {
  GREAT: "#1D9E75",
  GOOD: "#41A35C",
  OKAY: "#587CEF",
  LOW: "#F5921E",
  HEAVY: "#E8648C",
};

const percent = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "–");

export default async function OverviewPage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const days = RANGES.includes(Number(params.days)) ? Number(params.days) : 30;
  const { adminOverview: o } = await adminRequest(Overview, { days });
  const series = Object.fromEntries(o.series.map((item) => [item.key, item.points]));
  const { kpis } = o;
  const trend = kpis.new_members - kpis.new_members_previous;

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">How Solu is doing</h2>
          <p className="text-sm text-muted-foreground">
            {o.from} → {o.to} (UTC)
          </p>
        </div>
        <nav className="glass flex rounded-full p-1" aria-label="Date range">
          {RANGES.map((range) => (
            <Link
              key={range}
              href={range === 30 ? "/" : `/?days=${range}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                range === days ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {range === 365 ? "1 year" : `${range} days`}
            </Link>
          ))}
        </nav>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiTile
          label="Members"
          value={formatNumber(kpis.total_members)}
          hint={kpis.suspended ? `${kpis.suspended} suspended` : "None suspended"}
          icon={Users}
        />
        <KpiTile
          label={`New in ${o.range_days} days`}
          value={formatNumber(kpis.new_members)}
          hint={`${trend >= 0 ? "+" : ""}${trend} vs the ${o.range_days} days before`}
          tone={trend > 0 ? "good" : trend < 0 ? "bad" : "default"}
          icon={UserPlus}
        />
        <KpiTile
          label="Active this week"
          value={formatNumber(kpis.active_week)}
          hint={`${kpis.active_today} today · ${kpis.active_month} this month`}
          icon={Activity}
        />
        <KpiTile
          label="Tracking their cycle"
          value={percent(kpis.with_cycle, kpis.total_members)}
          hint={`${formatNumber(kpis.with_cycle)} have logged a period`}
          icon={HeartPulse}
        />
        <KpiTile
          label="Reachable by push"
          value={percent(kpis.push_reachable, kpis.total_members)}
          hint={`Stickiness (daily ÷ monthly): ${Math.round(kpis.stickiness * 100)}%`}
          icon={Smartphone}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Members over time</CardTitle>
            <CardDescription>Daily active members and new sign-ups</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart
              series={{ active: series.active ?? [], signups: series.signups ?? [] }}
              config={{
                active: { label: "Active", color: "var(--chart-1)" },
                signups: { label: "New members", color: "var(--chart-4)" },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Phases today</CardTitle>
            <CardDescription>Members with cycle data, by phase</CardDescription>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-4">
            <Donut
              slices={o.phases_today.map((item) => ({ ...item, color: PHASE_COLORS[item.key] ?? "#9897A0" }))}
            />
            <BarList items={o.phases_today.map((item) => ({ ...item, color: PHASE_COLORS[item.key] }))} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Daily activity</CardTitle>
            <CardDescription>Moods logged, posts and periods logged</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyBars
              series={{
                moods: series.moods ?? [],
                posts: series.posts ?? [],
                period_logs: series.period_logs ?? [],
              }}
              config={{
                moods: { label: "Moods", color: "var(--chart-5)" },
                posts: { label: "Posts", color: "var(--chart-1)" },
                period_logs: { label: "Periods", color: "var(--chart-2)" },
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cycle types</CardTitle>
            <CardDescription>As chosen in onboarding or the profile</CardDescription>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-4">
            <Donut
              slices={o.cycle_types.map((item, index) => ({ ...item, color: CYCLE_COLORS[index % CYCLE_COLORS.length] }))}
            />
            <BarList
              items={o.cycle_types.map((item, index) => ({ ...item, color: CYCLE_COLORS[index % CYCLE_COLORS.length] }))}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={o.cities} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Onboarding chips</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={o.interests} color="#8B6FE0" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Glow Up levels</CardTitle>
            <CardDescription>By lifetime points</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={o.glow_levels} color="#F5921E" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Moods logged</CardTitle>
            <CardDescription>In this range</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={o.moods.map((item) => ({ ...item, color: MOOD_COLORS[item.key] }))} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
            <CardDescription>In this range</CardDescription>
          </CardHeader>
          <CardContent>
            <StatRows
              rows={[
                { label: "Posts", value: o.community.posts },
                { label: "Comments", value: o.community.comments },
                { label: "Likes", value: o.community.likes },
                { label: "Hangout bookings", value: o.community.bookings },
                { label: "Upcoming hangouts", value: o.community.upcoming_hangouts },
                { label: "Groups", value: o.community.groups },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Largest groups</CardTitle>
            <CardDescription>Active members</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={o.top_groups} color="#1D9E75" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>In this range</CardDescription>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-4">
            <StatRows
              rows={[
                { label: "Insight cards shown", value: o.content.insight_views },
                { label: "· from Set A / Set B", value: `${o.content.insight_views_set_a} / ${o.content.insight_views_set_b}` },
                { label: "Did You Know shown", value: o.content.discoveries_shown },
                {
                  label: "Did You Know dismissed",
                  value: percent(o.content.discoveries_dismissed, o.content.discoveries_shown),
                },
                { label: "Article cards shown", value: o.content.article_impressions },
                { label: "Ask Solu questions", value: o.content.ai_questions },
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {formatNumber(o.notifications.sent)} sent · {percent(o.notifications.read, o.notifications.sent)} read
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={o.notifications.by_topic.slice(0, 6)} color="#587CEF" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most shown articles</CardTitle>
            <CardDescription>Today&apos;s Articles section</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={o.top_articles} empty="No article impressions in this range yet" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active goals</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={o.goals} color="#FA7521" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
