"use client";

import { useEffect, useState } from "react";
import { useAuth, useSignIn } from "@clerk/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLERK_PUBLISHABLE_KEY } from "./clerk";
import { nextQuery } from "./next-path";

type Strategy = "oauth_google" | "oauth_apple";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.9zM14 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

const PROVIDERS: { strategy: Strategy; label: string; Logo: () => React.JSX.Element }[] = [
  { strategy: "oauth_google", label: "Continue with Google", Logo: GoogleLogo },
  { strategy: "oauth_apple", label: "Continue with Apple", Logo: AppleLogo },
];

function ProviderButtons({ next }: { next?: string }) {
  const { signIn } = useSignIn();
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const [pending, setPending] = useState<Strategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  // A Clerk session left over from an earlier attempt (e.g. an account without admin access)
  // would block a new sign-in, so it is cleared first; this reloads the page once.
  useEffect(() => {
    if (isLoaded && isSignedIn) void signOut({ redirectUrl: window.location.href });
  }, [isLoaded, isSignedIn, signOut]);

  const start = async (strategy: Strategy) => {
    setError(null);
    setPending(strategy);
    const query = nextQuery(next);
    const origin = window.location.origin;
    try {
      const result = await signIn.sso({
        strategy,
        // Back here when Clerk has a session: the API then checks the admin role.
        redirectUrl: `${origin}/login/complete${query}`,
        // When Clerk needs one more step (e.g. a first sign-in that becomes a sign-up).
        redirectCallbackUrl: `${origin}/login/sso-callback${query}`,
      });
      if (result.error) {
        setError(result.error.longMessage ?? "That sign-in didn't start. Please try again.");
        setPending(null);
      }
    } catch {
      setError("That sign-in didn't start. Please try again.");
      setPending(null);
    }
  };

  const ready = isLoaded && !isSignedIn;
  return (
    <div className="grid gap-2.5">
      {PROVIDERS.map(({ strategy, label, Logo }) => (
        <Button
          key={strategy}
          type="button"
          size="lg"
          variant="outline"
          disabled={!ready || pending !== null}
          onClick={() => void start(strategy)}
          className="h-11 w-full justify-center gap-2.5 bg-white/70 text-[15px] font-medium hover:bg-white"
        >
          {pending === strategy ? <Loader2 className="size-5 animate-spin" /> : <Logo />}
          {label}
        </Button>
      ))}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Google and Apple, through the app's Clerk instance: the same accounts members use in the app. */
export function SocialSignIn({ next }: { next?: string }) {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-900">
        Google and Apple sign-in needs <code className="font-mono text-xs">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
        (the same key as the mobile app).
      </p>
    );
  }
  return <ProviderButtons next={next} />;
}
