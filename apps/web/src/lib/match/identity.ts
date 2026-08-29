import { cookies } from "next/headers";
import { getMarketOrDefault, isMarketId } from "@/lib/markets/config";
import { MARKET_COOKIE } from "@/lib/markets/constants";
import {
  GUEST_BUYER_COOKIE,
  getAuthActor,
  guestBuyerCookieOptions,
} from "@/lib/auth/authorize";
import { createGuestBuyerId, isGuestBuyerId } from "@/lib/leads/guest-buyer-id";
import type { MarketConfig } from "@/lib/markets/types";

export type MatchActor = {
  userId: string | null;
  guestId: string | null;
  isAdmin: boolean;
};

export async function resolveMatchActor(options?: {
  issueGuest?: boolean;
}): Promise<MatchActor> {
  const actor = await getAuthActor();
  if (actor.userId) {
    return { userId: actor.userId, guestId: null, isAdmin: actor.isAdmin };
  }

  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_BUYER_COOKIE)?.value;
  if (existing && isGuestBuyerId(existing)) {
    return { userId: null, guestId: existing, isAdmin: false };
  }

  if (!options?.issueGuest) {
    return { userId: null, guestId: null, isAdmin: false };
  }

  const guestId = createGuestBuyerId();
  cookieStore.set(GUEST_BUYER_COOKIE, guestId, guestBuyerCookieOptions());
  return { userId: null, guestId, isAdmin: false };
}

export async function resolveMarketFromCookies(): Promise<MarketConfig> {
  const cookieStore = await cookies();
  const marketCookie = cookieStore.get(MARKET_COOKIE)?.value;
  return getMarketOrDefault(isMarketId(marketCookie) ? marketCookie : null);
}

export function canAccessConversation(
  actor: MatchActor,
  conversation: { userId: string | null; guestId: string | null },
) {
  if (actor.isAdmin) return true;
  if (actor.userId && conversation.userId === actor.userId) return true;
  if (actor.guestId && conversation.guestId === actor.guestId) return true;
  return false;
}
