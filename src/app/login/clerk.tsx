"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/react";

/**
 * The app's own Clerk instance (same publishable key as the mobile app), loaded on the sign-in
 * pages only. Clerk proves who the person is with Google or Apple; the API then decides whether
 * that account is an admin and opens a dashboard session (httpOnly cookies, as before). The Clerk
 * session itself is signed out right after, so nothing of it stays in the browser.
 */
export const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export function AdminClerkProvider({ children }: { children: ReactNode }) {
  if (!CLERK_PUBLISHABLE_KEY) return children;
  return <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>{children}</ClerkProvider>;
}
