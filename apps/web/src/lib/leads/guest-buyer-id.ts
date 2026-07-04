export const BUYER_ID_KEY = "rsc:buyer-id";
export const BUYER_NAME_KEY = "rsc:buyer-name";

export function readGuestBuyerId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BUYER_ID_KEY);
}

export function clearGuestBuyerId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BUYER_ID_KEY);
}

export function getOrCreateGuestBuyerId() {
  const existing = readGuestBuyerId();
  if (existing) return existing;

  const id = `buyer_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(BUYER_ID_KEY, id);
  }
  return id;
}

export function readGuestBuyerName() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(BUYER_NAME_KEY);
}

export function writeGuestBuyerName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUYER_NAME_KEY, name.trim());
}

export function isGuestBuyerId(buyerId: string) {
  return buyerId.startsWith("buyer_");
}
