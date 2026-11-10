"use client";

import { useState } from "react";
import { ExternalLink, Lightbulb, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DeleteButton, Field, Select, useSave } from "@/components/content/form";
import { DYK_CATEGORIES, dykPrefix } from "@/components/content/options";
import type { AdminFactsQuery } from "@/lib/gql/graphql";
import { deleteFact, saveFact } from "../actions";

type Fact = AdminFactsQuery["adminDidYouKnow"]["nodes"][number];

export function FactTable({ facts }: { facts: Fact[] }) {
  const [editing, setEditing] = useState<Fact | "new" | null>(null);

  return (
    <>
      <Card className="py-0">
        <CardContent className="px-0">
          <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-2.5">
            <span className="text-sm text-muted-foreground">Select a fact to edit it.</span>
            <Button size="sm" onClick={() => setEditing("new")}>
              <Plus /> New fact
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14 pl-4">#</TableHead>
                <TableHead>Id</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[55%]">Fact</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facts.length ? (
                facts.map((fact) => (
                  <TableRow key={fact.id} className="relative cursor-pointer">
                    <TableCell className="pl-4 tabular-nums text-muted-foreground">
                      {fact.position || "—"}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setEditing(fact)}
                        className="font-mono text-xs font-medium after:absolute after:inset-0"
                      >
                        {fact.external_id ?? "No id"}
                      </button>
                    </TableCell>
                    <TableCell>{fact.category ?? "—"}</TableCell>
                    <TableCell className="max-w-0 truncate">{fact.title}</TableCell>
                    <TableCell className="pr-4">
                      {fact.is_active ? (
                        <span className="text-emerald-700">In rotation</span>
                      ) : (
                        <span className="text-muted-foreground">Retired</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No facts match these filters.
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
            <FactForm
              key={editing === "new" ? "new" : editing.id}
              fact={editing === "new" ? null : editing}
              onDone={() => setEditing(null)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function FactForm({ fact, onDone }: { fact: Fact | null; onDone: () => void }) {
  const { pending, run } = useSave();
  const [category, setCategory] = useState(fact?.category ?? DYK_CATEGORIES[0]);
  const [title, setTitle] = useState(fact?.title ?? "");
  const [fullText, setFullText] = useState(fact?.full_text ?? "");
  const [sourceUrl, setSourceUrl] = useState(fact?.source_url ?? "");
  const [active, setActive] = useState(fact?.is_active ?? true);

  const categories = (category && !DYK_CATEGORIES.includes(category) ? [category, ...DYK_CATEGORIES] : DYK_CATEGORIES).map(
    (value) => ({ value, label: value }),
  );
  const urlOk = !sourceUrl || /^https?:\/\/\S+$/.test(sourceUrl);
  const valid = title.trim().length >= 5 && fullText.trim().length >= 10 && urlOk;

  return (
    <>
      <SheetHeader className="border-b border-black/5">
        <SheetTitle>{fact ? (fact.external_id ?? "Did You Know") : "New fact"}</SheetTitle>
        <SheetDescription>
          {fact?.position ? `Number ${fact.position} in the rotation.` : "New facts join the end of the rotation."}
        </SheetDescription>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 overflow-y-auto p-4">
        {/* How the card reads in the app: the title on the card, the full text when opened. */}
        <div className="glass grid gap-1.5 rounded-xl p-3.5">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
            <Lightbulb className="size-3.5" /> Did you know?
          </span>
          <p className="text-sm font-medium">{title || "The title shows on Today"}</p>
          <p className="line-clamp-3 text-xs text-muted-foreground">{fullText || "The full text shows when the card is opened."}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Id"
            hint={
              fact?.external_id
                ? "Ids don't change, even if the category does."
                : "Numbered automatically from the category when you save."
            }
          >
            <span className="flex h-8 items-center rounded-lg border border-dashed border-black/10 bg-black/[0.03] px-2.5 font-mono text-sm">
              {fact?.external_id ?? (
                <>
                  {dykPrefix(category)}
                  <span className="text-muted-foreground">-··</span>
                </>
              )}
            </span>
          </Field>
          <Field label="Category">
            <Select value={category} onChange={setCategory} options={categories} />
          </Field>
        </div>
        <Field label="Title" count={title.length} max={200}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} className="bg-white/60" />
        </Field>
        <Field label="Full text" count={fullText.length} max={2000}>
          <Textarea value={fullText} onChange={(event) => setFullText(event.target.value)} rows={7} className="bg-white/60" />
        </Field>
        <Field label="Source link" hint={urlOk ? undefined : "Start the link with https://"}>
          <span className="flex gap-2">
            <Input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value.trim())}
              placeholder="https://"
              className="bg-white/60"
            />
            {sourceUrl && urlOk ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="glass inline-flex size-9 shrink-0 items-center justify-center rounded-lg"
                aria-label="Open source"
              >
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </span>
        </Field>
        <label className="glass flex items-center justify-between gap-3 rounded-xl p-3">
          <span className="grid">
            <span className="text-sm font-medium">In rotation</span>
            <span className="text-xs text-muted-foreground">Retired facts are kept but no longer shown.</span>
          </span>
          <Switch checked={active} onCheckedChange={(checked) => setActive(checked)} />
        </label>
      </div>

      <SheetFooter className="flex-row justify-between border-t border-black/5">
        {fact ? (
          <DeleteButton
            title="Delete this fact?"
            description="It leaves the library for good. To take it out of the rotation but keep it, switch off In rotation instead."
            disabled={pending}
            onConfirm={() => run(() => deleteFact(fact.id), "Fact deleted", onDone)}
          />
        ) : (
          <span />
        )}
        <Button
          disabled={pending || !valid}
          onClick={() =>
            run(
              () =>
                saveFact({
                  // No id: the API numbers a new fact (DYK-{category}-NN) and never renames one.
                  id: fact?.id,
                  category,
                  title,
                  full_text: fullText,
                  source_url: sourceUrl || null,
                  is_active: active,
                }),
              fact ? "Fact saved" : (result) => (result.id ? `Fact ${result.id} added` : "Fact added"),
              onDone,
            )
          }
        >
          {fact ? "Save changes" : "Add fact"}
        </Button>
      </SheetFooter>
    </>
  );
}
