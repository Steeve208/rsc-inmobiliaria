"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";
import {
  clearGuestFavorites,
  readGuestFavorites,
  toggleGuestFavorite,
  writeGuestFavorites,
  type GuestFavorite,
} from "@/lib/favorites/guest-storage";
import {
  deleteServerFavorites,
  findResolvableFavorites,
} from "@/lib/favorites/reconcile";
import { trackListingEvent } from "@/lib/listings/analytics-client";

type FavoriteEntry = GuestFavorite;

type FavoritesContextValue = {
  favorites: FavoriteEntry[];
  loading: boolean;
  isLoggedIn: boolean;
  isSynced: boolean;
  count: number;
  refresh: () => Promise<void>;
  isFavorite: (listingKind: "property" | "vehicle", listingId: string) => boolean;
  toggle: (listingKind: "property" | "vehicle", listingId: string) => Promise<boolean>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function favoriteKey(item: FavoriteEntry) {
  return `${item.listingKind}:${item.listingId}`;
}

async function fetchServerFavorites() {
  const res = await fetch("/api/favorites", { credentials: "include" });
  if (!res.ok) return [];
  return (await res.json()) as FavoriteEntry[];
}

async function syncGuestFavoritesToServer(items: FavoriteEntry[]) {
  const res = await fetch("/api/favorites", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error("sync_failed");
  return (await res.json()) as FavoriteEntry[];
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const syncedForUserRef = useRef<string | null>(null);
  const reconcileGenRef = useRef(0);

  const isLoggedIn = Boolean(session?.user);

  const applyRemovedFavorites = useCallback((removed: FavoriteEntry[]) => {
    if (removed.length === 0) return;
    const removedKeys = new Set(removed.map(favoriteKey));
    setFavorites((current) =>
      current.filter((item) => !removedKeys.has(favoriteKey(item))),
    );
  }, []);

  const reconcileFavorites = useCallback(
    async (
      items: FavoriteEntry[],
      mode: "guest" | "server",
    ) => {
      const gen = ++reconcileGenRef.current;
      const { kept, removed } = await findResolvableFavorites(items);
      if (gen !== reconcileGenRef.current) return;

      if (removed.length === 0) return;

      if (mode === "guest") {
        writeGuestFavorites(kept);
      } else {
        void deleteServerFavorites(removed);
      }

      applyRemovedFavorites(removed);
    },
    [applyRemovedFavorites],
  );

  const refreshGuest = useCallback(() => {
    const guestItems = readGuestFavorites();
    setFavorites(guestItems);
    setIsSynced(false);
    void reconcileFavorites(guestItems, "guest");
  }, [reconcileFavorites]);

  const refreshServer = useCallback(async () => {
    setLoading(true);
    try {
      const items = await fetchServerFavorites();
      setFavorites(items);
      setIsSynced(true);
      void reconcileFavorites(items, "server");
    } finally {
      setLoading(false);
    }
  }, [reconcileFavorites]);

  const mergeGuestIntoAccount = useCallback(async (userId: string) => {
    if (syncedForUserRef.current === userId) {
      await refreshServer();
      return;
    }

    setLoading(true);
    try {
      const guestItems = readGuestFavorites();
      const merged = guestItems.length
        ? await syncGuestFavoritesToServer(guestItems)
        : await fetchServerFavorites();

      clearGuestFavorites();
      setFavorites(merged);
      setIsSynced(true);
      syncedForUserRef.current = userId;
      void reconcileFavorites(merged, "server");
    } catch {
      await refreshServer();
    } finally {
      setLoading(false);
    }
  }, [refreshServer, reconcileFavorites]);

  useEffect(() => {
    if (!session?.user) {
      syncedForUserRef.current = null;
      refreshGuest();
      return;
    }

    void mergeGuestIntoAccount(session.user.id);
  }, [session?.user, refreshGuest, mergeGuestIntoAccount]);

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
      const active = isFavorite(listingKind, listingId);

      if (!session?.user) {
        const next = toggleGuestFavorite(listingKind, listingId);
        setFavorites(next);
        if (!active) {
          void trackListingEvent(listingId, "favorite");
        }
        return true;
      }

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
        await refreshServer();
        return false;
      }
    },
    [session?.user, isFavorite, refreshServer],
  );

  const refresh = useCallback(async () => {
    if (session?.user) {
      await refreshServer();
      return;
    }
    refreshGuest();
  }, [session?.user, refreshGuest, refreshServer]);

  const value = useMemo(
    () => ({
      favorites,
      loading,
      isLoggedIn,
      isSynced,
      count: favorites.length,
      refresh,
      isFavorite,
      toggle,
    }),
    [favorites, loading, isLoggedIn, isSynced, refresh, isFavorite, toggle],
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
