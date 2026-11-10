import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { SIGN_IN_ERRORS } from "./next-path";
import { SignInShell } from "./shell";
import { SocialSignIn } from "./social-sign-in";

export const metadata: Metadata = { title: "Sign in · Solu Admin" };

/** Email + password is for local development only (the API refuses it in production). */
const SHOW_PASSWORD_FORM = process.env.NODE_ENV !== "production";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const errorCode = typeof params.error === "string" ? params.error : undefined;
  const error = errorCode ? (SIGN_IN_ERRORS[errorCode] ?? SIGN_IN_ERRORS.unverified) : undefined;

  return (
    <SignInShell>
      <div className="grid gap-4">
        {error ? (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : params.expired === "1" ? (
          <p className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
            Your session ended. Please sign in again.
          </p>
        ) : null}

        <SocialSignIn next={next} />

        {SHOW_PASSWORD_FORM ? (
          <details className="group rounded-xl border border-dashed border-black/10 px-3 py-2">
            <summary className="cursor-pointer text-xs text-muted-foreground select-none">
              Email and password (local development only)
            </summary>
            <div className="pt-3">
              <LoginForm next={next} />
            </div>
          </details>
        ) : null}
      </div>
    </SignInShell>
  );
}
