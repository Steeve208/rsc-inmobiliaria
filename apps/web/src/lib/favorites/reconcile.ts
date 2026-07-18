import { fetchFavoriteListings } from "@/lib/favorites/listings-client";
import type { GuestFavorite } from "@/lib/favorites/guest-storage";

/**
 * Only removes favorites confirmed missing by the catalog API.
 * Transport/backoffice failures leave IDs untouched.
 */
export async function findResolvableFavorites(
  items: GuestFavorite[],
): Promise<{ kept: GuestFavorite[]; removed: GuestFavorite[] }> {
  if (items.length === 0) {
    return { kept: [], removed: [] };
  }

  try {
    const { missing } = await fetchFavoriteListings(items);
    if (missing.length === 0) {
      return { kept: items, removed: [] };
    }

    const missingKeys = new Set(
      missing.map((item) => `${item.listingKind}:${item.listingId}`),
    );
    const removed = items.filter((item) =>
      missingKeys.has(`${item.listingKind}:${item.listingId}`),
    );
    const kept = items.filter(
      (item) => !missingKeys.has(`${item.listingKind}:${item.listingId}`),
    );
    return { kept, removed };
  } catch {
    return { kept: items, removed: [] };
  }
}

export async function deleteServerFavorites(items: GuestFavorite[]) {
  await Promise.all(
    items.map(async (item) => {
      const params = new URLSearchParams({
        listingKind: item.listingKind,
        listingId: item.listingId,
      });
      await fetch(`/api/favorites?${params}`, {
        method: "DELETE",
        credentials: "include",
      });
    }),
  );
}
