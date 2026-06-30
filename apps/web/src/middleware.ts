import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./lib/i18n/routing";
import {
  detectMarketFromHeaders,
  marketCookieOptions,
  MARKET_COOKIE,
} from "./lib/markets/server";
import { isMarketId } from "./lib/markets/config";
import { updateSession } from "./utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const protectedPathPattern =
  /^\/(en|es|pt)\/(dashboard|favoritos|empresa\/painel)(\/|$)/;
const authPathPattern = /^\/(en|es|pt)\/(entrar|cadastrar)(\/|$)/;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (protectedPathPattern.test(pathname) && !sessionCookie) {
    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    const signInUrl = new URL(`/${locale}/entrar`, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return updateSession(request, NextResponse.redirect(signInUrl));
  }

  if (authPathPattern.test(pathname) && sessionCookie) {
    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    return updateSession(
      request,
      NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url)),
    );
  }

  const response = intlMiddleware(request);
  const existingMarket = request.cookies.get(MARKET_COOKIE)?.value;

  if (!isMarketId(existingMarket)) {
    const detected = detectMarketFromHeaders(request.headers);
    response.cookies.set(MARKET_COOKIE, detected, marketCookieOptions());
  }

  return updateSession(request, response);
}

export const config = {
  matcher: ["/", "/(en|es|pt)/:path*"],
};
