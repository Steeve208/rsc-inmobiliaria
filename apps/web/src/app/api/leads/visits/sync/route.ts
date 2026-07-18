import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  clearGuestBuyerCookie,
  requireMatchingGuestCookie,
} from "@/lib/auth/authorize";
import { syncGuestBuyerActivity } from "@/lib/buyer/sync-guest-activity";
import { isGuestBuyerId } from "@/lib/leads/guest-buyer-id";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "visits-sync", 20, 60_000);
  if (limited) return limited;

  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    guestBuyerId?: string;
  } | null;

  const guestBuyerId = body?.guestBuyerId?.trim();
  if (!guestBuyerId || !isGuestBuyerId(guestBuyerId)) {
    return NextResponse.json({ error: "invalid_guest_buyer_id" }, { status: 400 });
  }

  const cookieAccess = await requireMatchingGuestCookie(guestBuyerId);
  if (!cookieAccess.ok) return cookieAccess.response;

  const result = await syncGuestBuyerActivity(guestBuyerId, userId);
  await clearGuestBuyerCookie();

  return NextResponse.json({
    reassigned: result.visits,
    ...result,
  });
}
