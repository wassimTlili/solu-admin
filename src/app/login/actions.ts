"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ACCESS_COOKIE,
  API_URL,
  cookieOptions,
  REFRESH_COOKIE,
  SESSION_SECONDS,
  type AdminTokens,
} from "@/lib/server/session";
import { safeNext, type SignInErrorCode } from "./next-path";

interface ApiErrorShape {
  message: string;
  extensions?: { type?: string; code?: string; statusCode?: number };
}

/** Posts one sign-in mutation to the API from this server (never from the browser). */
const callApi = async <T,>(query: string, variables: Record<string, unknown>) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": (await headers()).get("user-agent") ?? "solu-admin",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  return (await response.json()) as { data?: T; errors?: ApiErrorShape[] };
};

const keepSession = async (tokens: AdminTokens) => {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in));
  jar.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(SESSION_SECONDS));
};

// ---- Google or Apple (Clerk) -----------------------------------------------------------------

const LOGIN_WITH_CLERK = /* GraphQL */ `
  mutation AdminLoginWithClerk($input: AdminClerkLoginInput!) {
    adminLoginWithClerk(input: $input) {
      access_token
      refresh_token
      expires_in
    }
  }
`;

const clerkErrorCode = (error: ApiErrorShape): SignInErrorCode => {
  const { type, code, statusCode } = error.extensions ?? {};
  if (code === "NOT_ADMIN" || type === "FORBIDDEN" || statusCode === 403) return "not_admin";
  if (/too many/i.test(error.message) || type === "TOO_MANY_REQUESTS" || statusCode === 429) return "too_many";
  if (/not configured/i.test(error.message)) return "not_configured";
  return "unverified";
};

export type ClerkSignInResult = { next: string; error?: undefined } | { error: SignInErrorCode; next?: undefined };

/**
 * The last sign-in step: the browser hands over the Clerk session token from its Google or
 * Apple sign-in, the API checks that the account is an active admin and answers with dashboard
 * tokens, which go into httpOnly cookies. The browser signs out of Clerk afterwards either way.
 */
export async function signInWithClerk(sessionToken: string, next?: string): Promise<ClerkSignInResult> {
  if (typeof sessionToken !== "string" || sessionToken.length < 20 || sessionToken.length > 8000) {
    return { error: "unverified" };
  }
  try {
    const body = await callApi<{ adminLoginWithClerk?: AdminTokens }>(LOGIN_WITH_CLERK, {
      input: { clerk_session_token: sessionToken },
    });
    if (body.errors?.length) return { error: clerkErrorCode(body.errors[0]) };
    if (!body.data?.adminLoginWithClerk) return { error: "unverified" };
    await keepSession(body.data.adminLoginWithClerk);
  } catch {
    return { error: "unavailable" };
  }
  return { next: safeNext(next) };
}

// ---- Email + password (local development only) -----------------------------------------------

export interface LoginState {
  error?: string;
  email?: string;
}

const LoginForm = z.object({
  email: z.email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(200),
  next: z.string().optional(),
});

const LOGIN = /* GraphQL */ `
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      access_token
      refresh_token
      expires_in
    }
  }
`;

/**
 * The `npm run admin:create -- … --password` sign-in, kept for local development and tests. The
 * API refuses it in production (unless ADMIN_PASSWORD_LOGIN=true), and the form only shows in
 * development builds.
 */
export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginForm.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, email };

  let tokens: AdminTokens | undefined;
  try {
    const body = await callApi<{ adminLogin?: AdminTokens }>(LOGIN, {
      input: { email: parsed.data.email, password: parsed.data.password },
    });
    if (body.errors?.length) {
      const message = body.errors[0].message;
      return {
        error: /too many/i.test(message)
          ? "Too many attempts. Wait a minute and try again."
          : /turned off/i.test(message)
            ? "Email sign-in is turned off here. Use Google or Apple."
            : "Invalid email or password.",
        email,
      };
    }
    tokens = body.data?.adminLogin;
  } catch {
    return { error: "The Solu API can't be reached right now.", email };
  }
  if (!tokens) return { error: "Invalid email or password.", email };

  await keepSession(tokens);
  redirect(safeNext(parsed.data.next));
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  const refresh = jar.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: "mutation AdminLogout($input: AdminRefreshInput!) { adminLogout(input: $input) }",
        variables: { input: { refresh_token: refresh } },
      }),
      cache: "no-store",
    }).catch(() => undefined);
  }
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  redirect("/login");
}
