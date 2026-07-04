"use client";

import { useFavorites } from "@/lib/providers/favorites-provider";

export { useFavorites };

export function useFavoriteButton(
  listingKind: "property" | "vehicle",
  listingId: string,
) {
  const { isFavorite, toggle } = useFavorites();

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    await toggle(listingKind, listingId);
  }

  return {
    active: isFavorite(listingKind, listingId),
    handleClick,
  };
}
