"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HandleSSOCallback, useAuth } from "@clerk/react";
import { Loader2 } from "lucide-react";
import { signInWithClerk } from "./actions";
import { nextQuery } from "./next-path";

function Working({ label }: { label: string }) {
  return (
    <p className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </p>
  );
}

/**
 * Where Google or Apple sends her back when Clerk needs to finish the sign-in itself (for
 * example a first sign-in that Clerk turns into a sign-up). Then on to the admin check.
 */
export function SsoCallback({ next }: { next?: string }) {
  const router = useRouter();
  const toLogin = () => router.replace("/login?error=incomplete");
  return (
    <>
      <Working label="Signing you in…" />
      <HandleSSOCallback
        navigateToApp={() => router.replace(`/login/complete${nextQuery(next)}`)}
        navigateToSignIn={toLogin}
        navigateToSignUp={toLogin}
      />
    </>
  );
}

/**
 * The admin check: the Clerk session token goes to this app's server, which asks the API to
 * open a dashboard session (admins only). Clerk is signed out either way, then she lands on the
 * dashboard, or back on /login with the reason.
 */
export function CompleteSignIn({ next }: { next?: string }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (!isLoaded || started.current) return;
    started.current = true;
    if (!isSignedIn) {
      window.location.replace("/login?error=incomplete");
      return;
    }
    void (async () => {
      let target = "/login?error=unverified";
      try {
        const token = await getToken();
        if (token) {
          const result = await signInWithClerk(token, next);
          target = result.error ? `/login?error=${result.error}` : (result.next ?? "/");
        }
      } catch {
        target = "/login?error=unavailable";
      }
      try {
        await signOut({ redirectUrl: target });
      } catch {
        window.location.replace(target);
      }
    })();
  }, [isLoaded, isSignedIn, getToken, signOut, next]);

  return <Working label="Checking your admin access…" />;
}
