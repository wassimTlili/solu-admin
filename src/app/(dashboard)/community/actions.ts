"use server";

import { revalidatePath } from "next/cache";
import { graphql } from "@/lib/gql";
import type { CreateEventInput, PostStatus } from "@/lib/gql/graphql";
import { adminRequest, errorMessage } from "@/lib/server/api";

export interface Result<T = true> {
  data?: T;
  error?: string;
}

const attempt = async <T,>(path: string | null, work: () => Promise<T>): Promise<Result<T>> => {
  try {
    const data = await work();
    if (path) revalidatePath(path);
    return { data };
  } catch (error) {
    return { error: errorMessage(error) };
  }
};

// ---- Posts & comments -----------------------------------------------------------------------

const SetStatus = graphql(`
  mutation AdminSetPostStatus($input: AdminPostStatusInput!) {
    adminSetPostStatus(input: $input)
  }
`);
const DeletePost = graphql(`
  mutation AdminDeletePost($input: AdminModerationInput!) {
    adminDeletePost(input: $input)
  }
`);
const Comments = graphql(`
  query AdminPostComments($id: String!) {
    adminPostComments(post_id: $id) {
      id
      content
      parent_id
      likes
      created_at
      author { id name email image_url }
    }
  }
`);
const DeleteComment = graphql(`
  mutation AdminDeleteComment($input: AdminModerationInput!) {
    adminDeleteComment(input: $input)
  }
`);

export async function setPostStatus(id: string, status: "PUBLISHED" | "REJECTED", reason: string) {
  return attempt("/community/posts", () => adminRequest(SetStatus, { input: { id, status: status as PostStatus, reason } }));
}

export async function deletePost(id: string, reason: string) {
  return attempt("/community/posts", () => adminRequest(DeletePost, { input: { id, reason } }));
}

export async function loadComments(id: string) {
  return attempt(null, async () => (await adminRequest(Comments, { id })).adminPostComments);
}

export async function deleteComment(id: string, reason: string) {
  return attempt("/community/posts", () => adminRequest(DeleteComment, { input: { id, reason } }));
}

// ---- Groups ---------------------------------------------------------------------------------

const DeleteGroup = graphql(`
  mutation AdminDeleteGroup($input: AdminModerationInput!) {
    adminDeleteGroup(input: $input)
  }
`);

export async function deleteGroup(id: string, reason: string) {
  return attempt("/community/groups", () => adminRequest(DeleteGroup, { input: { id, reason } }));
}

// ---- Hangouts -------------------------------------------------------------------------------

const SaveEvent = graphql(`
  mutation AdminSaveEvent($id: String, $input: CreateEventInput!) {
    adminSaveEvent(id: $id, input: $input) { id title }
  }
`);
const CancelEvent = graphql(`
  mutation AdminCancelEvent($input: AdminCancelEventInput!) {
    adminCancelEvent(input: $input)
  }
`);

export async function saveEvent(id: string | null, input: CreateEventInput) {
  return attempt("/community/hangouts", () => adminRequest(SaveEvent, { id, input }));
}

export async function cancelEvent(id: string, reason: string, notify: boolean) {
  return attempt("/community/hangouts", () =>
    adminRequest(CancelEvent, { input: { id, reason, notify_attendees: notify } }),
  );
}
