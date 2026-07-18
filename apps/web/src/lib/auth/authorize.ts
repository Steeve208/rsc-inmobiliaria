import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { company } from "@/lib/db/schema";
import { isGuestBuyerId } from "@/lib/leads/guest-buyer-id";

/** v2 name invalidates cookies claimed via the old auto-claim IDOR. */
export const GUEST_BUYER_COOKIE = "rsc_guest_buyer_v2";

type SessionUser = {
  id: string;
  role?: string | null;
};

export type AuthActor = {
  userId: string | null;
  role: string | null;
  isAdmin: boolean;
};

export function guestBuyerCookieOptions(maxAge = 60 * 60 * 24 * 365) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function getAuthActor(): Promise<AuthActor> {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as SessionUser | undefined;
  const role = user?.role ?? null;
  return {
    userId: user?.id ?? null,
    role,
    isAdmin: role === "admin",
  };
}

export function unauthorizedResponse(message = "unauthorized") {
  return Response.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "forbidden") {
  return Response.json({ error: message }, { status: 403 });
}

/** Company owner or platform admin. Session cookie alone is not enough. */
export async function requireCompanyAccess(companyId: string): Promise<
  | { ok: true; actor: AuthActor }
  | { ok: false; response: Response }
> {
  const actor = await getAuthActor();
  if (!actor.userId) {
    return { ok: false, response: unauthorizedResponse() };
  }

  if (actor.isAdmin) {
    return { ok: true, actor };
  }

  const [row] = await db
    .select({ ownerUserId: company.ownerUserId })
    .from(company)
    .where(eq(company.id, companyId))
    .limit(1);

  if (!row) {
    return { ok: false, response: Response.json({ error: "company_not_found" }, { status: 404 }) };
  }

  if (!row.ownerUserId || row.ownerUserId !== actor.userId) {
    return { ok: false, response: forbiddenResponse("not_company_owner") };
  }

  return { ok: true, actor };
}

export async function requireAdminAccess(): Promise<
  | { ok: true; actor: AuthActor }
  | { ok: false; response: Response }
> {
  const actor = await getAuthActor();
  if (!actor.userId) {
    return { ok: false, response: unauthorizedResponse() };
  }
  if (!actor.isAdmin) {
    return { ok: false, response: forbiddenResponse("admin_required") };
  }
  return { ok: true, actor };
}

/**
 * Buyer may only act as themselves (session id) or their claimed guest cookie.
 * Admins may act as any buyer.
 * Guest IDs are never auto-claimed from the request — cookie must already match.
 */
export async function requireBuyerAccess(buyerId: string): Promise<
  | { ok: true; actor: AuthActor; buyerId: string }
  | { ok: false; response: Response }
> {
  const actor = await getAuthActor();

  if (actor.isAdmin) {
    return { ok: true, actor, buyerId };
  }

  if (actor.userId) {
    if (actor.userId !== buyerId) {
      return { ok: false, response: forbiddenResponse("buyer_mismatch") };
    }
    return { ok: true, actor, buyerId };
  }

  if (!isGuestBuyerId(buyerId)) {
    return { ok: false, response: unauthorizedResponse() };
  }

  const cookieStore = await cookies();
  const guestCookie = cookieStore.get(GUEST_BUYER_COOKIE)?.value;

  if (!guestCookie) {
    return { ok: false, response: unauthorizedResponse("guest_cookie_required") };
  }

  if (guestCookie !== buyerId) {
    return { ok: false, response: forbiddenResponse("guest_mismatch") };
  }

  return { ok: true, actor, buyerId };
}

/**
 * Authenticated sync may only claim the guest ID bound to this browser's cookie.
 */
export async function requireMatchingGuestCookie(guestBuyerId: string): Promise<
  | { ok: true }
  | { ok: false; response: Response }
> {
  if (!isGuestBuyerId(guestBuyerId)) {
    return {
      ok: false,
      response: Response.json({ error: "invalid_guest_buyer_id" }, { status: 400 }),
    };
  }

  const cookieStore = await cookies();
  const guestCookie = cookieStore.get(GUEST_BUYER_COOKIE)?.value;

  if (!guestCookie) {
    return { ok: false, response: unauthorizedResponse("guest_cookie_required") };
  }

  if (guestCookie !== guestBuyerId) {
    return { ok: false, response: forbiddenResponse("guest_mismatch") };
  }

  return { ok: true };
}

export async function clearGuestBuyerCookie() {
  const cookieStore = await cookies();
  cookieStore.set(GUEST_BUYER_COOKIE, "", {
    ...guestBuyerCookieOptions(0),
    maxAge: 0,
  });
}

/** Backoffice → market server calls (e.g. company chat replies). */
export function isInternalMarketRequest(request: Request): boolean {
  const secret = process.env.MARKET_INTERNAL_API_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("x-market-internal-secret");
  return Boolean(header && header === secret);
}
