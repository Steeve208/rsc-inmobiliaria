"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";
import {
  clearGuestBuyerId,
  readGuestBuyerId,
} from "@/lib/leads/guest-buyer-id";
import type { GuestBuyerSyncResult } from "@/lib/buyer/sync-guest-activity";

type BuyerActivitySyncContextValue = {
  syncVersion: number;
  isSynced: boolean;
  lastSync: GuestBuyerSyncResult | null;
};

const BuyerActivitySyncContext = createContext<BuyerActivitySyncContextValue | null>(
  null,
);

async function syncGuestBuyerActivity(guestBuyerId: string) {
  const res = await fetch("/api/buyer/sync-guest", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestBuyerId }),
  });

  if (!res.ok) throw new Error("sync_failed");
  return (await res.json()) as GuestBuyerSyncResult;
}

export function BuyerActivitySyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = authClient.useSession();
  const [syncVersion, setSyncVersion] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const [lastSync, setLastSync] = useState<GuestBuyerSyncResult | null>(null);
  const syncedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      syncedForUserRef.current = null;
      setIsSynced(false);
      setLastSync(null);
      return;
    }

    const userId = session.user.id;
    if (syncedForUserRef.current === userId) {
      setIsSynced(true);
      return;
    }

    let cancelled = false;

    async function runSync() {
      const guestBuyerId = readGuestBuyerId();
      if (!guestBuyerId || guestBuyerId === userId) {
        if (!cancelled) {
          syncedForUserRef.current = userId;
          setIsSynced(true);
        }
        return;
      }

      try {
        const result = await syncGuestBuyerActivity(guestBuyerId);
        clearGuestBuyerId();
        if (!cancelled) {
          syncedForUserRef.current = userId;
          setIsSynced(true);
          setLastSync(result);
          setSyncVersion((value) => value + 1);
        }
      } catch {
        if (!cancelled) {
          setIsSynced(false);
        }
      }
    }

    void runSync();

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  const value = useMemo(
    () => ({ syncVersion, isSynced, lastSync }),
    [syncVersion, isSynced, lastSync],
  );

  return (
    <BuyerActivitySyncContext.Provider value={value}>
      {children}
    </BuyerActivitySyncContext.Provider>
  );
}

export function useBuyerActivitySync() {
  const context = useContext(BuyerActivitySyncContext);
  if (!context) {
    throw new Error(
      "useBuyerActivitySync must be used within BuyerActivitySyncProvider",
    );
  }
  return context;
}

/** @deprecated Use useBuyerActivitySync */
export function useVisitsSync() {
  return useBuyerActivitySync();
}

/** @deprecated Use BuyerActivitySyncProvider */
export const VisitsSyncProvider = BuyerActivitySyncProvider;
