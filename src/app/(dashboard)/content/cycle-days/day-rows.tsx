"use client";

import { useState } from "react";
import { Plus, Sparkle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DeleteButton, Field, useSave } from "@/components/content/form";
import { DAY_POSITIONS, phaseLabel, POSITION_LABELS, type Phase, type Position } from "@/components/content/options";
import type { AdminDayRowsQuery, CyclePhase, PhasePosition } from "@/lib/gql/graphql";
import { deleteDayRow, saveDayRow } from "../actions";

type DayRow = AdminDayRowsQuery["adminCycleDayRows"][number];
type Editing = { row: DayRow | null; position: Position; variation: number };

const MAX_VARIATIONS = 20;

export function DayRows({ phase, rows }: { phase: Phase; rows: DayRow[] }) {
  const [editing, setEditing] = useState<Editing | null>(null);

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        {DAY_POSITIONS[phase].map((position) => {
          const list = rows
            .filter((row) => row.phase_position === position)
            .sort((a, b) => a.variation - b.variation);
          const next = (list.at(-1)?.variation ?? 0) + 1;
          return (
            <Card key={position} className="content-start gap-3">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {POSITION_LABELS[position]} {phaseLabel(phase)}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">{list.length} variations</span>
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={next > MAX_VARIATIONS}
                  onClick={() => setEditing({ row: null, position, variation: next })}
                >
                  <Plus /> Add
                </Button>
              </CardHeader>
              <CardContent className="grid gap-2">
                {list.length ? (
                  list.map((row) => (
                    <button
                      key={row.row_id}
                      type="button"
                      onClick={() => setEditing({ row, position, variation: row.variation })}
                      className="grid gap-1.5 rounded-xl border border-white/70 bg-white/45 p-3 text-left transition-colors hover:bg-white/75"
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">{row.row_id}</span>
                      <span className="flex gap-2 text-sm">
                        <Sparkle className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span className="line-clamp-2">{row.body_text}</span>
                      </span>
                      <span className="flex gap-2 text-sm text-muted-foreground">
                        <Zap className="mt-0.5 size-3.5 shrink-0 text-[#F5921E]" />
                        <span className="line-clamp-2">{row.energy_text}</span>
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No lines for these days yet.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <DialogContent className="sm:max-w-lg">
          {editing ? (
            <RowForm
              key={editing.row?.row_id ?? `new-${editing.position}`}
              phase={phase}
              editing={editing}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function RowForm({ phase, editing, onDone }: { phase: Phase; editing: Editing; onDone: () => void }) {
  const { pending, run } = useSave();
  const [body, setBody] = useState(editing.row?.body_text ?? "");
  const [energy, setEnergy] = useState(editing.row?.energy_text ?? "");
  const valid = body.trim().length >= 10 && energy.trim().length >= 10 && body.length <= 1000 && energy.length <= 1000;
  const days = `${POSITION_LABELS[editing.position]} ${phaseLabel(phase)}`;
  const label = editing.row
    ? `${days}, variation ${editing.variation}`
    : `${days}: added as the next variation, numbered automatically.`;

  return (
    <>
      <DialogHeader>
        <DialogTitle>{editing.row ? editing.row.row_id : "New variation"}</DialogTitle>
        <DialogDescription>{label}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <Field label="Your body" count={body.length} max={1000} hint="Row 1 of the hero: what's happening in the body.">
          <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} className="bg-white/60" />
        </Field>
        <Field label="Your energy" count={energy.length} max={1000} hint="Row 2: what it means for energy today.">
          <Textarea value={energy} onChange={(event) => setEnergy(event.target.value)} rows={4} className="bg-white/60" />
        </Field>
      </div>
      <DialogFooter className="flex-row justify-between sm:justify-between">
        {editing.row ? (
          <DeleteButton
            title={`Delete ${editing.row.row_id}?`}
            description="Members on these days rotate through the remaining variations."
            disabled={pending}
            onConfirm={() => run(() => deleteDayRow(editing.row!.row_id), "Line deleted", onDone)}
          />
        ) : (
          <span />
        )}
        <Button
          disabled={pending || !valid}
          onClick={() =>
            run(
              () =>
                saveDayRow({
                  phase: phase as CyclePhase,
                  phase_position: editing.position as PhasePosition,
                  // Left out when adding: the API picks the next variation, so nothing is overwritten.
                  variation: editing.row ? editing.row.variation : undefined,
                  body_text: body,
                  energy_text: energy,
                }),
              editing.row ? "Line saved" : (result) => (result.id ? `Line ${result.id} added` : "Variation added"),
              onDone,
            )
          }
        >
          {editing.row ? "Save changes" : "Add variation"}
        </Button>
      </DialogFooter>
    </>
  );
}
