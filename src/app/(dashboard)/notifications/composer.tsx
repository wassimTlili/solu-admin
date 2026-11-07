"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { BellRing, CalendarClock, Megaphone, Search, Send, Smartphone, Users, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_TIME_ZONE, formatDate, PHASE_COLORS, teamTimeToDate } from "@/components/data/bits";
import { Chips, Field, Select } from "@/components/content/form";
import { PHASES } from "@/components/content/options";
import type { AdminAudienceInput, CyclePhase, CycleType } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";
import { countAudience, createCampaign, searchMembers, sendTest } from "./actions";

export interface Recipient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string | null;
}

type Kind = "ALL" | "FILTER" | "MEMBERS";

/** Screens the app can open from a notification (its notification router). */
const ROUTES = [
  { value: "today", label: "Today" },
  { value: "cycle", label: "My Cycle" },
  { value: "progress", label: "Progress" },
  { value: "glow-up", label: "Glow Up" },
  { value: "goals", label: "Goals" },
  { value: "badges", label: "Badges" },
  { value: "friends", label: "Friends" },
  { value: "notifications", label: "Notifications inbox" },
];

const CYCLE_TYPES = [
  { value: "NATURAL", label: "Natural" },
  { value: "CONTRACEPTION", label: "Hormonal contraception" },
  { value: "POST_PILL", label: "Post-pill" },
  { value: "IRREGULAR", label: "Irregular" },
  { value: "NOT_SURE", label: "Not sure" },
];

const WITHIN = [
  { value: "", label: "Any time" },
  { value: "7", label: "In the last 7 days" },
  { value: "30", label: "In the last 30 days" },
  { value: "90", label: "In the last 90 days" },
];

const KINDS: { value: Kind; label: string; icon: typeof Users }[] = [
  { value: "ALL", label: "Everyone", icon: Users },
  { value: "FILTER", label: "Filter", icon: Search },
  { value: "MEMBERS", label: "Chosen members", icon: BellRing },
];

const nameOf = (member: Recipient) => `${member.first_name} ${member.last_name}`.trim() || member.email;

export function Composer({ initialMembers }: { initialMembers: Recipient[] }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [route, setRoute] = useState("today");
  const [kind, setKind] = useState<Kind>(initialMembers.length ? "MEMBERS" : "ALL");
  const [phases, setPhases] = useState<string[]>([]);
  const [cycleTypes, setCycleTypes] = useState<string[]>([]);
  const [cities, setCities] = useState("");
  const [active, setActive] = useState("");
  const [joined, setJoined] = useState("");
  const [members, setMembers] = useState<Recipient[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Recipient[]>([]);
  const [when, setWhen] = useState<"now" | "later">("now");
  const [sendAt, setSendAt] = useState("");
  const [count, setCount] = useState<{ members: number; reachable: number } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const audience = useMemo<AdminAudienceInput>(() => {
    if (kind === "ALL") return { kind };
    if (kind === "MEMBERS") return { kind, user_ids: members.map((member) => member.id) };
    const cityList = cities
      .split(",")
      .map((city) => city.trim())
      .filter(Boolean);
    return {
      kind,
      phases: phases.length ? (phases as CyclePhase[]) : null,
      cycle_types: cycleTypes.length ? (cycleTypes as CycleType[]) : null,
      cities: cityList.length ? cityList : null,
      active_within_days: active ? Number(active) : null,
      joined_within_days: joined ? Number(joined) : null,
    };
  }, [kind, members, phases, cycleTypes, cities, active, joined]);
  const audienceKey = JSON.stringify(audience);

  // Live count, a moment after the audience stops changing.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await countAudience(JSON.parse(audienceKey) as AdminAudienceInput);
      if (cancelled) return;
      if (result.error) toast.error(result.error);
      setCount(result.data ?? null);
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [audienceKey]);

  // Member search for "Chosen members".
  useEffect(() => {
    if (kind !== "MEMBERS" || search.trim().length < 2) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await searchMembers(search);
      if (!cancelled) setResults(result.data ?? []);
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [kind, search]);

  const scheduledFor = when === "later" && sendAt ? teamTimeToDate(sendAt) : null;
  // Checked when the time is picked and again on Schedule (never during render: time moves on).
  const [pastTime, setPastTime] = useState(false);
  const isPast = (value: string) => teamTimeToDate(value).getTime() < Date.now() + 60_000;
  const scheduleProblem =
    when === "later"
      ? !scheduledFor || Number.isNaN(scheduledFor.getTime())
        ? "Pick a date and time."
        : pastTime
          ? "Pick a time in the future."
          : null
      : null;
  const messageOk = title.trim().length >= 3 && title.length <= 65 && body.trim().length >= 3 && body.length <= 240;
  const audienceOk = kind !== "MEMBERS" || members.length > 0;
  const nobody = when === "now" && count?.members === 0;
  const canSend = messageOk && audienceOk && !scheduleProblem && !nobody && !pending;

  const reset = () => {
    setTitle("");
    setBody("");
    setWhen("now");
    setSendAt("");
  };

  const send = () =>
    startTransition(async () => {
      const result = await createCampaign({
        title,
        body,
        route,
        audience,
        send_at: scheduledFor ? scheduledFor.toISOString() : null,
      });
      setConfirming(false);
      if (result.error || !result.data) {
        toast.error(result.error ?? "Not sent.");
        return;
      }
      const sent = result.data;
      if (sent.status === "SCHEDULED") {
        toast.success(`Scheduled for ${formatDate(scheduledFor?.toISOString(), true)}`);
      } else if (sent.status === "FAILED") {
        toast.error("Sending failed. See the history below.");
      } else {
        toast.success(
          `Sent to ${sent.recipients} member${sent.recipients === 1 ? "" : "s"}: ${sent.pushed} push${sent.pushed === 1 ? "" : "es"}` +
            (sent.queued ? `, ${sent.queued} waiting for the morning` : "") +
            (sent.inbox_only ? `, ${sent.inbox_only} in the inbox only` : ""),
        );
      }
      reset();
    });

  const test = () =>
    startTransition(async () => {
      const result = await sendTest({ title, body, route });
      if (result.error || !result.data) {
        toast.error(result.error ?? "Test not sent.");
        return;
      }
      const { devices, pushed, queued } = result.data;
      if (!devices) toast.info("It's in your app inbox. No device is registered for your account, so no push.");
      else if (queued) toast.info("It's in your inbox; the push waits for 07:00 (quiet hours).");
      else toast.success(`Sent to your ${pushed} device${pushed === 1 ? "" : "s"} and your inbox.`);
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>New notification</CardTitle>
        <CardDescription>
          Lands in members&apos; notification inbox as &ldquo;News from Solu&rdquo;, and as a push where their settings
          allow it. Pushes between 22:00 and 07:00 in their time zone wait until 07:00.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid content-start gap-5">
          <div className="grid gap-3">
            <Field label="Title" count={title.length} max={65} hint="Short and specific. About 50 characters show in full.">
              <Input value={title} onChange={(event) => setTitle(event.target.value)} className="bg-white/60" placeholder="Hangouts are here" />
            </Field>
            <Field label="Message" count={body.length} max={240} hint="About 110 characters show on a lock screen.">
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={3}
                className="bg-white/60"
                placeholder="Meet women in your city who are in sync with you. Book your first hangout this week."
              />
            </Field>
            <Field label="Opens" className="max-w-xs">
              <Select value={route} onChange={setRoute} options={ROUTES} />
            </Field>
          </div>

          <div className="grid gap-3">
            <span className="text-xs font-medium text-muted-foreground">Who gets it</span>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/5 p-1">
              {KINDS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setKind(item.value)}
                  aria-pressed={kind === item.value}
                  className={cn(
                    "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-sm transition-colors",
                    kind === item.value ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </button>
              ))}
            </div>

            {kind === "ALL" ? (
              <p className="text-sm text-muted-foreground">Every active member.</p>
            ) : null}

            {kind === "FILTER" ? (
              <div className="glass grid gap-4 rounded-xl p-3.5">
                <Field label="Phase" hint="Each member's phase on the day it goes out. Members without cycle data are left out.">
                  <Chips
                    options={PHASES.map((phase) => ({ ...phase, color: PHASE_COLORS[phase.value] }))}
                    value={phases}
                    onChange={setPhases}
                  />
                </Field>
                <Field label="Cycle type">
                  <Chips options={CYCLE_TYPES} value={cycleTypes} onChange={setCycleTypes} />
                </Field>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="City" hint="Comma separated">
                    <Input value={cities} onChange={(event) => setCities(event.target.value)} placeholder="Dubai, Abu Dhabi" className="bg-white/60" />
                  </Field>
                  <Field label="Opened the app">
                    <Select value={active} onChange={setActive} options={WITHIN} />
                  </Field>
                  <Field label="Joined">
                    <Select value={joined} onChange={setJoined} options={WITHIN} />
                  </Field>
                </div>
              </div>
            ) : null}

            {kind === "MEMBERS" ? (
              <div className="glass grid gap-3 rounded-xl p-3.5">
                {members.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {members.map((member) => (
                      <span key={member.id} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/80 pr-1 pl-1 text-xs">
                        <Avatar className="size-5">
                          {member.image_url ? <AvatarImage src={member.image_url} alt="" /> : null}
                          <AvatarFallback className="text-[10px]">{nameOf(member).slice(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {nameOf(member)}
                        <button
                          type="button"
                          aria-label={`Remove ${nameOf(member)}`}
                          onClick={() => setMembers(members.filter((item) => item.id !== member.id))}
                          className="rounded-full p-0.5 text-muted-foreground hover:bg-black/5 hover:text-foreground"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No one chosen yet.</p>
                )}
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Find a member by name or email"
                    className="bg-white/60 pl-8"
                  />
                </div>
                {search.trim().length >= 2 ? (
                  <div className="grid gap-0.5">
                    {results.filter((result) => !members.some((member) => member.id === result.id)).length ? (
                      results
                        .filter((result) => !members.some((member) => member.id === result.id))
                        .map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => {
                              setMembers([...members, result]);
                              setSearch("");
                              setResults([]);
                            }}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/70"
                          >
                            <Avatar className="size-7">
                              {result.image_url ? <AvatarImage src={result.image_url} alt="" /> : null}
                              <AvatarFallback className="text-xs">{nameOf(result).slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="grid leading-tight">
                              <span>{nameOf(result)}</span>
                              <span className="text-xs text-muted-foreground">{result.email}</span>
                            </span>
                          </button>
                        ))
                    ) : (
                      <p className="px-2 py-1.5 text-sm text-muted-foreground">No active member matches.</p>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-3">
            <span className="text-xs font-medium text-muted-foreground">When</span>
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/5 p-1">
                {(["now", "later"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setWhen(value)}
                    aria-pressed={when === value}
                    className={cn(
                      "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-sm transition-colors",
                      when === value ? "bg-white shadow-sm" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {value === "now" ? <Send className="size-3.5" /> : <CalendarClock className="size-3.5" />}
                    {value === "now" ? "Send now" : "Schedule"}
                  </button>
                ))}
              </div>
              {when === "later" ? (
                <input
                  type="datetime-local"
                  value={sendAt}
                  onChange={(event) => {
                    setSendAt(event.target.value);
                    setPastTime(!!event.target.value && isPast(event.target.value));
                  }}
                  className="h-9 rounded-lg border border-input bg-white/60 px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              ) : null}
            </div>
            {when === "later" ? (
              <p className={cn("text-[11px]", scheduleProblem && sendAt ? "text-destructive" : "text-muted-foreground")}>
                {scheduleProblem && sendAt
                  ? scheduleProblem
                  : `Time in ${ADMIN_TIME_ZONE}. It goes out within 30 minutes of this time, and the audience is worked out then.`}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="grid content-start gap-4">
          {/* Lock-screen preview */}
          <div className="grid gap-2 rounded-3xl bg-gradient-to-br from-[#904EB4]/80 via-[#c76b6b]/70 to-[#FC7B00]/70 p-4">
            <span className="text-center text-[11px] font-medium text-white/85">Lock screen</span>
            <div className="grid gap-0.5 rounded-2xl bg-white/75 p-3 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/solu-mark.svg" alt="" className="size-4 rounded bg-white p-0.5" />
                <span className="font-medium tracking-wide">SOLU</span>
                <span className="ml-auto">now</span>
              </div>
              <p className="truncate text-sm font-semibold text-neutral-900">{title || "Your title"}</p>
              <p className="line-clamp-3 text-[13px] leading-snug text-neutral-800">{body || "Your message shows here."}</p>
            </div>
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/75 p-2.5 backdrop-blur-xl">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#904EB4]/15 text-[#904EB4]">
                <Megaphone className="size-4" />
              </span>
              <span className="grid min-w-0 leading-tight">
                <span className="text-[10px] font-medium text-[#904EB4]">News from Solu · in the app</span>
                <span className="truncate text-xs font-medium text-neutral-900">{title || "Your title"}</span>
              </span>
            </div>
          </div>

          <div className="glass grid gap-1 rounded-xl p-3.5">
            <span className="text-xs text-muted-foreground">Audience</span>
            {count ? (
              <>
                <span className="text-2xl font-semibold tabular-nums">
                  {count.members.toLocaleString("en-GB")}
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                    member{count.members === 1 ? "" : "s"}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Smartphone className="size-3.5" />
                  {count.reachable.toLocaleString("en-GB")} can get a push (device registered, push on)
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Counting…</span>
            )}
            {nobody ? <span className="text-xs text-destructive">No active member matches this audience.</span> : null}
            {when === "later" && count?.members === 0 ? (
              <span className="text-xs text-amber-700">No one matches today; it is worked out again when it goes out.</span>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Button
              disabled={!canSend}
              onClick={() => {
                if (when === "later" && isPast(sendAt)) {
                  setPastTime(true);
                  return;
                }
                setConfirming(true);
              }}
              className="h-10"
            >
              {when === "now" ? <Send /> : <CalendarClock />}
              {when === "now"
                ? `Send to ${count?.members ?? "…"} member${count?.members === 1 ? "" : "s"}`
                : "Schedule"}
            </Button>
            <Button variant="outline" disabled={!messageOk || pending} onClick={test}>
              <Smartphone /> Send a test to me
            </Button>
          </div>
        </aside>
      </CardContent>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {when === "now" ? `Send to ${count?.members ?? 0} members now?` : "Schedule this notification?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{title}&rdquo;
              {when === "later" && scheduledFor
                ? ` goes out around ${formatDate(scheduledFor.toISOString(), true)} (${ADMIN_TIME_ZONE}). You can cancel it until then.`
                : ". A notification can't be taken back once it's sent."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <Button disabled={pending} onClick={send}>
              {when === "now" ? "Send now" : "Schedule"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
