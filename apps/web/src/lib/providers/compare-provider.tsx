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
  clearGuestCompareIds,
  readGuestCompareIds,
  removeGuestCompareId,
  toggleGuestCompareId,
} from "@/lib/compare/guest-storage";

type CompareContextValue = {
  ids: string[];
  loading: boolean;
  isLoggedIn: boolean;
  isSynced: boolean;
  toggle: (listingId: string) => Promise<string[]>;
  remove: (listingId: string) => Promise<string[]>;
  clear: () => Promise<void>;
  isCompared: (listingId: string) => boolean;
  canAdd: boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

const MAX_ITEMS = 3;

async function fetchServerCompareIds() {
  const res = await fetch("/api/compare/properties", { credentials: "include" });
  if (!res.ok) return [];
  const data = (await res.json()) as { listingIds?: string[] };
  return Array.isArray(data.listingIds) ? data.listingIds : [];
}

async function syncGuestCompareToServer(listingIds: string[]) {
  const res = await fetch("/api/compare/properties", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ listingIds }),
  });
  if (!res.ok) throw new Error("sync_failed");
  const data = (await res.json()) as { listingIds: string[] };
  return data.listingIds;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const syncedForUserRef = useRef<string | null>(null);

  const refreshGuest = useCallback(() => {
    setIds(readGuestCompareIds());
    setIsSynced(false);
  }, []);

  const refreshServer = useCallback(async () => {
    setLoading(true);
    try {
      setIds(await fetchServerCompareIds());
      setIsSynced(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const mergeGuestIntoAccount = useCallback(async (userId: string) => {
    if (syncedForUserRef.current === userId) {
      await refreshServer();
      return;
    }

    setLoading(true);
    try {
      const guestIds = readGuestCompareIds();
      const merged = guestIds.length
        ? await syncGuestCompareToServer(guestIds)
        : await fetchServerCompareIds();

      clearGuestCompareIds();
      setIds(merged);
      setIsSynced(true);
      syncedForUserRef.current = userId;
    } catch {
      await refreshServer();
    } finally {
      setLoading(false);
    }
  }, [refreshServer]);

  useEffect(() => {
    if (!session?.user) {
      syncedForUserRef.current = null;
      refreshGuest();
      return;
    }

    void mergeGuestIntoAccount(session.user.id);
  }, [session?.user, refreshGuest, mergeGuestIntoAccount]);

  const toggle = useCallback(
    async (listingId: string) => {
      if (!session?.user) {
        const next = toggleGuestCompareId(listingId);
        setIds(next);
        return next;
      }

      const previous = ids;
      setIds((current) => {
        if (current.includes(listingId)) {
          return current.filter((id) => id !== listingId);
        }
        if (current.length >= MAX_ITEMS) {
          return [...current.slice(1), listingId];
        }
        return [...current, listingId];
      });

      try {
        const res = await fetch("/api/compare/properties", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId }),
        });
        if (!res.ok) throw new Error("toggle_failed");
        const data = (await res.json()) as { listingIds: string[] };
        setIds(data.listingIds);
        return data.listingIds;
      } catch {
        setIds(previous);
        await refreshServer();
        return previous;
      }
    },
    [session?.user, ids, refreshServer],
  );

  const remove = useCallback(
    async (listingId: string) => {
      if (!session?.user) {
        const next = removeGuestCompareId(listingId);
        setIds(next);
        return next;
      }

      const previous = ids;
      setIds((current) => current.filter((id) => id !== listingId));

      try {
        const params = new URLSearchParams({ listingId });
        const res = await fetch(`/api/compare/properties?${params}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("remove_failed");
        const data = (await res.json()) as { listingIds: string[] };
        setIds(data.listingIds);
        return data.listingIds;
      } catch {
        setIds(previous);
        await refreshServer();
        return previous;
      }
    },
    [session?.user, ids, refreshServer],
  );

  const clear = useCallback(async () => {
    if (!session?.user) {
      clearGuestCompareIds();
      setIds([]);
      return;
    }

    setIds([]);
    try {
      const res = await fetch("/api/compare/properties", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("clear_failed");
    } catch {
      await refreshServer();
    }
  }, [session?.user, refreshServer]);

  const isCompared = useCallback((listingId: string) => ids.includes(listingId), [ids]);

  const value = useMemo(
    () => ({
      ids,
      loading,
      isLoggedIn: Boolean(session?.user),
      isSynced,
      toggle,
      remove,
      clear,
      isCompared,
      canAdd: ids.length < MAX_ITEMS,
    }),
    [ids, loading, session?.user, isSynced, toggle, remove, clear, isCompared],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompareContext() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompareContext must be used within CompareProvider");
  }
  return context;
}
