"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { graphql } from "@/lib/gql";
import { adminRequest, errorMessage } from "@/lib/server/api";

export interface ActionResult {
  ok?: boolean;
  error?: string;
}

const Suspend = graphql(`
  mutation AdminSuspend($input: AdminSuspendUserInput!) {
    adminSuspendUser(input: $input) { id status }
  }
`);
const Reactivate = graphql(`
  mutation AdminReactivate($id: String!) {
    adminReactivateUser(user_id: $id) { id status }
  }
`);
const SetRole = graphql(`
  mutation AdminSetRole($id: String!, $role: UserRole!) {
    adminSetUserRole(user_id: $id, role: $role) { id role }
  }
`);
const Delete = graphql(`
  mutation AdminDeleteMember($id: String!) {
    adminDeleteUser(user_id: $id)
  }
`);

const run = async (id: string, work: () => Promise<unknown>): Promise<ActionResult> => {
  try {
    await work();
  } catch (error) {
    return { error: errorMessage(error) };
  }
  revalidatePath(`/members/${id}`);
  revalidatePath("/members");
  return { ok: true };
};

export async function suspendMember(id: string, reason: string): Promise<ActionResult> {
  if (reason.trim().length < 3) return { error: "Add a short reason (it goes in the audit log)." };
  return run(id, () => adminRequest(Suspend, { input: { user_id: id, reason: reason.trim() } }));
}

export async function reactivateMember(id: string): Promise<ActionResult> {
  return run(id, () => adminRequest(Reactivate, { id }));
}

export async function setMemberRole(id: string, role: "ADMIN" | "USER"): Promise<ActionResult> {
  return run(id, () => adminRequest(SetRole, { id, role }));
}

export async function deleteMember(id: string): Promise<ActionResult> {
  try {
    await adminRequest(Delete, { id });
  } catch (error) {
    return { error: errorMessage(error) };
  }
  revalidatePath("/members");
  redirect("/members?deleted=1");
}
