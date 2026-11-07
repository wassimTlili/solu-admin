"use client";

import { useState, type ReactNode } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Asks for the reason (kept in the audit log) before a moderation action. With `confirmText`,
 * the admin also types it (e.g. a group's name) before a permanent delete.
 */
export function ReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  confirmText,
  pending,
  extra,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  confirmText?: string;
  pending?: boolean;
  extra?: ReactNode;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");
  const ready =
    reason.trim().length >= 3 &&
    (!confirmText || typed.trim().toLowerCase() === confirmText.trim().toLowerCase());

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setReason("");
          setTyped("");
        }
        onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="moderation-reason">Reason (kept in the audit log)</Label>
            <Textarea
              id="moderation-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={2}
              placeholder="e.g. Spam, or breaks the community guidelines"
            />
          </div>
          {confirmText ? (
            <div className="grid gap-1.5">
              <Label htmlFor="moderation-confirm">
                Type <span className="font-semibold">{confirmText}</span> to confirm
              </Label>
              <Input id="moderation-confirm" value={typed} onChange={(event) => setTyped(event.target.value)} />
            </div>
          ) : null}
          {extra}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Back</AlertDialogCancel>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={!ready || pending}
            onClick={() => onConfirm(reason.trim())}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
