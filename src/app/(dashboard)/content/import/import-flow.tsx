"use client";

import { useRef, useState, useTransition, type DragEvent } from "react";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, FileX2, Upload, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { importSpreadsheets, type ImportReport } from "../actions";

const KIND_LABELS: Record<string, string> = {
  setA: "Recommendations, Set A",
  setB: "Recommendations, Set B",
  didYouKnow: "Did You Know",
  cycleDays: "Cycle-day lines",
};

const formatBytes = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

function IdList({ ids }: { ids: string[] }) {
  const shown = ids.slice(0, 12);
  return (
    <span className="font-mono text-[11px]">
      {shown.join(", ")}
      {ids.length > shown.length ? ` and ${ids.length - shown.length} more` : ""}
    </span>
  );
}

export function ImportFlow() {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [pending, startTransition] = useTransition();

  const add = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const file of Array.from(list)) {
      if (!file.name.toLowerCase().endsWith(".xlsx")) {
        toast.error(`${file.name} isn't an .xlsx file.`);
        continue;
      }
      if (!next.some((existing) => existing.name === file.name)) next.push(file);
    }
    setFiles(next.slice(0, 5));
    setReport(null);
  };

  const send = (apply: boolean) =>
    startTransition(async () => {
      const form = new FormData();
      for (const file of files) form.append("files", file);
      if (apply) form.append("apply", "true");
      const result = await importSpreadsheets(form);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setReport(result.data ?? null);
      if (result.data?.applied) toast.success("Content imported");
    });

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    add(event.dataTransfer.files);
  };

  const errors = report?.issues.filter((issue) => issue.level === "error") ?? [];
  const warnings = report?.issues.filter((issue) => issue.level === "warning") ?? [];
  const recognised = report?.files.filter((file) => file.kind) ?? [];
  const canApply = report && !report.applied && recognised.length > 0 && errors.length === 0;
  const preview = report?.preview;
  const losing =
    (preview?.cards?.removed.length ?? 0) + (preview?.didYouKnow?.retired.length ?? 0) + (preview?.cycleDays?.removed.length ?? 0);

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="grid gap-3">
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "grid place-items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-black/10 bg-white/35 hover:bg-white/60",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="size-5" />
            </span>
            <span className="text-sm font-medium">Drop the .xlsx files here, or click to choose</span>
            <span className="text-xs text-muted-foreground">Up to 5 files, 4 MB each</span>
          </button>
          <input
            ref={input}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple
            hidden
            onChange={(event) => {
              add(event.target.files);
              event.target.value = "";
            }}
          />

          {files.length ? (
            <ul className="grid gap-1.5">
              {files.map((file) => {
                const match = report?.files.find((item) => item.name === file.name);
                return (
                  <li key={file.name} className="glass flex items-center gap-3 rounded-xl px-3 py-2">
                    {match && !match.kind ? (
                      <FileX2 className="size-4 text-destructive" />
                    ) : (
                      <FileSpreadsheet className="size-4 text-emerald-700" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                    {match ? (
                      <span className={cn("text-xs", match.kind ? "text-emerald-700" : "text-destructive")}>
                        {match.kind ? KIND_LABELS[match.kind] : "Not a content file"}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      disabled={pending}
                      onClick={() => {
                        setFiles(files.filter((item) => item !== file));
                        setReport(null);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="flex justify-end gap-2">
            <Button variant="outline" disabled={pending || !files.length} onClick={() => send(false)}>
              {pending && !report ? "Checking…" : "Check files"}
            </Button>
            <Button disabled={pending || !canApply} onClick={() => send(true)}>
              Import
            </Button>
          </div>
        </CardContent>
      </Card>

      {report ? (
        <>
          {report.applied && report.report ? (
            <Card className="ring-1 ring-emerald-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="size-5 text-emerald-600" /> Imported
                </CardTitle>
                <CardDescription>Members see the new content the next time their Today loads.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1 text-sm">
                {report.report.cards ? (
                  <p>
                    Recommendations: {report.report.cards.imported} imported, {report.report.cards.removed} removed.
                  </p>
                ) : null}
                {report.report.didYouKnow ? (
                  <p>
                    Did You Know: {report.report.didYouKnow.imported} imported, {report.report.didYouKnow.retired} retired.
                  </p>
                ) : null}
                {report.report.cycleDays ? (
                  <p>
                    Cycle-day lines: {report.report.cycleDays.imported} imported, {report.report.cycleDays.removed} removed.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {!report.applied ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What&apos;s in the files</CardTitle>
                <CardDescription>
                  {errors.length
                    ? "Fix the errors below in the spreadsheet and check again. Nothing can be imported until then."
                    : recognised.length
                      ? "Rows are matched by their ids and updated in place."
                      : "None of these files is a content spreadsheet."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["Set A cards", report.counts.set_a],
                    ["Set B cards", report.counts.set_b],
                    ["Did You Know", report.counts.did_you_know],
                    ["Cycle-day lines", report.counts.cycle_days],
                  ].map(([label, count]) => (
                    <div key={label} className="glass rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-semibold tabular-nums">{count}</p>
                    </div>
                  ))}
                </div>

                {losing ? (
                  <div className="grid gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/8 p-3 text-sm">
                    <p className="flex items-center gap-2 font-medium text-amber-800">
                      <AlertTriangle className="size-4" /> Importing also removes what isn&apos;t in the files
                    </p>
                    {preview?.cards?.removed.length ? (
                      <p>
                        {preview.cards.removed.length} card{preview.cards.removed.length === 1 ? "" : "s"} would be
                        deleted: <IdList ids={preview.cards.removed} />
                      </p>
                    ) : null}
                    {preview?.didYouKnow?.retired.length ? (
                      <p>
                        {preview.didYouKnow.retired.length} fact{preview.didYouKnow.retired.length === 1 ? "" : "s"} would
                        leave the rotation: <IdList ids={preview.didYouKnow.retired} />
                      </p>
                    ) : null}
                    {preview?.cycleDays?.removed.length ? (
                      <p>
                        {preview.cycleDays.removed.length} cycle-day line
                        {preview.cycleDays.removed.length === 1 ? "" : "s"} would be deleted:{" "}
                        <IdList ids={preview.cycleDays.removed} />
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      Content added or edited in the dashboard but missing from the spreadsheet is included here. Add
                      it to the spreadsheet first if it should stay.
                    </p>
                  </div>
                ) : null}

                {report.issues.length ? (
                  <div className="grid gap-1.5">
                    <p className="text-sm font-medium">
                      {errors.length ? `${errors.length} error${errors.length === 1 ? "" : "s"}` : null}
                      {errors.length && warnings.length ? ", " : null}
                      {warnings.length ? `${warnings.length} warning${warnings.length === 1 ? "" : "s"}` : null}
                    </p>
                    <ul className="grid max-h-80 gap-1 overflow-y-auto pr-1">
                      {[...errors, ...warnings].map((issue, index) => (
                        <li
                          key={index}
                          className={cn(
                            "flex gap-2 rounded-lg px-2.5 py-1.5 text-sm",
                            issue.level === "error" ? "bg-rose-500/8" : "bg-amber-500/8",
                          )}
                        >
                          {issue.level === "error" ? (
                            <XCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
                          ) : (
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                          )}
                          <span>
                            <span className="text-muted-foreground">{issue.file_name}</span>
                            {issue.id ? <span className="font-mono text-xs"> · {issue.id}</span> : null}
                            <span className="block">{issue.message}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : recognised.length ? (
                  <p className="flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 className="size-4" /> No problems found.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
