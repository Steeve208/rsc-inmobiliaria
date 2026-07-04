export type GuestFavorite = {
  listingKind: "property" | "vehicle";
  listingId: string;
};

const STORAGE_KEY = "rsc_guest_favorites";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readGuestFavorites(): GuestFavorite[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestFavorite[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        (item.listingKind === "property" || item.listingKind === "vehicle") &&
        typeof item.listingId === "string" &&
        item.listingId.length > 0,
    );
  } catch {
    return [];
  }
}

export function writeGuestFavorites(items: GuestFavorite[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearGuestFavorites() {
  if (!canUseStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function toggleGuestFavorite(
  listingKind: "property" | "vehicle",
  listingId: string,
): GuestFavorite[] {
  const current = readGuestFavorites();
  const exists = current.some(
    (item) => item.listingKind === listingKind && item.listingId === listingId,
  );

  const next = exists
    ? current.filter(
        (item) =>
          !(item.listingKind === listingKind && item.listingId === listingId),
      )
    : [...current, { listingKind, listingId }];

  writeGuestFavorites(next);
  return next;
}

export function isGuestFavorite(
  listingKind: "property" | "vehicle",
  listingId: string,
) {
  return readGuestFavorites().some(
    (item) => item.listingKind === listingKind && item.listingId === listingId,
  );
}
