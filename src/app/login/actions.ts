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
} from "@/lib/server/session";

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

/** Only same-site paths, so the login form can't be used to bounce admins elsewhere. */
const safeNext = (value?: string) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = LoginForm.safeParse(Object.fromEntries(formData));
  const email = String(formData.get("email") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0]?.message, email };

  let tokens: { access_token: string; refresh_token: string; expires_in: number } | undefined;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": (await headers()).get("user-agent") ?? "solu-admin",
      },
      body: JSON.stringify({
        query: LOGIN,
        variables: { input: { email: parsed.data.email, password: parsed.data.password } },
      }),
      cache: "no-store",
    });
    const body = (await response.json()) as {
      data?: { adminLogin?: typeof tokens };
      errors?: { message: string }[];
    };
    if (body.errors?.length) {
      const message = body.errors[0].message;
      return {
        error: /too many/i.test(message)
          ? "Too many attempts. Wait a minute and try again."
          : "Invalid email or password.",
        email,
      };
    }
    tokens = body.data?.adminLogin;
  } catch {
    return { error: "The Solu API can't be reached right now.", email };
  }
  if (!tokens) return { error: "Invalid email or password.", email };

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in));
  jar.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(SESSION_SECONDS));
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
