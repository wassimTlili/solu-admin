"use client";

import { useState, useTransition } from "react";
import { Ban, RotateCcw, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteMember, reactivateMember, setMemberRole, suspendMember, type ActionResult } from "../actions";

interface Props {
  id: string;
  email: string;
  status: string;
  role: string;
  isSelf: boolean;
}

export function MemberActions({ id, email, status, role, isSelf }: Props) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<"suspend" | "delete" | null>(null);
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState("");

  const act = (work: () => Promise<ActionResult>, success: string) =>
    startTransition(async () => {
      const result = await work();
      if (result?.error) toast.error(result.error);
      else {
        toast.success(success);
        setOpen(null);
        setReason("");
      }
    });

  if (isSelf) {
    return <p className="text-sm text-muted-foreground">This is your account. Another admin can change it.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "SUSPENDED" || status === "INACTIVE" ? (
        <Button variant="outline" disabled={pending} onClick={() => act(() => reactivateMember(id), "Member reactivated")}>
          <RotateCcw /> Reactivate
        </Button>
      ) : status !== "DELETED" ? (
        <Button variant="outline" className="text-destructive" disabled={pending} onClick={() => setOpen("suspend")}>
          <Ban /> Suspend
        </Button>
      ) : null}
      {status !== "DELETED" ? (
        role === "ADMIN" ? (
          <Button variant="outline" disabled={pending} onClick={() => act(() => setMemberRole(id, "USER"), "Admin access removed")}>
            <ShieldOff /> Remove admin
          </Button>
        ) : (
          <Button variant="outline" disabled={pending} onClick={() => act(() => setMemberRole(id, "ADMIN"), "Now an admin")}>
            <ShieldCheck /> Make admin
          </Button>
        )
      ) : null}
      {status !== "DELETED" ? (
        <Button variant="destructive" disabled={pending} onClick={() => setOpen("delete")}>
          <Trash2 /> Delete
        </Button>
      ) : null}

      <Dialog open={open === "suspend"} onOpenChange={(next) => setOpen(next ? "suspend" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend this member?</DialogTitle>
            <DialogDescription>
              They are signed out of the app at once and can&apos;t sign back in until an admin reactivates the account. Their
              data is kept.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason (kept in the audit log)</Label>
            <Textarea id="reason" value={reason} onChange={(event) => setReason(event.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={pending || reason.trim().length < 3}
              onClick={() => act(() => suspendMember(id, reason), "Member suspended")}
            >
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "delete"} onOpenChange={(next) => setOpen(next ? "delete" : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this account permanently?</DialogTitle>
            <DialogDescription>
              The profile, cycle data, journal, goals and posts are deleted and can&apos;t be recovered. Groups this member
              owns pass to another member. Type the account email to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder={email} />
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={pending || confirm.trim().toLowerCase() !== email.toLowerCase()}
              onClick={() => act(() => deleteMember(id), "Account deleted")}
            >
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
