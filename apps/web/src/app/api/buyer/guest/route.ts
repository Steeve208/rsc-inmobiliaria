import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  GUEST_BUYER_COOKIE,
  guestBuyerCookieOptions,
} from "@/lib/auth/authorize";
import {
  createGuestBuyerId,
  isGuestBuyerId,
} from "@/lib/leads/guest-buyer-id";
import { enforceRateLimit } from "@/lib/security/rate-limit";

/**
 * Issue or return the httpOnly guest buyer cookie.
 * Never accepts a client-supplied ID — prevents IDOR claim attacks.
 */
export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "buyer-guest", 30, 60_000);
  if (limited) return limited;

  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_BUYER_COOKIE)?.value;

  if (existing && isGuestBuyerId(existing)) {
    return NextResponse.json({ buyerId: existing });
  }

  const buyerId = createGuestBuyerId();
  cookieStore.set(GUEST_BUYER_COOKIE, buyerId, guestBuyerCookieOptions());

  return NextResponse.json({ buyerId }, { status: 201 });
}

export async function GET() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_BUYER_COOKIE)?.value;

  if (!existing || !isGuestBuyerId(existing)) {
    return NextResponse.json({ error: "guest_cookie_required" }, { status: 404 });
  }

  return NextResponse.json({ buyerId: existing });
}
