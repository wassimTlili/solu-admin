import type { Metadata } from "next";
import { SignInShell } from "../shell";
import { CompleteSignIn } from "../steps";

export const metadata: Metadata = { title: "Signing in · Solu Admin" };

export default async function CompleteSignInPage({ searchParams }: PageProps<"/login/complete">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  return (
    <SignInShell>
      <CompleteSignIn next={next} />
    </SignInShell>
  );
}
