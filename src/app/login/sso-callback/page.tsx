import type { Metadata } from "next";
import { SignInShell } from "../shell";
import { SsoCallback } from "../steps";

export const metadata: Metadata = { title: "Signing in · Solu Admin" };

export default async function SsoCallbackPage({ searchParams }: PageProps<"/login/sso-callback">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  return (
    <SignInShell>
      <SsoCallback next={next} />
    </SignInShell>
  );
}
