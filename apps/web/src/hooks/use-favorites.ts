"use client";

import { useFavorites } from "@/lib/providers/favorites-provider";
import { useRouter } from "@/lib/i18n/routing";

export { useFavorites };

export function useFavoriteButton(
  listingKind: "property" | "vehicle",
  listingId: string,
) {
  const { isFavorite, toggle, isLoggedIn } = useFavorites();
  const router = useRouter();

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      router.push("/entrar");
      return;
    }

    await toggle(listingKind, listingId);
  }

  return {
    active: isLoggedIn ? isFavorite(listingKind, listingId) : false,
    handleClick,
    requiresAuth: !isLoggedIn,
  };
}
