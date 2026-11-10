import "server-only";

import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import type { TypedDocumentString } from "@/lib/gql/graphql";
import { ACCESS_COOKIE, API_URL } from "./session";

interface GraphQLErrorShape {
  message: string;
  extensions?: { type?: string; code?: string; explanation?: string; statusCode?: number };
}

/** An API error with the explanation the API gives, safe to show to the admin. */
export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly type?: string,
  ) {
    super(message);
  }
}

const isAuthError = (error: GraphQLErrorShape) =>
  error.extensions?.type === "UNAUTHORIZED" ||
  error.extensions?.statusCode === 401 ||
  /no user session|access token/i.test(error.message);

/**
 * Runs a typed GraphQL operation against the Solu API as the signed-in admin. The proxy keeps
 * the access token fresh; if the API still refuses it, the session is over: back to sign-in.
 */
export async function adminRequest<TResult, TVariables>(
  document: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) redirect("/login");

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: document.toString(), variables: variables ?? {} }),
      cache: "no-store",
    });
  } catch {
    // Nothing answered (usually the API isn't started): one clear line instead of a stack.
    throw new AdminApiError(
      `The Solu API isn't answering at ${API_URL}. Start it (npm run dev:api in the Solu folder) and try again.`,
      "API_UNREACHABLE",
    );
  }

  let body: { data?: TResult; errors?: GraphQLErrorShape[] };
  try {
    body = await response.json();
  } catch {
    throw new AdminApiError(`The API answered ${response.status}. Is it running?`);
  }

  if (body.errors?.length) {
    const [first] = body.errors;
    if (isAuthError(first)) redirect("/login?expired=1");
    throw new AdminApiError(first.extensions?.explanation ?? first.message, first.extensions?.type);
  }
  return body.data as TResult;
}

/**
 * For Server Actions: the error text to show, never a stack. Next's own control-flow errors
 * (the sign-in redirect when the session is over) are re-thrown so they still navigate.
 */
export const errorMessage = (error: unknown) => {
  unstable_rethrow(error);
  return error instanceof AdminApiError ? error.message : "Something went wrong. Please try again.";
};
