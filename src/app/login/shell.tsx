import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SoluMark } from "@/components/shell/solu-mark";

/** The sign-in card, shared by /login and the steps Google or Apple send her back to. */
export function SignInShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <SoluMark className="size-9" />
          <span className="text-2xl font-semibold tracking-tight">Solu Admin</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              With the Google or Apple account you use for Solu. For the Solu team only; every action is logged.
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </main>
  );
}
