"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";

type FavoriteEntry = {
  listingKind: "property" | "vehicle";
  listingId: string;
};

type FavoritesContextValue = {
  favorites: FavoriteEntry[];
  loading: boolean;
  isLoggedIn: boolean;
  count: number;
  refresh: () => Promise<void>;
  isFavorite: (listingKind: "property" | "vehicle", listingId: string) => boolean;
  toggle: (listingKind: "property" | "vehicle", listingId: string) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

async function fetchFavorites() {
  const res = await fetch("/api/favorites", { credentials: "include" });
  if (!res.ok) return [];
  return (await res.json()) as FavoriteEntry[];
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session?.user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      setFavorites(await fetchFavorites());
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
        (favorite) =>
          favorite.listingKind === listingKind &&
          favorite.listingId === listingId,
      ),
    [favorites],
  );

  const toggle = useCallback(
    async (listingKind: "property" | "vehicle", listingId: string) => {
      if (!session?.user) return false;

      const active = isFavorite(listingKind, listingId);

      setFavorites((current) => {
        if (active) {
          return current.filter(
            (favorite) =>
              !(
                favorite.listingKind === listingKind &&
                favorite.listingId === listingId
              ),
          );
        }

        return [...current, { listingKind, listingId }];
      });

      try {
        if (active) {
          const params = new URLSearchParams({ listingKind, listingId });
          const res = await fetch(`/api/favorites?${params}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error("delete_failed");
        } else {
          const res = await fetch("/api/favorites", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingKind, listingId }),
          });
          if (!res.ok) throw new Error("create_failed");
        }

        return true;
      } catch {
        await refresh();
        return false;
      }
    },
    [session?.user, isFavorite, refresh],
  );

  const value = useMemo(
    () => ({
      favorites,
      loading,
      isLoggedIn: Boolean(session?.user),
      count: favorites.length,
      refresh,
      isFavorite,
      toggle,
    }),
    [favorites, loading, session?.user, refresh, isFavorite, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
