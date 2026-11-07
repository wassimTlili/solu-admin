"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Bookmark, EyeOff, Heart, Lightbulb, MessageCircle, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PhaseDot, StatusBadge, timeAgo } from "@/components/data/bits";
import { ReasonDialog } from "@/components/community/reason-dialog";
import type { AdminPostCommentsQuery, AdminPostsQuery } from "@/lib/gql/graphql";
import { cn } from "@/lib/utils";
import { deleteComment, deletePost, loadComments, setPostStatus } from "../actions";

type Post = AdminPostsQuery["adminPosts"]["nodes"][number];
type Comment = AdminPostCommentsQuery["adminPostComments"][number];

function Person({ name, image, size = "size-8" }: { name: string; image?: string | null; size?: string }) {
  return (
    <Avatar className={size}>
      {image ? <AvatarImage src={image} alt="" /> : null}
      <AvatarFallback className="text-xs">{name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

function Counts({ post }: { post: Post }) {
  return (
    <span className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
      <span className="inline-flex items-center gap-1"><Heart className="size-3.5" /> {post.likes}</span>
      <span className="inline-flex items-center gap-1"><MessageCircle className="size-3.5" /> {post.comments}</span>
      <span className="inline-flex items-center gap-1"><Lightbulb className="size-3.5" /> {post.helpfuls}</span>
      <span className="inline-flex items-center gap-1"><Bookmark className="size-3.5" /> {post.saves}</span>
    </span>
  );
}

export function PostList({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState<Post | null>(null);

  return (
    <>
      {posts.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => setOpen(post)}
              className={cn(
                "glass grid content-start gap-2.5 rounded-2xl p-4 text-left transition-shadow hover:shadow-lg",
                post.status !== "PUBLISHED" && "opacity-70",
              )}
            >
              <span className="flex items-center gap-2.5">
                <Person name={post.author.name} image={post.author.image_url} />
                <span className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium">{post.author.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    in {post.group_name} · {timeAgo(post.created_at)}
                  </span>
                </span>
                {post.status !== "PUBLISHED" ? <StatusBadge status={post.status === "REJECTED" ? "HIDDEN" : post.status} /> : null}
              </span>
              <span className="line-clamp-4 text-sm whitespace-pre-line">{post.content}</span>
              <span className="flex items-center justify-between gap-2">
                <Counts post={post} />
                {post.author_phase ? (
                  <span className="text-xs">
                    <PhaseDot phase={post.author_phase} />
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl py-14 text-center text-sm text-muted-foreground">No posts match these filters.</div>
      )}

      <Sheet open={open !== null} onOpenChange={(next) => (next ? null : setOpen(null))}>
        <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-xl">
          {open ? <PostDetail key={open.id} post={open} onDone={() => setOpen(null)} /> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function PostDetail({ post, onDone }: { post: Post; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [dialog, setDialog] = useState<"hide" | "delete" | { comment: Comment } | null>(null);
  const hidden = post.status === "REJECTED";

  useEffect(() => {
    let cancelled = false;
    loadComments(post.id).then((result) => {
      if (cancelled) return;
      if (result.error) toast.error(result.error);
      setComments(result.data ?? []);
    });
    return () => {
      cancelled = true;
    };
  }, [post.id]);

  const act = (work: () => Promise<{ error?: string }>, success: string, close = true) =>
    startTransition(async () => {
      const result = await work();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(success);
      setDialog(null);
      if (close) onDone();
    });

  return (
    <>
      <SheetHeader className="border-b border-black/5">
        <div className="flex items-center gap-2.5 pr-8">
          <Person name={post.author.name} image={post.author.image_url} size="size-10" />
          <div className="grid min-w-0 leading-tight">
            <SheetTitle className="truncate">{post.author.name}</SheetTitle>
            <SheetDescription className="truncate">
              in {post.group_name} · {timeAgo(post.created_at)}
            </SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
          <Link href={`/members/${post.author.id}`} className="text-primary">
            Open profile
          </Link>
          <Link
            href={`/community/posts?author=${post.author.id}&author_name=${encodeURIComponent(post.author.name)}`}
            className="text-primary"
            onClick={onDone}
          >
            Other posts by this member
          </Link>
        </div>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-4 overflow-y-auto p-4">
        {hidden ? (
          <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-sm text-amber-800">
            Hidden: members can&apos;t see this post. Its author still can.
          </p>
        ) : null}
        <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
        <Counts post={post} />

        <div className="grid gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Comments {comments ? `(${comments.length})` : ""}
          </span>
          {comments === null ? (
            <span className="text-sm text-muted-foreground">Loading…</span>
          ) : comments.length ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={cn("glass flex gap-2.5 rounded-xl p-2.5", comment.parent_id && "ml-6")}
              >
                <Person name={comment.author.name} image={comment.author.image_url} size="size-7" />
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <span className="text-xs">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-muted-foreground"> · {timeAgo(comment.created_at)}</span>
                  </span>
                  <span className="text-sm whitespace-pre-line">{comment.content}</span>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Delete comment"
                  onClick={() => setDialog({ comment })}
                >
                  <Trash2 />
                </Button>
              </div>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No comments.</span>
          )}
        </div>
      </div>

      <SheetFooter className="flex-row justify-between border-t border-black/5">
        <Button variant="ghost" className="text-destructive" disabled={pending} onClick={() => setDialog("delete")}>
          <Trash2 /> Delete
        </Button>
        {hidden ? (
          <Button variant="outline" disabled={pending} onClick={() => setDialog("hide")}>
            <RotateCcw /> Restore
          </Button>
        ) : (
          <Button variant="outline" disabled={pending} onClick={() => setDialog("hide")}>
            <EyeOff /> Hide
          </Button>
        )}
      </SheetFooter>

      <ReasonDialog
        open={dialog === "hide"}
        onOpenChange={(next) => setDialog(next ? "hide" : null)}
        title={hidden ? "Restore this post?" : "Hide this post?"}
        description={
          hidden
            ? "It shows in feeds again."
            : "It disappears from every feed, link and saved list. Its author still sees it. You can restore it."
        }
        confirmLabel={hidden ? "Restore" : "Hide"}
        pending={pending}
        onConfirm={(reason) =>
          act(() => setPostStatus(post.id, hidden ? "PUBLISHED" : "REJECTED", reason), hidden ? "Post restored" : "Post hidden")
        }
      />
      <ReasonDialog
        open={dialog === "delete"}
        onOpenChange={(next) => setDialog(next ? "delete" : null)}
        title="Delete this post for good?"
        description="The post, its comments, likes and saves are removed and can't be recovered."
        confirmLabel="Delete post"
        destructive
        pending={pending}
        onConfirm={(reason) => act(() => deletePost(post.id, reason), "Post deleted")}
      />
      <ReasonDialog
        open={typeof dialog === "object" && dialog !== null}
        onOpenChange={(next) => (next ? null : setDialog(null))}
        title="Delete this comment?"
        description="It is removed with its replies and can't be recovered."
        confirmLabel="Delete comment"
        destructive
        pending={pending}
        onConfirm={(reason) => {
          if (typeof dialog !== "object" || !dialog) return;
          const id = dialog.comment.id;
          act(
            async () => {
              const result = await deleteComment(id, reason);
              if (!result.error) setComments((list) => (list ?? []).filter((item) => item.id !== id && item.parent_id !== id));
              return result;
            },
            "Comment deleted",
            false,
          );
        }}
      />
    </>
  );
}
