/**
 * Admin session cookies. Both are httpOnly: the browser never sees a token, only this app's
 * server (Server Components, Server Actions, proxy) does. Shared by proxy.ts, so no
 * `server-only` import here.
 */
export const ACCESS_COOKIE = "solu_admin_at";
export const REFRESH_COOKIE = "solu_admin_rt";

/** Refresh a little before the 15-minute access token runs out. */
export const REFRESH_MARGIN_SECONDS = 60;
export const SESSION_SECONDS = 7 * 24 * 60 * 60;

export const API_URL = process.env.SOLU_API_URL ?? "http://localhost:5010/graphql";

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

/** Seconds until a JWT expires (0 when expired or unreadable). Not a signature check. */
export const secondsLeft = (token: string | undefined): number => {
  if (!token) return 0;
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    return payload.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : 0;
  } catch {
    return 0;
  }
};

export interface AdminTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const REFRESH_MUTATION = /* GraphQL */ `
  mutation AdminRefresh($input: AdminRefreshInput!) {
    adminRefresh(input: $input) {
      access_token
      refresh_token
      expires_in
    }
  }
`;

/** Exchanges a refresh token for new tokens, or null when the session has ended. */
export const refreshTokens = async (refreshToken: string): Promise<AdminTokens | null> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: REFRESH_MUTATION,
        variables: { input: { refresh_token: refreshToken } },
      }),
      cache: "no-store",
    });
    const body = (await response.json()) as { data?: { adminRefresh?: AdminTokens } };
    return body.data?.adminRefresh ?? null;
  } catch {
    return null;
  }
};
