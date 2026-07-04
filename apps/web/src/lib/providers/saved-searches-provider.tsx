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
import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { veiculosFiltersToParams } from "@/lib/veiculos/search-params";
import {
  clearAllGuestSavedSearches,
  guestSavedSearchInputs,
  readGuestSavedSearches,
  removeGuestSavedSearch,
  saveGuestPropertySearch,
  saveGuestVehicleSearch,
} from "@/lib/saved-searches/guest-storage";
import type {
  SavedPropertySearch,
  SavedSearchAlertFrequency,
  SavedSearchVertical,
  SavedVehicleSearch,
} from "@/lib/saved-searches/types";

type SavedSearchesContextValue = {
  propertySearches: SavedPropertySearch[];
  vehicleSearches: SavedVehicleSearch[];
  loading: boolean;
  isLoggedIn: boolean;
  isSynced: boolean;
  savePropertySearch: (filters: ImoveisFilters, label?: string) => SavedPropertySearch;
  saveVehicleSearch: (filters: VeiculosFilters, label?: string) => SavedVehicleSearch;
  removeSearch: (id: string, vertical: SavedSearchVertical) => Promise<void>;
  updateSearchAlerts: (
    id: string,
    prefs: {
      alertsEnabled?: boolean;
      alertFrequency?: SavedSearchAlertFrequency;
      alertLocale?: string;
    },
  ) => Promise<SavedPropertySearch | SavedVehicleSearch | null>;
};

const SavedSearchesContext = createContext<SavedSearchesContextValue | null>(null);

async function fetchServerSearches(vertical?: SavedSearchVertical) {
  const params = vertical ? `?vertical=${vertical}` : "";
  const res = await fetch(`/api/saved-searches${params}`, { credentials: "include" });
  if (!res.ok) return [];
  return (await res.json()) as Array<SavedPropertySearch | SavedVehicleSearch>;
}

async function syncGuestSearchesToServer() {
  const res = await fetch("/api/saved-searches", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: guestSavedSearchInputs() }),
  });
  if (!res.ok) throw new Error("sync_failed");
  return (await res.json()) as Array<SavedPropertySearch | SavedVehicleSearch>;
}

async function createServerSearch(
  vertical: SavedSearchVertical,
  filters: ImoveisFilters | VeiculosFilters,
  label: string,
) {
  const res = await fetch("/api/saved-searches", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, filters, vertical }),
  });
  if (!res.ok) throw new Error("create_failed");
  return (await res.json()) as SavedPropertySearch | SavedVehicleSearch;
}

async function patchServerSearchAlerts(
  id: string,
  prefs: {
    alertsEnabled?: boolean;
    alertFrequency?: SavedSearchAlertFrequency;
    alertLocale?: string;
  },
) {
  const res = await fetch("/api/saved-searches", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...prefs }),
  });
  if (!res.ok) throw new Error("patch_failed");
  return (await res.json()) as SavedPropertySearch | SavedVehicleSearch;
}

function buildPropertyLabel(filters: ImoveisFilters, label?: string) {
  if (label?.trim()) return label.trim();
  const params = imoveisFiltersToParams(filters);
  return filters.locationLabel || filters.city || params.toString() || "Saved search";
}

function buildVehicleLabel(filters: VeiculosFilters, label?: string) {
  if (label?.trim()) return label.trim();
  const params = veiculosFiltersToParams(filters);
  return filters.locationLabel || filters.city || params.toString() || "Saved search";
}

function splitSearches(searches: Array<SavedPropertySearch | SavedVehicleSearch>) {
  const propertySearches: SavedPropertySearch[] = [];
  const vehicleSearches: SavedVehicleSearch[] = [];

  for (const search of searches) {
    if (search.vertical === "vehicle") {
      vehicleSearches.push(search);
    } else {
      propertySearches.push(search);
    }
  }

  return { propertySearches, vehicleSearches };
}

export function SavedSearchesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [propertySearches, setPropertySearches] = useState<SavedPropertySearch[]>([]);
  const [vehicleSearches, setVehicleSearches] = useState<SavedVehicleSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const syncedForUserRef = useRef<string | null>(null);

  const refreshGuest = useCallback(() => {
    setPropertySearches(readGuestSavedSearches("property") as SavedPropertySearch[]);
    setVehicleSearches(readGuestSavedSearches("vehicle") as SavedVehicleSearch[]);
    setIsSynced(false);
  }, []);

  const refreshServer = useCallback(async () => {
    setLoading(true);
    try {
      const [property, vehicle] = await Promise.all([
        fetchServerSearches("property"),
        fetchServerSearches("vehicle"),
      ]);
      setPropertySearches(property as SavedPropertySearch[]);
      setVehicleSearches(vehicle as SavedVehicleSearch[]);
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
      const guestItems = guestSavedSearchInputs();
      const merged = guestItems.length
        ? await syncGuestSearchesToServer()
        : await fetchServerSearches();

      clearAllGuestSavedSearches();
      const split = splitSearches(merged);
      setPropertySearches(split.propertySearches);
      setVehicleSearches(split.vehicleSearches);
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

  const savePropertySearch = useCallback(
    (filters: ImoveisFilters, label?: string) => {
      const autoLabel = buildPropertyLabel(filters, label);

      if (!session?.user) {
        const entry = saveGuestPropertySearch(filters, autoLabel);
        setPropertySearches(readGuestSavedSearches("property") as SavedPropertySearch[]);
        return entry;
      }

      const optimistic: SavedPropertySearch = {
        id: `search_${Date.now().toString(36)}`,
        label: autoLabel,
        vertical: "property",
        filters,
        savedAt: new Date().toISOString(),
        alertsEnabled: false,
        alertFrequency: "daily",
        alertLocale: "pt",
        notifiedListingIds: [],
      };

      setPropertySearches((current) =>
        [optimistic, ...current.filter((search) => search.label !== autoLabel)].slice(0, 10),
      );

      void createServerSearch("property", filters, autoLabel)
        .then((saved) => {
          if (saved.vertical !== "property") return;
          setPropertySearches((current) => {
            const withoutOptimistic = current.filter((search) => search.id !== optimistic.id);
            return [saved, ...withoutOptimistic.filter((search) => search.label !== saved.label)].slice(
              0,
              10,
            );
          });
        })
        .catch(() => {
          void refreshServer();
        });

      return optimistic;
    },
    [session?.user, refreshServer],
  );

  const saveVehicleSearch = useCallback(
    (filters: VeiculosFilters, label?: string) => {
      const autoLabel = buildVehicleLabel(filters, label);

      if (!session?.user) {
        const entry = saveGuestVehicleSearch(filters, autoLabel);
        setVehicleSearches(readGuestSavedSearches("vehicle") as SavedVehicleSearch[]);
        return entry;
      }

      const optimistic: SavedVehicleSearch = {
        id: `search_${Date.now().toString(36)}`,
        label: autoLabel,
        vertical: "vehicle",
        filters,
        savedAt: new Date().toISOString(),
        alertsEnabled: false,
        alertFrequency: "daily",
        alertLocale: "pt",
        notifiedListingIds: [],
      };

      setVehicleSearches((current) =>
        [optimistic, ...current.filter((search) => search.label !== autoLabel)].slice(0, 10),
      );

      void createServerSearch("vehicle", filters, autoLabel)
        .then((saved) => {
          if (saved.vertical !== "vehicle") return;
          setVehicleSearches((current) => {
            const withoutOptimistic = current.filter((search) => search.id !== optimistic.id);
            return [saved, ...withoutOptimistic.filter((search) => search.label !== saved.label)].slice(
              0,
              10,
            );
          });
        })
        .catch(() => {
          void refreshServer();
        });

      return optimistic;
    },
    [session?.user, refreshServer],
  );

  const removeSearch = useCallback(
    async (id: string, vertical: SavedSearchVertical) => {
      if (!session?.user) {
        if (vertical === "vehicle") {
          setVehicleSearches(removeGuestSavedSearch("vehicle", id) as SavedVehicleSearch[]);
        } else {
          setPropertySearches(removeGuestSavedSearch("property", id) as SavedPropertySearch[]);
        }
        return;
      }

      const previousProperty = propertySearches;
      const previousVehicle = vehicleSearches;

      if (vertical === "vehicle") {
        setVehicleSearches((current) => current.filter((search) => search.id !== id));
      } else {
        setPropertySearches((current) => current.filter((search) => search.id !== id));
      }

      try {
        const params = new URLSearchParams({ id });
        const res = await fetch(`/api/saved-searches?${params}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error("delete_failed");
      } catch {
        setPropertySearches(previousProperty);
        setVehicleSearches(previousVehicle);
      }
    },
    [session?.user, propertySearches, vehicleSearches],
  );

  const updateSearchAlerts = useCallback(
    async (
      id: string,
      prefs: {
        alertsEnabled?: boolean;
        alertFrequency?: SavedSearchAlertFrequency;
        alertLocale?: string;
      },
    ) => {
      if (!session?.user) return null;

      const previousProperty = propertySearches;
      const previousVehicle = vehicleSearches;

      const patch = (search: SavedPropertySearch | SavedVehicleSearch) =>
        search.id === id
          ? {
              ...search,
              ...prefs,
              ...(prefs.alertsEnabled === true && !search.alertsEnabled
                ? { lastAlertAt: new Date().toISOString() }
                : {}),
            }
          : search;

      setPropertySearches((current) => current.map(patch) as SavedPropertySearch[]);
      setVehicleSearches((current) => current.map(patch) as SavedVehicleSearch[]);

      try {
        const updated = await patchServerSearchAlerts(id, prefs);
        if (updated.vertical === "vehicle") {
          setVehicleSearches((current) =>
            current.map((search) => (search.id === id ? (updated as SavedVehicleSearch) : search)),
          );
        } else {
          setPropertySearches((current) =>
            current.map((search) => (search.id === id ? (updated as SavedPropertySearch) : search)),
          );
        }
        return updated;
      } catch {
        setPropertySearches(previousProperty);
        setVehicleSearches(previousVehicle);
        return null;
      }
    },
    [session?.user, propertySearches, vehicleSearches],
  );

  const value = useMemo(
    () => ({
      propertySearches,
      vehicleSearches,
      loading,
      isLoggedIn: Boolean(session?.user),
      isSynced,
      savePropertySearch,
      saveVehicleSearch,
      removeSearch,
      updateSearchAlerts,
    }),
    [
      propertySearches,
      vehicleSearches,
      loading,
      session?.user,
      isSynced,
      savePropertySearch,
      saveVehicleSearch,
      removeSearch,
      updateSearchAlerts,
    ],
  );

  return (
    <SavedSearchesContext.Provider value={value}>
      {children}
    </SavedSearchesContext.Provider>
  );
}

function useSavedSearchesContext() {
  const context = useContext(SavedSearchesContext);
  if (!context) {
    throw new Error("Saved searches hooks must be used within SavedSearchesProvider");
  }
  return context;
}

export function useSavedPropertySearches() {
  const ctx = useSavedSearchesContext();
  return {
    searches: ctx.propertySearches,
    loading: ctx.loading,
    isLoggedIn: ctx.isLoggedIn,
    isSynced: ctx.isSynced,
    saveSearch: ctx.savePropertySearch,
    removeSearch: (id: string) => ctx.removeSearch(id, "property"),
    updateSearchAlerts: ctx.updateSearchAlerts,
  };
}

export function useSavedVehicleSearches() {
  const ctx = useSavedSearchesContext();
  return {
    searches: ctx.vehicleSearches,
    loading: ctx.loading,
    isLoggedIn: ctx.isLoggedIn,
    isSynced: ctx.isSynced,
    saveSearch: ctx.saveVehicleSearch,
    removeSearch: (id: string) => ctx.removeSearch(id, "vehicle"),
    updateSearchAlerts: ctx.updateSearchAlerts,
  };
}
