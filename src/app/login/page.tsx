import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SoluMark } from "@/components/shell/solu-mark";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · Solu Admin" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
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
            <CardDescription>For the Solu team only. Every action is logged.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm next={next} expired={params.expired === "1"} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
