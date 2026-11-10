"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown inside the dashboard (sidebar kept) when a page can't load, usually because the Solu
 * API isn't answering. Production hides the error itself; the digest matches the server log.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="glass mx-auto mt-10 grid max-w-lg justify-items-center gap-3 rounded-2xl p-8 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-amber-500/15 text-amber-700">
        <AlertTriangle className="size-5" />
      </span>
      <h2 className="text-lg font-semibold">This page couldn&apos;t load</h2>
      <p className="text-sm text-muted-foreground">
        The dashboard couldn&apos;t get its data from the Solu API. Check that the API is running and that
        <code className="mx-1 text-xs">SOLU_API_URL</code>
        points to it, then try again.
      </p>
      {process.env.NODE_ENV !== "production" && error.message ? (
        // Development only: production replaces the message with a generic one.
        <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-900">{error.message}</p>
      ) : null}
      {error.digest ? <p className="text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      <Button onClick={reset}>
        <RotateCcw /> Try again
      </Button>
    </div>
  );
}
