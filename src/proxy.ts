import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  cookieOptions,
  REFRESH_COOKIE,
  REFRESH_MARGIN_SECONDS,
  refreshTokens,
  secondsLeft,
  SESSION_SECONDS,
} from "@/lib/server/session";

/**
 * Keeps the admin signed in: pages without a session go to /login, and an access token about to
 * expire is exchanged for a new one here (cookies can't be written from Server Components). The
 * new cookies go to the browser and to this same request, so the page renders with them.
 * Authorization itself is the API's job: every admin query checks the ADMIN role.
 */
export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  const toLogin = () => {
    const url = new URL("/login", request.url);
    const path = request.nextUrl.pathname;
    if (path !== "/") url.searchParams.set("next", path + request.nextUrl.search);
    const response = NextResponse.redirect(url);
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  };

  if (!refresh) return toLogin();
  if (secondsLeft(access) > REFRESH_MARGIN_SECONDS) return NextResponse.next();

  const tokens = await refreshTokens(refresh);
  if (!tokens) return toLogin();

  request.cookies.set(ACCESS_COOKIE, tokens.access_token);
  request.cookies.set(REFRESH_COOKIE, tokens.refresh_token);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(ACCESS_COOKIE, tokens.access_token, cookieOptions(tokens.expires_in));
  response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, cookieOptions(SESSION_SECONDS));
  return response;
}

export const config = {
  // Everything except sign-in and static files.
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
