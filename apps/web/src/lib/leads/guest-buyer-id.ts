export const BUYER_ID_KEY = "rsc:buyer-id";
export const BUYER_NAME_KEY = "rsc:buyer-name";

/** Opaque guest IDs issued by the server: buyer_<uuid> */
const GUEST_BUYER_UUID_RE =
  /^buyer_[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Legacy client-generated IDs: buyer_<timestamp>_<rand> */
const GUEST_BUYER_LEGACY_RE = /^buyer_\d{10,16}_[a-z0-9]{5,12}$/i;

export function createGuestBuyerId() {
  return `buyer_${crypto.randomUUID()}`;
}

export function isGuestBuyerId(buyerId: string) {
  return GUEST_BUYER_UUID_RE.test(buyerId) || GUEST_BUYER_LEGACY_RE.test(buyerId);
}

export function readGuestBuyerId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BUYER_ID_KEY);
}

export function writeGuestBuyerId(buyerId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUYER_ID_KEY, buyerId);
}

export function clearGuestBuyerId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BUYER_ID_KEY);
}

let ensureInFlight: Promise<string> | null = null;

/**
 * Ensures a server-bound guest buyer cookie exists and returns its ID.
 * The httpOnly cookie is the source of truth — localStorage is only a cache.
 */
export async function ensureGuestBuyerId(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("ensureGuestBuyerId is client-only");
  }

  if (ensureInFlight) return ensureInFlight;

  ensureInFlight = (async () => {
    const res = await fetch("/api/buyer/guest", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("guest_session_failed");
    }

    const data = (await res.json()) as { buyerId?: string };
    if (!data.buyerId || !isGuestBuyerId(data.buyerId)) {
      throw new Error("invalid_guest_buyer_id");
    }

    writeGuestBuyerId(data.buyerId);
    return data.buyerId;
  })().finally(() => {
    ensureInFlight = null;
  });

  return ensureInFlight;
}

/** @deprecated Prefer ensureGuestBuyerId — sync create is no longer trusted by the API. */
export function getOrCreateGuestBuyerId() {
  const existing = readGuestBuyerId();
  if (existing && isGuestBuyerId(existing)) return existing;
  return "";
}

export function readGuestBuyerName() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BUYER_NAME_KEY);
}

export function writeGuestBuyerName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUYER_NAME_KEY, name.trim());
}
