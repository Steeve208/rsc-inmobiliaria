import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { routing, type AppLocale } from "./lib/i18n/routing";
import {
  detectMarketFromHeaders,
  marketCookieOptions,
  MARKET_COOKIE,
} from "./lib/markets/server";
import { isMarketId } from "./lib/markets/config";
import { updateSession } from "./utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const localePathGroup = routing.locales.join("|");

function isAppLocale(value: string | undefined | null): value is AppLocale {
  return Boolean(value && routing.locales.includes(value as AppLocale));
}

function getLocaleFromRequest(request: NextRequest): AppLocale {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const locale of routing.locales) {
    if (acceptLanguage.includes(locale)) return locale;
  }

  return routing.defaultLocale;
}

const protectedPathPattern = new RegExp(
  `^/(${localePathGroup})/(dashboard|empresa/painel)(/|$)`,
);
/** Pages signed-in users should leave (not reset-password: email links may arrive with a session). */
const authPathPattern = new RegExp(
  `^/(${localePathGroup})/(entrar|cadastrar|recuperar-senha)(/|$)`,
);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const locale = getLocaleFromRequest(request);
    return updateSession(
      request,
      NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url)),
    );
  }

  if (protectedPathPattern.test(pathname) && !sessionCookie) {
    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    const signInUrl = new URL(`/${locale}/entrar`, request.url);
    return updateSession(request, NextResponse.redirect(signInUrl));
  }

  if (authPathPattern.test(pathname) && sessionCookie) {
    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    return updateSession(
      request,
      NextResponse.redirect(new URL(`/${locale}`, request.url)),
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
  matcher: ["/", "/dashboard", "/dashboard/:path*", "/(en|es|pt|fr|de|it|ar)/:path*"],
};
