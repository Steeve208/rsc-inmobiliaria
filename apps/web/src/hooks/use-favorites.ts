"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/lib/i18n/routing";

export function useFavorites() {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<
    { listingKind: "property" | "vehicle"; listingId: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = (await res.json()) as {
          listingKind: "property" | "vehicle";
          listingId: string;
        }[];
        setFavorites(data);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isFavorite = useCallback(
    (listingKind: "property" | "vehicle", listingId: string) =>
      favorites.some(
        (f) => f.listingKind === listingKind && f.listingId === listingId,
      ),
    [favorites],
  );

  const toggle = useCallback(
    async (listingKind: "property" | "vehicle", listingId: string) => {
      if (!session?.user) return false;

      const active = isFavorite(listingKind, listingId);
      if (active) {
        const params = new URLSearchParams({ listingKind, listingId });
        await fetch(`/api/favorites?${params}`, { method: "DELETE" });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingKind, listingId }),
        });
      }
      await refresh();
      return true;
    },
    [session?.user, isFavorite, refresh],
  );

  return { favorites, loading, isFavorite, toggle, refresh, isLoggedIn: Boolean(session?.user) };
}

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
      router.push(`/entrar?callbackUrl=/dashboard`);
      return;
    }
    await toggle(listingKind, listingId);
  }

  return {
    active: isFavorite(listingKind, listingId),
    handleClick,
  };
}
