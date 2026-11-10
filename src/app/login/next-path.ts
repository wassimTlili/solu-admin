/** Only same-site paths, so the sign-in pages can't be used to bounce admins elsewhere. */
export const safeNext = (value?: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/login") ? value : "/";

/** `?next=…` to carry the page she asked for through the sign-in steps, or nothing. */
export const nextQuery = (next?: string | null) => {
  const target = safeNext(next);
  return target === "/" ? "" : `?next=${encodeURIComponent(target)}`;
};

/** Why a sign-in ended back on /login (`?error=…`), in words for the person signing in. */
export const SIGN_IN_ERRORS: Record<string, string> = {
  not_admin:
    "This Google or Apple account doesn't have access to the Solu admin dashboard. Sign in with your admin account, or ask an admin to give you access.",
  unverified: "Your sign-in couldn't be verified. Please try again.",
  incomplete: "The sign-in wasn't completed. Please try again.",
  too_many: "Too many attempts. Wait a minute and try again.",
  unavailable: "The Solu API can't be reached right now. Please try again in a moment.",
  not_configured: "Google and Apple sign-in isn't set up on the API yet (CLERK_SECRET_KEY is missing).",
};

export type SignInErrorCode = keyof typeof SIGN_IN_ERRORS;
