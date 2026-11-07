"use client";

import { useState, useTransition } from "react";
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
import { cancelCampaign } from "./actions";

export function CancelCampaign({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button size="sm" variant="ghost" className="text-destructive" disabled={pending} onClick={() => setOpen(true)}>
        Cancel
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel &ldquo;{title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>It won&apos;t be sent. You can create it again later.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await cancelCampaign(id);
                  if (result.error) toast.error(result.error);
                  else toast.success("Cancelled");
                  setOpen(false);
                })
              }
            >
              Cancel sending
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
