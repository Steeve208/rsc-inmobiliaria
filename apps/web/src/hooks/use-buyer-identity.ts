"use client";

import { authClient } from "@/lib/auth-client";

const BUYER_ID_KEY = "rsc:buyer-id";
const BUYER_NAME_KEY = "rsc:buyer-name";

function readLocal(key: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function writeLocal(key: string, value: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function anonymousBuyerId() {
  const existing = readLocal(BUYER_ID_KEY);
  if (existing) return existing;
  const id = `buyer_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  writeLocal(BUYER_ID_KEY, id);
  return id;
}

/** Identidad del comprador: sesión autenticada o ID anónimo en localStorage. */
export function useBuyerIdentity() {
  const { data: session, isPending } = authClient.useSession();

  const buyerId = session?.user?.id ?? anonymousBuyerId();
  const buyerName =
    session?.user?.name ?? readLocal(BUYER_NAME_KEY) ?? "";
  const buyerEmail = session?.user?.email ?? undefined;
  const isAuthenticated = Boolean(session?.user);

  function setBuyerName(name: string) {
    writeLocal(BUYER_NAME_KEY, name.trim());
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
  return readLocal(BUYER_NAME_KEY) ?? "";
}

export function setBuyerName(name: string) {
  writeLocal(BUYER_NAME_KEY, name.trim());
}
