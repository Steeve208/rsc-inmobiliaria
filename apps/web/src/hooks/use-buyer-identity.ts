"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  ensureGuestBuyerId,
  readGuestBuyerId,
  readGuestBuyerName,
  writeGuestBuyerName,
} from "@/lib/leads/guest-buyer-id";

/** Identidad del comprador: sesión autenticada o ID anónimo bound a cookie httpOnly. */
export function useBuyerIdentity() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [guestBuyerId, setGuestBuyerId] = useState<string | null>(() =>
    typeof window !== "undefined" ? readGuestBuyerId() : null,
  );
  const [guestPending, setGuestPending] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setGuestPending(false);
      return;
    }

    let cancelled = false;
    setGuestPending(true);

    void ensureGuestBuyerId()
      .then((id) => {
        if (!cancelled) {
          setGuestBuyerId(id);
          setGuestPending(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGuestPending(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  const buyerId = session?.user?.id ?? guestBuyerId ?? "";
  const buyerName = session?.user?.name ?? readGuestBuyerName() ?? "";
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
    isPending: sessionPending || (!session?.user && guestPending && !guestBuyerId),
    setBuyerName,
  };
}

export function getBuyerName() {
  return readGuestBuyerName() ?? "";
}

export function setBuyerName(name: string) {
  writeGuestBuyerName(name);
}
