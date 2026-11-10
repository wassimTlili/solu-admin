"use client";

import { useState } from "react";
import { Brain, Droplet, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PhaseDot } from "@/components/data/bits";
import { DeleteButton, Field, Select, useSave } from "@/components/content/form";
import {
  CARD_POSITIONS,
  CONTENT_TYPES,
  expectsHydration,
  PHASES,
  POSITION_LABELS,
  TIMES,
  TONES,
  type Phase,
  type Position,
} from "@/components/content/options";
import type { AdminCardsQuery, CyclePhase, PhasePosition, TimeOfDay } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";
import { deleteCard, saveCard } from "../actions";

type SmartCard = AdminCardsQuery["adminSmartCards"]["nodes"][number];

const TIME_CODES: Record<string, string> = { MORNING: "MOR", AFTERNOON: "AFT", EVENING: "EVE" };

/**
 * The slot part of the team's id pattern, [B-]{phase}[-{position}]-{time}-NN (M-E-MOR-06,
 * B-O-AFT-05). The API adds the number when the card is added, so nobody types an id.
 */
const slotPrefix = (set: string, phase: Phase, position: Position, time: string) =>
  `${set === "B" ? "B-" : ""}${phase[0]}${position === "UNIQUE" ? "" : `-${position[0]}`}-${TIME_CODES[time]}`;

const timeLabel = (time: string) => TIMES.find((item) => item.value === time)?.label ?? time;

export function CardTable({ cards }: { cards: SmartCard[] }) {
  const [editing, setEditing] = useState<SmartCard | "new" | null>(null);

  return (
    <>
      <Card className="py-0">
        <CardContent className="px-0">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-2.5">
            <span className="text-sm text-muted-foreground">Select a card to edit it.</span>
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus /> New card
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Card</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[44%]">Headline</TableHead>
                <TableHead className="pr-4">Extra lines</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.length ? (
                cards.map((card) => (
                  <TableRow key={card.id} className="relative cursor-pointer">
                    <TableCell className="pl-4">
                      <button
                        type="button"
                        onClick={() => setEditing(card)}
                        className="font-mono text-xs font-medium after:absolute after:inset-0"
                      >
                        {card.id}
                      </button>
                      <Badge variant="outline" className="ml-2 border-transparent bg-black/5 text-[10px]">
                        {card.set}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PhaseDot phase={card.phase} />
                      <span className="ml-1 text-xs text-muted-foreground">
                        {POSITION_LABELS[card.phase_position as Position]}
                      </span>
                    </TableCell>
                    <TableCell>{timeLabel(card.time_of_day)}</TableCell>
                    <TableCell className="capitalize">{card.content_type}</TableCell>
                    <TableCell className="max-w-0 truncate">{card.headline}</TableCell>
                    <TableCell className="pr-4">
                      <span className="flex gap-2 text-muted-foreground">
                        {card.mind ? <Brain className="size-4" aria-label="Brain line" /> : null}
                        {card.hydration_tip ? <Droplet className="size-4" aria-label="Water line" /> : null}
                        {!card.mind && !card.hydration_tip ? "—" : null}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No cards match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={editing !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-xl">
          {editing ? (
            <CardForm
              key={editing === "new" ? "new" : editing.id}
              card={editing === "new" ? null : editing}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CardForm({ card, onDone }: { card: SmartCard | null; onDone: () => void }) {
  const { pending, run } = useSave();
  const [set, setSet] = useState(card?.set ?? "A");
  const [phase, setPhase] = useState<Phase>((card?.phase as Phase) ?? "MENSTRUAL");
  const [position, setPosition] = useState<Position>((card?.phase_position as Position) ?? "EARLY");
  const [time, setTime] = useState<string>(card?.time_of_day ?? "MORNING");
  const [contentType, setContentType] = useState(card?.content_type ?? "mindset");
  const [tone, setTone] = useState(card?.tone ?? "");
  const [headline, setHeadline] = useState(card?.headline ?? "");
  const [explanation, setExplanation] = useState(card?.explanation ?? "");
  const [mind, setMind] = useState(card?.mind ?? "");
  const [hydration, setHydration] = useState(card?.hydration_tip ?? "");
  const [source, setSource] = useState(card?.source ?? "");
  const [sourceDetail, setSourceDetail] = useState(card?.source_detail ?? "");

  const isNew = !card;
  const positions = CARD_POSITIONS[phase];
  const morning = time === "MORNING";
  const hydrates = expectsHydration(phase, position);

  // A card's slot is chosen once, when it is added (its id names the slot).
  const choose = (next: { set?: string; phase?: Phase; position?: Position; time?: string }) => {
    const nextPhase = next.phase ?? phase;
    let nextPosition = next.position ?? position;
    if (!CARD_POSITIONS[nextPhase].includes(nextPosition)) nextPosition = CARD_POSITIONS[nextPhase][0];
    const nextSet = next.set ?? set;
    const nextTime = next.time ?? time;
    setSet(nextSet);
    setPhase(nextPhase);
    setPosition(nextPosition);
    setTime(nextTime);
  };

  const withCurrent = (list: string[], current: string) =>
    (current && !list.includes(current) ? [current, ...list] : list).map((value) => ({ value, label: value }));

  const valid = headline.trim().length >= 3 && explanation.trim().length >= 3;

  const submit = () =>
    run(
      () =>
        saveCard({
          // Left out when adding: the API gives the card the next free id in its slot.
          id: card?.id,
          set,
          phase: phase as CyclePhase,
          phase_position: position as PhasePosition,
          time_of_day: time as TimeOfDay,
          content_type: contentType,
          tone: tone || null,
          headline,
          explanation,
          mind: morning ? mind || null : null,
          hydration_tip: hydrates ? hydration || null : null,
          source: source || null,
          source_detail: sourceDetail || null,
        }),
      isNew ? (result) => (result.id ? `Card ${result.id} added` : "Card added") : "Card saved",
      onDone,
    );

  return (
    <>
      <SheetHeader className="border-b border-black/5">
        <SheetTitle>{isNew ? "New card" : card.id}</SheetTitle>
        <SheetDescription>
          {isNew
            ? "Add a smart card to the library. It joins the rotation for its slot straight away."
            : "Changes reach members the next time their Today loads."}
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Set">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-black/5 p-1">
              {["A", "B"].map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={!isNew}
                  onClick={() => choose({ set: value })}
                  className={cn(
                    "h-7 rounded-md text-sm transition-colors disabled:cursor-not-allowed",
                    set === value ? "bg-white shadow-sm" : "text-muted-foreground",
                  )}
                >
                  Set {value}
                </button>
              ))}
            </div>
          </Field>
          <Field
            label="Card id"
            hint={isNew ? "Numbered automatically when you add the card." : "Ids don't change."}
          >
            <span className="flex h-8 items-center rounded-lg border border-dashed border-black/10 bg-black/[0.03] px-2.5 font-mono text-sm">
              {isNew ? (
                <>
                  {slotPrefix(set, phase, position, time)}
                  <span className="text-muted-foreground">-··</span>
                </>
              ) : (
                card.id
              )}
            </span>
          </Field>
          <Field label="Phase">
            <Select
              value={phase}
              disabled={!isNew}
              onChange={(value) => choose({ phase: value as Phase })}
              options={PHASES}
            />
          </Field>
          <Field label="Position in phase">
            <Select
              value={position}
              disabled={!isNew}
              onChange={(value) => choose({ position: value as Position })}
              options={positions.map((value) => ({ value, label: POSITION_LABELS[value] }))}
            />
          </Field>
          <Field label="Time of day">
            <Select value={time} disabled={!isNew} onChange={(value) => choose({ time: value })} options={TIMES} />
          </Field>
          <Field label="Type">
            <Select value={contentType} onChange={setContentType} options={withCurrent(CONTENT_TYPES, contentType)} />
          </Field>
          <Field label="Tone" className="col-span-2">
            <Select
              value={tone}
              onChange={setTone}
              options={[{ value: "", label: "No tone" }, ...withCurrent(TONES, tone)]}
            />
          </Field>
        </div>
        {isNew ? null : (
          <p className="-mt-1 text-xs text-muted-foreground">
            The set, phase, position and time of day are fixed once a card exists. To use this text in another slot,
            add a new card there and delete this one.
          </p>
        )}

        <Field label="Headline" count={headline.length} max={200}>
          <Input value={headline} onChange={(event) => setHeadline(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label="Explanation" count={explanation.length} max={2000}>
          <Textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            rows={5}
            className="bg-white/60"
          />
        </Field>
        <Field
          label="Brain line (Mind)"
          count={mind.length}
          max={500}
          hint={morning ? "Shown on the morning hero only." : "Only morning cards have a brain line; this one hides it."}
        >
          <Textarea
            value={morning ? mind : ""}
            disabled={!morning}
            onChange={(event) => setMind(event.target.value)}
            rows={2}
            className="bg-white/60"
          />
        </Field>
        <Field
          label="Water line (hydration tip)"
          count={hydration.length}
          max={500}
          hint={
            hydrates
              ? "Shown with the drop icon."
              : "Only Menstrual, Ovulation and Late Luteal cards have a water line."
          }
        >
          <Textarea
            value={hydrates ? hydration : ""}
            disabled={!hydrates}
            onChange={(event) => setHydration(event.target.value)}
            rows={2}
            className="bg-white/60"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Source">
            <Input value={source} onChange={(event) => setSource(event.target.value)} className="bg-white/60" />
          </Field>
          <Field label="Source detail">
            <Input
              value={sourceDetail}
              onChange={(event) => setSourceDetail(event.target.value)}
              className="bg-white/60"
            />
          </Field>
        </div>
      </div>

      <SheetFooter className="flex-row justify-between border-t border-black/5">
        {isNew ? (
          <span />
        ) : (
          <DeleteButton
            title={`Delete ${card.id}?`}
            description="The card leaves the library for everyone. You can add it back by importing the spreadsheet again."
            disabled={pending}
            onConfirm={() => run(() => deleteCard(card.id), "Card deleted", onDone)}
          />
        )}
        <Button disabled={pending || !valid} onClick={submit}>
          {isNew ? "Add card" : "Save changes"}
        </Button>
      </SheetFooter>
    </>
  );
}
