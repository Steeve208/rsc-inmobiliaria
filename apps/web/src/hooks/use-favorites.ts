"use client";

import { useFavorites } from "@/lib/providers/favorites-provider";
import { useRouter } from "@/lib/i18n/routing";

export { useFavorites };

export function useFavoriteButton(
  listingKind: "property" | "vehicle",
  listingId: string,
) {
  const router = useRouter();
  const { isFavorite, toggle, isLoggedIn } = useFavorites();

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
    active: isFavorite(listingKind, listingId),
    handleClick,
  };
}
