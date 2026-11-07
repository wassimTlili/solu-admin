"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { graphql } from "@/lib/gql";
import type {
  AdminBlogArticleInput,
  AdminCycleDayRowInput,
  AdminDidYouKnowInput,
  AdminLibraryItemInput,
  AdminSmartCardInput,
} from "@/lib/gql/graphql";
import { adminRequest, errorMessage } from "@/lib/server/api";
import { ACCESS_COOKIE, API_URL } from "@/lib/server/session";

export interface ActionResult {
  ok?: boolean;
  error?: string;
}

const run = async (path: string, work: () => Promise<unknown>): Promise<ActionResult> => {
  try {
    await work();
  } catch (error) {
    return { error: errorMessage(error) };
  }
  revalidatePath(path);
  return { ok: true };
};

// ---- Recommendations -----------------------------------------------------------------------

const SaveCard = graphql(`
  mutation AdminSaveCard($input: AdminSmartCardInput!) {
    adminSaveSmartCard(input: $input) { id }
  }
`);
const DeleteCard = graphql(`
  mutation AdminDeleteCard($id: String!) {
    adminDeleteSmartCard(id: $id)
  }
`);

export async function saveCard(input: AdminSmartCardInput) {
  return run("/content/recommendations", () => adminRequest(SaveCard, { input }));
}
export async function deleteCard(id: string) {
  return run("/content/recommendations", () => adminRequest(DeleteCard, { id }));
}

// ---- Did You Know --------------------------------------------------------------------------

const SaveFact = graphql(`
  mutation AdminSaveFact($input: AdminDidYouKnowInput!) {
    adminSaveDidYouKnow(input: $input) { id }
  }
`);
const DeleteFact = graphql(`
  mutation AdminDeleteFact($id: String!) {
    adminDeleteDidYouKnow(id: $id)
  }
`);

export async function saveFact(input: AdminDidYouKnowInput) {
  return run("/content/did-you-know", () => adminRequest(SaveFact, { input }));
}
export async function deleteFact(id: string) {
  return run("/content/did-you-know", () => adminRequest(DeleteFact, { id }));
}

// ---- Cycle-day lines -----------------------------------------------------------------------

const SaveDayRow = graphql(`
  mutation AdminSaveDayRow($input: AdminCycleDayRowInput!) {
    adminSaveCycleDayRow(input: $input) { row_id }
  }
`);
const DeleteDayRow = graphql(`
  mutation AdminDeleteDayRow($id: String!) {
    adminDeleteCycleDayRow(row_id: $id)
  }
`);

export async function saveDayRow(input: AdminCycleDayRowInput) {
  return run("/content/cycle-days", () => adminRequest(SaveDayRow, { input }));
}
export async function deleteDayRow(rowId: string) {
  return run("/content/cycle-days", () => adminRequest(DeleteDayRow, { id: rowId }));
}

// ---- Articles ------------------------------------------------------------------------------

const SaveArticle = graphql(`
  mutation AdminSaveArticle($input: AdminBlogArticleInput!) {
    adminSaveBlogArticle(input: $input) { id }
  }
`);
const RefreshArticle = graphql(`
  mutation AdminRefreshArticle($id: String!) {
    adminRefreshBlogArticle(id: $id) { id }
  }
`);

export async function saveArticle(input: AdminBlogArticleInput) {
  return run("/content/articles", () => adminRequest(SaveArticle, { input }));
}
export async function refreshArticle(id: string) {
  return run("/content/articles", () => adminRequest(RefreshArticle, { id }));
}

// ---- Insights & journal prompts ------------------------------------------------------------

const SaveLibraryItem = graphql(`
  mutation AdminSaveLibraryItem($input: AdminLibraryItemInput!) {
    adminSaveLibraryItem(input: $input) { id }
  }
`);
const DeleteLibraryItem = graphql(`
  mutation AdminDeleteLibraryItem($id: String!) {
    adminDeleteLibraryItem(id: $id)
  }
`);

export async function saveLibraryItem(input: AdminLibraryItemInput) {
  return run("/content/library", () => adminRequest(SaveLibraryItem, { input }));
}
export async function deleteLibraryItem(id: string) {
  return run("/content/library", () => adminRequest(DeleteLibraryItem, { id }));
}

// ---- Spreadsheet import --------------------------------------------------------------------

export interface ImportIssue {
  file: string;
  file_name: string;
  level: "error" | "warning";
  id?: string;
  message: string;
}

export interface ImportReport {
  files: { name: string; kind: string | null; label: string }[];
  counts: { set_a: number; set_b: number; did_you_know: number; cycle_days: number };
  issues: ImportIssue[];
  applied: boolean;
  preview: {
    cards?: { imported: number; removed: string[] };
    didYouKnow?: { imported: number; retired: string[] };
    cycleDays?: { imported: number; removed: string[] };
  } | null;
  report: {
    cards?: { imported: number; removed: number };
    didYouKnow?: { imported: number; retired: number };
    cycleDays?: { imported: number; removed: number };
  } | null;
}

const MAX_FILES = 5;
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Sends the chosen spreadsheets to `POST /v1/admin/content/import` as the signed-in admin.
 * `apply` false = check only (nothing is written).
 */
export async function importSpreadsheets(form: FormData): Promise<{ data?: ImportReport; error?: string }> {
  const files = form.getAll("files").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (!files.length) return { error: "Choose one or more .xlsx files." };
  if (files.length > MAX_FILES) return { error: `Up to ${MAX_FILES} files at a time.` };
  if (files.some((file) => !file.name.toLowerCase().endsWith(".xlsx"))) return { error: "Only .xlsx files." };
  if (files.some((file) => file.size > MAX_BYTES)) return { error: "Each file must be under 4 MB." };

  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) redirect("/login");

  const body = new FormData();
  for (const file of files) body.append("files", file, file.name);
  if (form.get("apply") === "true") body.append("apply", "true");

  let response: Response;
  try {
    response = await fetch(new URL("/v1/admin/content/import", API_URL), {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body,
      cache: "no-store",
    });
  } catch {
    return { error: "The API isn't answering. Is it running?" };
  }
  if (response.status === 401) redirect("/login?expired=1");

  const json = (await response.json().catch(() => null)) as
    | (ImportReport & { message?: string; explanation?: string })
    | null;
  if (!response.ok || !json?.files) {
    return { error: json?.explanation ?? json?.message ?? `The API answered ${response.status}.` };
  }
  if (json.applied) {
    for (const path of ["/content/recommendations", "/content/did-you-know", "/content/cycle-days", "/"]) {
      revalidatePath(path);
    }
  }
  return { data: json };
}
