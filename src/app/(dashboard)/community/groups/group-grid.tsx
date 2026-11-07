"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Lock, MapPin, MessagesSquare, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { PhaseDot } from "@/components/data/bits";
import { ReasonDialog } from "@/components/community/reason-dialog";
import type { AdminGroupsQuery } from "@/lib/gql/graphql";
import { deleteGroup } from "../actions";

type Group = AdminGroupsQuery["adminGroups"]["nodes"][number];

export function GroupGrid({ groups }: { groups: Group[] }) {
  const [deleting, setDeleting] = useState<Group | null>(null);
  const [pending, startTransition] = useTransition();

  if (!groups.length) {
    return <div className="glass rounded-2xl py-14 text-center text-sm text-muted-foreground">No groups match.</div>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="glass grid content-start overflow-hidden rounded-2xl">
            <div className="relative h-28 bg-gradient-to-br from-[#904EB4]/25 to-[#FC7B00]/25">
              {group.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={group.image_url} alt="" className="size-full object-cover" />
              ) : null}
              {group.type === "PRIVATE" ? (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-0.5 text-[11px]">
                  <Lock className="size-3" /> Private
                </span>
              ) : null}
            </div>
            <div className="grid gap-2.5 p-3.5">
              <div className="grid gap-0.5">
                <p className="font-medium">{group.name}</p>
                <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  {group.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {group.location}
                    </span>
                  ) : null}
                  {group.phase_tag ? <PhaseDot phase={group.phase_tag} /> : null}
                </p>
              </div>
              {group.description ? <p className="line-clamp-2 text-sm text-muted-foreground">{group.description}</p> : null}
              <div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" /> {group.members} member{group.members === 1 ? "" : "s"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessagesSquare className="size-3.5" /> {group.posts} post{group.posts === 1 ? "" : "s"}
                </span>
                {group.pending ? (
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <UserPlus className="size-3.5" /> {group.pending} waiting
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Avatar className="size-5">
                  {group.owner.image_url ? <AvatarImage src={group.owner.image_url} alt="" /> : null}
                  <AvatarFallback className="text-[10px]">{group.owner.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">
                  Owner{" "}
                  <Link href={`/members/${group.owner.id}`} className="text-foreground hover:underline">
                    {group.owner.name}
                  </Link>
                </span>
              </div>
              <div className="flex justify-between gap-2 border-t border-black/5 pt-2.5">
                <Link
                  href={`/community/posts?group=${group.id}&group_name=${encodeURIComponent(group.name)}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  View posts
                </Link>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleting(group)}>
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReasonDialog
        key={deleting?.id ?? "none"}
        open={deleting !== null}
        onOpenChange={(next) => (next ? null : setDeleting(null))}
        title={`Delete ${deleting?.name ?? "this group"}?`}
        description={`Its ${deleting?.members ?? 0} memberships and ${deleting?.posts ?? 0} posts (with their comments) are removed for good. Members are not told.`}
        confirmLabel="Delete group"
        destructive
        confirmText={deleting?.name}
        pending={pending}
        onConfirm={(reason) =>
          startTransition(async () => {
            if (!deleting) return;
            const result = await deleteGroup(deleting.id, reason);
            if (result.error) toast.error(result.error);
            else {
              toast.success("Group deleted");
              setDeleting(null);
            }
          })
        }
      />
    </>
  );
}
