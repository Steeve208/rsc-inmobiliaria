import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { company } from "@/lib/db/schema";
import { isGuestBuyerId } from "@/lib/leads/guest-buyer-id";

export const GUEST_BUYER_COOKIE = "rsc_guest_buyer";

type SessionUser = {
  id: string;
  role?: string | null;
};

export type AuthActor = {
  userId: string | null;
  role: string | null;
  isAdmin: boolean;
};

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

  if (guestCookie && guestCookie !== buyerId) {
    return { ok: false, response: forbiddenResponse("guest_mismatch") };
  }

  if (!guestCookie) {
    cookieStore.set(GUEST_BUYER_COOKIE, buyerId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return { ok: true, actor, buyerId };
}

/** Backoffice → market server calls (e.g. company chat replies). */
export function isInternalMarketRequest(request: Request): boolean {
  const secret = process.env.MARKET_INTERNAL_API_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("x-market-internal-secret");
  return Boolean(header && header === secret);
}
