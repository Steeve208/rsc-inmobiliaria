"use client";

import { authClient } from "@/lib/auth-client";
import {
  getOrCreateGuestBuyerId,
  readGuestBuyerName,
  writeGuestBuyerName,
} from "@/lib/leads/guest-buyer-id";

/** Identidad del comprador: sesión autenticada o ID anónimo en localStorage. */
export function useBuyerIdentity() {
  const { data: session, isPending } = authClient.useSession();

  const buyerId = session?.user?.id ?? getOrCreateGuestBuyerId();
  const buyerName =
    session?.user?.name ?? readGuestBuyerName() ?? "";
  const buyerEmail = session?.user?.email ?? undefined;
  const isAuthenticated = Boolean(session?.user);

  function setBuyerName(name: string) {
    writeGuestBuyerName(name);
  }

  return {
    buyerId,
    buyerName,
    buyerEmail,
    isAuthenticated,
    isPending,
    setBuyerName,
  };
}

export function getBuyerName() {
  return readGuestBuyerName() ?? "";
}

export function setBuyerName(name: string) {
  writeGuestBuyerName(name);
}
