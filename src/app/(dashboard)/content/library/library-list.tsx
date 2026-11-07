"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Heart, Lightbulb, Moon, Plus, Sparkles, X, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { PhaseDot, timeAgo } from "@/components/data/bits";
import { DeleteButton, Field, Select, useSave } from "@/components/content/form";
import { DETAIL_ICONS, PHASES } from "@/components/content/options";
import type { AdminLibraryQuery, ContentKind, CyclePhase } from "@/lib/gql/graphql";
import { deleteLibraryItem, saveLibraryItem } from "../actions";

type Item = AdminLibraryQuery["adminLibraryItems"]["nodes"][number];
type Detail = { icon: string; title: string; body: string };

const ICONS: Record<string, LucideIcon> = { moon: Moon, bolt: Zap, heart: Heart, bulb: Lightbulb, sparkles: Sparkles };
const MAX_DETAILS = 6;

export function LibraryList({ kind, items }: { kind: string; items: Item[] }) {
  const [editing, setEditing] = useState<Item | "new" | null>(null);
  const insight = kind === "INSIGHT";

  return (
    <>
      <Card className="py-0">
        <CardContent className="px-0">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-2.5">
            <span className="text-sm text-muted-foreground">Select an item to edit it.</span>
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus /> {insight ? "New insight" : "New prompt"}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Phase</TableHead>
                <TableHead className="w-[60%]">{insight ? "Insight" : "Prompt"}</TableHead>
                {insight ? <TableHead>Points</TableHead> : null}
                <TableHead>Status</TableHead>
                <TableHead className="pr-4">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length ? (
                items.map((item) => (
                  <TableRow key={item.id} className="relative cursor-pointer">
                    <TableCell className="pl-4">
                      {item.phase ? <PhaseDot phase={item.phase} /> : <span className="text-muted-foreground">Any phase</span>}
                    </TableCell>
                    <TableCell className="max-w-0">
                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        className="grid w-full text-left after:absolute after:inset-0"
                      >
                        <span className="truncate font-medium">{insight ? item.title : item.body}</span>
                        <span className="truncate text-xs text-muted-foreground">{insight ? item.body : item.title}</span>
                      </button>
                    </TableCell>
                    {insight ? <TableCell className="tabular-nums">{item.details.length}</TableCell> : null}
                    <TableCell>
                      {item.is_active ? (
                        <span className="text-emerald-700">Live</span>
                      ) : (
                        <span className="text-muted-foreground">Paused</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{timeAgo(item.updated_at)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={insight ? 5 : 4} className="py-10 text-center text-muted-foreground">
                    Nothing matches these filters.
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
            <ItemForm
              key={editing === "new" ? "new" : editing.id}
              kind={kind}
              item={editing === "new" ? null : editing}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function ItemForm({ kind, item, onDone }: { kind: string; item: Item | null; onDone: () => void }) {
  const { pending, run } = useSave();
  const insight = kind === "INSIGHT";
  const [phase, setPhase] = useState(item?.phase ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [body, setBody] = useState(item?.body ?? "");
  const [active, setActive] = useState(item?.is_active ?? true);
  const [details, setDetails] = useState<Detail[]>(
    (item?.details ?? []).map((detail) => ({ icon: detail.icon, title: detail.title ?? "", body: detail.body })),
  );

  const update = (index: number, patch: Partial<Detail>) =>
    setDetails((list) => list.map((detail, at) => (at === index ? { ...detail, ...patch } : detail)));
  const move = (index: number, by: number) =>
    setDetails((list) => {
      const next = [...list];
      const [moved] = next.splice(index, 1);
      next.splice(index + by, 0, moved);
      return next;
    });

  const valid =
    title.trim().length >= 3 &&
    body.trim().length >= 3 &&
    details.every((detail) => detail.body.trim().length >= 3 && detail.body.length <= 600);

  return (
    <>
      <SheetHeader className="border-b border-black/5">
        <SheetTitle>{item ? (insight ? "Edit insight" : "Edit prompt") : insight ? "New insight" : "New prompt"}</SheetTitle>
        <SheetDescription>
          Placeholders: <code>{"{phase}"}</code>, <code>{"{day}"}</code> (cycle day) and{" "}
          <code>{"{groupPhaseCount}"}</code> (women in her groups in this phase). A point that needs a value she
          doesn&apos;t have is hidden.
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 overflow-y-auto p-4">
        <Field label="Phase">
          <Select value={phase} onChange={setPhase} options={[{ value: "", label: "Any phase (fallback)" }, ...PHASES]} />
        </Field>
        <Field label={insight ? "Title" : "Theme (shown above the prompt)"} count={title.length} max={200}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label={insight ? "Text" : "Prompt"} count={body.length} max={2000}>
          <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={insight ? 3 : 4} className="bg-white/60" />
        </Field>

        {insight ? (
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Explained points ({details.length}/{MAX_DETAILS})
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={details.length >= MAX_DETAILS}
                onClick={() => setDetails((list) => [...list, { icon: "bulb", title: "", body: "" }])}
              >
                <Plus /> Add point
              </Button>
            </div>
            {details.map((detail, index) => {
              const Icon = ICONS[detail.icon] ?? Lightbulb;
              return (
                <div key={index} className="glass grid gap-2 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <Select
                      value={detail.icon}
                      onChange={(icon) => update(index, { icon })}
                      options={DETAIL_ICONS}
                      className="w-32"
                    />
                    <span className="ml-auto flex">
                      <Button size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                        <ArrowUp />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        disabled={index === details.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label="Move down"
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setDetails((list) => list.filter((_, at) => at !== index))}
                        aria-label="Remove point"
                      >
                        <X />
                      </Button>
                    </span>
                  </div>
                  <Input
                    value={detail.title}
                    onChange={(event) => update(index, { title: event.target.value })}
                    placeholder="Bold first line (optional)"
                    className="bg-white/60"
                  />
                  <Textarea
                    value={detail.body}
                    onChange={(event) => update(index, { body: event.target.value })}
                    placeholder="The explanation"
                    rows={2}
                    className="bg-white/60"
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        <label className="glass flex items-center justify-between gap-3 rounded-xl p-3">
          <span className="grid">
            <span className="text-sm font-medium">Live</span>
            <span className="text-xs text-muted-foreground">Paused items are kept but not shown to members.</span>
          </span>
          <Switch checked={active} onCheckedChange={(checked) => setActive(checked)} />
        </label>
      </div>

      <SheetFooter className="flex-row justify-between border-t border-black/5">
        {item ? (
          <DeleteButton
            title="Delete this item?"
            description="It leaves the library for good. To keep it but stop showing it, switch off Live instead."
            disabled={pending}
            onConfirm={() => run(() => deleteLibraryItem(item.id), "Deleted", onDone)}
          />
        ) : (
          <span />
        )}
        <Button
          disabled={pending || !valid}
          onClick={() =>
            run(
              () =>
                saveLibraryItem({
                  id: item?.id,
                  kind: kind as ContentKind,
                  phase: (phase as CyclePhase) || null,
                  title,
                  body,
                  details: insight
                    ? details.map((detail) => ({ icon: detail.icon, title: detail.title || null, body: detail.body }))
                    : (item?.details ?? []).map((detail) => ({ icon: detail.icon, title: detail.title, body: detail.body })),
                  is_active: active,
                }),
              item ? "Saved" : "Added",
              onDone,
            )
          }
        >
          {item ? "Save changes" : "Add"}
        </Button>
      </SheetFooter>
    </>
  );
}
