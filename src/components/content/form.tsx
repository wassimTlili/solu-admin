"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionResult {
  ok?: boolean;
  error?: string;
  /** The id the API gave a new row (shown in the confirmation). */
  id?: string;
}

/**
 * Runs a Server Action in a transition and reports the outcome as a toast. `success` can use
 * the result, e.g. to name the id a new row was given.
 */
export function useSave() {
  const [pending, startTransition] = useTransition();
  const run = (
    work: () => Promise<ActionResult>,
    success: string | ((result: ActionResult) => string),
    onDone?: () => void,
  ) =>
    startTransition(async () => {
      const result = await work();
      if (result?.error) toast.error(result.error);
      else {
        toast.success(typeof success === "function" ? success(result) : success);
        onDone?.();
      }
    });
  return { pending, run };
}

/** A labelled form row with an optional hint and character count. */
export function Field({
  label,
  hint,
  count,
  max,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  count?: number;
  max?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {max ? (
          <span className={cn("text-[11px] tabular-nums text-muted-foreground", (count ?? 0) > max && "text-destructive")}>
            {count ?? 0}/{max}
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** A controlled native select in the glass style (dependable inside sheets and dialogs). */
export function Select({
  value,
  onChange,
  options,
  className,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-8 rounded-lg border border-input bg-white/60 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50",
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** Multi-select as toggle chips. */
export function Chips({
  options,
  value,
  onChange,
  max,
}: {
  options: readonly { value: string; label: string; color?: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const on = value.includes(option.value);
        const full = !on && max !== undefined && value.length >= max;
        return (
          <button
            key={option.value}
            type="button"
            disabled={full}
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((item) => item !== option.value) : [...value, option.value])}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors disabled:opacity-40",
              on
                ? "border-primary/40 bg-primary/12 text-primary"
                : "border-black/8 bg-white/50 text-muted-foreground hover:bg-white/80",
            )}
          >
            {option.color ? <span className="size-2 rounded-full" style={{ background: option.color }} /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** A delete button that asks first. */
export function DeleteButton({
  title,
  description,
  onConfirm,
  disabled,
  label = "Delete",
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  disabled?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant="ghost" className="text-destructive" disabled={disabled} onClick={() => setOpen(true)}>
        <Trash2 /> {label}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              {label}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
