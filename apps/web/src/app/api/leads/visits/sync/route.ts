import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { syncGuestBuyerActivity } from "@/lib/buyer/sync-guest-activity";
import { isGuestBuyerId } from "@/lib/leads/guest-buyer-id";

export async function POST(request: Request) {
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

  const result = await syncGuestBuyerActivity(guestBuyerId, userId);
  return NextResponse.json({
    reassigned: result.visits,
    ...result,
  });
}
