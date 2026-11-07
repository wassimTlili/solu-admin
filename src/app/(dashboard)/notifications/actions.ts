"use server";

import { revalidatePath } from "next/cache";
import { graphql } from "@/lib/gql";
import type { AdminAudienceInput, AdminCampaignInput, AdminTestCampaignInput } from "@/lib/gql/graphql";
import { adminRequest, errorMessage } from "@/lib/server/api";

const Count = graphql(`
  query AdminAudienceCount($audience: AdminAudienceInput!) {
    adminAudienceCount(audience: $audience) { members reachable }
  }
`);
const SearchMembers = graphql(`
  query AdminCampaignMemberSearch($search: String) {
    adminUsers(limit: 8, filter: { search: $search, status: ACTIVE }) {
      nodes { id first_name last_name email image_url }
    }
  }
`);
const Create = graphql(`
  mutation AdminCreateCampaign($input: AdminCampaignInput!) {
    adminCreateCampaign(input: $input) { id status recipients pushed queued inbox_only }
  }
`);
const Cancel = graphql(`
  mutation AdminCancelCampaign($id: String!) {
    adminCancelCampaign(id: $id) { id status }
  }
`);
const Test = graphql(`
  mutation AdminTestCampaign($input: AdminTestCampaignInput!) {
    adminTestCampaign(input: $input) { pushed devices queued }
  }
`);

export interface Result<T> {
  data?: T;
  error?: string;
}

const attempt = async <T,>(work: () => Promise<T>): Promise<Result<T>> => {
  try {
    return { data: await work() };
  } catch (error) {
    return { error: errorMessage(error) };
  }
};

export async function countAudience(audience: AdminAudienceInput) {
  return attempt(async () => (await adminRequest(Count, { audience })).adminAudienceCount);
}

export async function searchMembers(search: string) {
  return attempt(async () => (await adminRequest(SearchMembers, { search: search.trim() || null })).adminUsers.nodes);
}

export async function sendTest(input: AdminTestCampaignInput) {
  return attempt(async () => (await adminRequest(Test, { input })).adminTestCampaign);
}

export async function createCampaign(input: AdminCampaignInput) {
  const result = await attempt(async () => (await adminRequest(Create, { input })).adminCreateCampaign);
  if (result.data) revalidatePath("/notifications");
  return result;
}

export async function cancelCampaign(id: string) {
  const result = await attempt(async () => (await adminRequest(Cancel, { id })).adminCancelCampaign);
  if (result.data) revalidatePath("/notifications");
  return result;
}
