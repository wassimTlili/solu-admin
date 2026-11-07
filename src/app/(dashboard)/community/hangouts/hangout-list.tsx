"use client";

import { useState, useTransition } from "react";
import { CalendarDays, Globe, MapPin, Plus, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ADMIN_TIME_ZONE,
  formatDate,
  PHASE_COLORS,
  StatusBadge,
  teamTimeToDate,
  toTeamTimeInput,
} from "@/components/data/bits";
import { Chips, Field } from "@/components/content/form";
import { PHASES } from "@/components/content/options";
import { ReasonDialog } from "@/components/community/reason-dialog";
import type { AdminHangoutsQuery, CyclePhase } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";
import { cancelEvent, saveEvent } from "../actions";

type Hangout = AdminHangoutsQuery["adminEvents"]["nodes"][number];
type Interest = AdminHangoutsQuery["adminInterests"][number];

const DATE_INPUT =
  "h-8 w-full rounded-lg border border-input bg-white/60 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function HangoutList({ hangouts, interests, past }: { hangouts: Hangout[]; interests: Interest[]; past: boolean }) {
  const [editing, setEditing] = useState<Hangout | "new" | null>(null);

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <Plus /> New hangout
        </Button>
      </div>

      {hangouts.length ? (
        <div className="grid gap-3">
          {hangouts.map((hangout) => {
            const full = hangout.capacity ? Math.min(1, hangout.going / hangout.capacity) : null;
            return (
              <button
                key={hangout.id}
                type="button"
                onClick={() => setEditing(hangout)}
                className={cn(
                  "glass grid gap-4 overflow-hidden rounded-2xl text-left transition-shadow hover:shadow-lg sm:grid-cols-[180px_minmax(0,1fr)_200px]",
                  hangout.status === "CANCELED" && "opacity-60",
                )}
              >
                <div className="h-32 bg-gradient-to-br from-[#904EB4]/25 to-[#FC7B00]/25 sm:h-full">
                  {hangout.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hangout.cover_image_url} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="grid content-center gap-1.5 px-4 sm:px-0 sm:py-4">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{hangout.title}</span>
                    {hangout.status === "CANCELED" ? <StatusBadge status="CANCELED" /> : null}
                  </span>
                  <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> {formatDate(hangout.start_time, true)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {hangout.is_online ? <Globe className="size-3.5" /> : <MapPin className="size-3.5" />}
                      {hangout.is_online ? "Online" : (hangout.city ?? hangout.location_address ?? "No place yet")}
                    </span>
                  </span>
                  {hangout.recommended_phases.length ? (
                    <span className="flex gap-1.5">
                      {hangout.recommended_phases.map((phase) => (
                        <span key={phase} className="size-2.5 rounded-full" style={{ background: PHASE_COLORS[phase] }} title={phase.toLowerCase()} />
                      ))}
                    </span>
                  ) : null}
                </div>
                <div className="grid content-center gap-1.5 px-4 pb-4 sm:py-4 sm:pr-4 sm:pl-0">
                  <span className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-4 text-muted-foreground" />
                      <span className="font-semibold tabular-nums">{hangout.going}</span>
                      <span className="text-muted-foreground">{hangout.capacity ? `of ${hangout.capacity}` : "going"}</span>
                    </span>
                    {hangout.cancelled ? <span className="text-xs text-muted-foreground">{hangout.cancelled} cancelled</span> : null}
                  </span>
                  {full !== null ? (
                    <span className="h-1.5 overflow-hidden rounded-full bg-black/8">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${full * 100}%` }} />
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-2xl py-14 text-center text-sm text-muted-foreground">
          {past ? "No past hangouts." : "No upcoming hangouts. Create one to get members together."}
        </div>
      )}

      <Sheet open={editing !== null} onOpenChange={(next) => (next ? null : setEditing(null))}>
        <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-2xl">
          {editing ? (
            <HangoutForm
              key={editing === "new" ? "new" : editing.id}
              hangout={editing === "new" ? null : editing}
              interests={interests}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function HangoutForm({ hangout, interests, onDone }: { hangout: Hangout | null; interests: Interest[]; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [cancelling, setCancelling] = useState(false);
  const [notify, setNotify] = useState(true);
  const [title, setTitle] = useState(hangout?.title ?? "");
  const [description, setDescription] = useState(hangout?.description ?? "");
  const [cover, setCover] = useState(hangout?.cover_image_url ?? "");
  const [online, setOnline] = useState(hangout?.is_online ?? false);
  const [city, setCity] = useState(hangout?.city ?? "");
  const [address, setAddress] = useState(hangout?.location_address ?? "");
  const [venue, setVenue] = useState(hangout?.venue_details ?? "");
  const [meetingUrl, setMeetingUrl] = useState(hangout?.meeting_url ?? "");
  const [start, setStart] = useState(toTeamTimeInput(hangout?.start_time));
  const [end, setEnd] = useState(toTeamTimeInput(hangout?.end_time));
  const [doors, setDoors] = useState(toTeamTimeInput(hangout?.doors_open_at));
  const [capacity, setCapacity] = useState(hangout?.capacity ? String(hangout.capacity) : "");
  const [fee, setFee] = useState(hangout?.fee_amount ? String(hangout.fee_amount) : "");
  const [hostName, setHostName] = useState(hangout?.host_name ?? "");
  const [hostDescription, setHostDescription] = useState(hangout?.host_description ?? "");
  const [hostImage, setHostImage] = useState(hangout?.host_image_url ?? "");
  const [phases, setPhases] = useState<string[]>(hangout?.recommended_phases ?? []);
  const [phaseTip, setPhaseTip] = useState(hangout?.phase_tip ?? "");
  const [topics, setTopics] = useState<string[]>(hangout?.topics ?? []);

  const isNew = !hangout;
  const cancelled = hangout?.status === "CANCELED";
  const urlOk = (value: string) => !value || /^https?:\/\/\S+$/.test(value);
  const valid =
    title.trim().length >= 3 &&
    !!start &&
    !!end &&
    teamTimeToDate(end).getTime() > teamTimeToDate(start).getTime() &&
    (online ? true : !!(city.trim() || address.trim())) &&
    urlOk(cover) &&
    urlOk(meetingUrl) &&
    urlOk(hostImage) &&
    (!capacity || Number(capacity) > 0);

  const save = () =>
    startTransition(async () => {
      const result = await saveEvent(hangout?.id ?? null, {
        title: title.trim(),
        description: description.trim() || null,
        cover_image_url: cover || null,
        is_online: online,
        city: online ? null : city.trim() || null,
        location_address: online ? null : address.trim() || null,
        location_place_id: null,
        venue_details: online ? null : venue.trim() || null,
        meeting_url: online ? meetingUrl || null : null,
        start_time: teamTimeToDate(start).toISOString(),
        end_time: teamTimeToDate(end).toISOString(),
        doors_open_at: doors ? teamTimeToDate(doors).toISOString() : null,
        capacity: capacity ? Number(capacity) : null,
        fee_amount: fee ? Number(fee) : null,
        host_name: hostName.trim() || null,
        host_description: hostDescription.trim() || null,
        host_image_url: hostImage || null,
        recommended_phases: phases as CyclePhase[],
        phase_tip: phaseTip.trim() || null,
        topics,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isNew ? "Hangout created. Matching members are told about it." : "Hangout saved");
      onDone();
    });

  return (
    <>
      <SheetHeader className="border-b border-black/5">
        <SheetTitle>{isNew ? "New hangout" : hangout.title}</SheetTitle>
        <SheetDescription>
          {isNew
            ? "Members whose interests match its topics hear about it (without topics: members in its city, or everyone for an online one)."
            : `${hangout.going} going${hangout.capacity ? ` of ${hangout.capacity}` : ""}. Times are in ${ADMIN_TIME_ZONE}.`}
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 overflow-y-auto p-4">
        {cancelled ? (
          <p className="rounded-xl bg-neutral-500/10 px-3 py-2 text-sm text-muted-foreground">This hangout is cancelled.</p>
        ) : null}
        <Field label="Title" count={title.length} max={120}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label="Description">
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="bg-white/60" />
        </Field>
        <Field label="Cover image link" hint={urlOk(cover) ? undefined : "Start the link with https://"}>
          <Input value={cover} onChange={(event) => setCover(event.target.value.trim())} placeholder="https://" className="bg-white/60" />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={`Starts (${ADMIN_TIME_ZONE})`}>
            <input type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} className={DATE_INPUT} />
          </Field>
          <Field label="Ends" hint={start && end && teamTimeToDate(end) <= teamTimeToDate(start) ? "After the start" : undefined}>
            <input type="datetime-local" value={end} onChange={(event) => setEnd(event.target.value)} className={DATE_INPUT} />
          </Field>
          <Field label="Doors open (optional)">
            <input type="datetime-local" value={doors} onChange={(event) => setDoors(event.target.value)} className={DATE_INPUT} />
          </Field>
        </div>

        <label className="glass flex items-center justify-between gap-3 rounded-xl p-3">
          <span className="grid">
            <span className="text-sm font-medium">Online hangout</span>
            <span className="text-xs text-muted-foreground">Members join with a link instead of a place.</span>
          </span>
          <Switch checked={online} onCheckedChange={(checked) => setOnline(checked)} />
        </label>
        {online ? (
          <Field label="Meeting link" hint={urlOk(meetingUrl) ? undefined : "Start the link with https://"}>
            <Input value={meetingUrl} onChange={(event) => setMeetingUrl(event.target.value.trim())} placeholder="https://" className="bg-white/60" />
          </Field>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="City">
              <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Dubai" className="bg-white/60" />
            </Field>
            <Field label="Address">
              <Input value={address} onChange={(event) => setAddress(event.target.value)} className="bg-white/60" />
            </Field>
            <Field label="Venue details" className="sm:col-span-2" hint="Floor, entrance, what to bring">
              <Input value={venue} onChange={(event) => setVenue(event.target.value)} className="bg-white/60" />
            </Field>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Capacity" hint="Empty = no limit">
            <Input type="number" min={1} value={capacity} onChange={(event) => setCapacity(event.target.value)} className="bg-white/60" />
          </Field>
          <Field label="Fee (AED)" hint="Empty = free">
            <Input type="number" min={0} step="0.01" value={fee} onChange={(event) => setFee(event.target.value)} className="bg-white/60" />
          </Field>
        </div>

        <Field label="Best for these phases">
          <Chips options={PHASES.map((phase) => ({ ...phase, color: PHASE_COLORS[phase.value] }))} value={phases} onChange={setPhases} />
        </Field>
        <Field label="Phase tip" hint="Why it suits those phases (shown on the hangout)">
          <Input value={phaseTip} onChange={(event) => setPhaseTip(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label="Topics" hint="Members who chose these interests in onboarding hear about it when it's created.">
          <Chips options={interests.map((interest) => ({ value: interest.id, label: interest.name }))} value={topics} onChange={setTopics} />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Host name">
            <Input value={hostName} onChange={(event) => setHostName(event.target.value)} className="bg-white/60" />
          </Field>
          <Field label="Host photo link" hint={urlOk(hostImage) ? undefined : "Start the link with https://"}>
            <Input value={hostImage} onChange={(event) => setHostImage(event.target.value.trim())} className="bg-white/60" />
          </Field>
          <Field label="About the host" className="sm:col-span-2">
            <Textarea value={hostDescription} onChange={(event) => setHostDescription(event.target.value)} rows={2} className="bg-white/60" />
          </Field>
        </div>
      </div>

      <SheetFooter className="flex-row justify-between border-t border-black/5">
        {!isNew && !cancelled ? (
          <Button variant="ghost" className="text-destructive" disabled={pending} onClick={() => setCancelling(true)}>
            <XCircle /> Cancel hangout
          </Button>
        ) : (
          <span />
        )}
        <Button disabled={pending || !valid || cancelled} onClick={save}>
          {isNew ? "Create hangout" : "Save changes"}
        </Button>
      </SheetFooter>

      {hangout ? (
        <ReasonDialog
          open={cancelling}
          onOpenChange={setCancelling}
          title={`Cancel ${hangout.title}?`}
          description="It stays in members' history as cancelled and can't be booked."
          confirmLabel="Cancel hangout"
          destructive
          pending={pending}
          extra={
            <label className="flex items-center justify-between gap-3 rounded-lg bg-black/4 p-2.5 text-sm">
              Tell the {hangout.going} member{hangout.going === 1 ? "" : "s"} who booked
              <Switch checked={notify} onCheckedChange={(checked) => setNotify(checked)} />
            </label>
          }
          onConfirm={(reason) =>
            startTransition(async () => {
              const result = await cancelEvent(hangout.id, reason, notify);
              if (result.error) toast.error(result.error);
              else {
                toast.success("Hangout cancelled");
                setCancelling(false);
                onDone();
              }
            })
          }
        />
      ) : null}
    </>
  );
}
