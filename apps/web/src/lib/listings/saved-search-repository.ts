import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { savedSearch, user } from "@/lib/db/schema";
import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";
import type {
  CreateSavedSearchInput,
  SavedPropertySearch,
  SavedSearchAlertFrequency,
  SavedSearchVertical,
  SavedVehicleSearch,
  UpdateSavedSearchAlertsInput,
} from "@/lib/saved-searches/types";
import { MAX_SAVED_SEARCHES } from "@/lib/saved-searches/types";

type Row = typeof savedSearch.$inferSelect;

const MAX_NOTIFIED_IDS = 200;

function newId() {
  return `search_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeNotifiedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((id): id is string => typeof id === "string" && id.length > 0);
}

function mapRow(row: Row): SavedPropertySearch | SavedVehicleSearch {
  const base = {
    id: row.id,
    label: row.label,
    savedAt: row.createdAt.toISOString(),
    alertsEnabled: row.alertsEnabled,
    alertFrequency: row.alertFrequency as SavedSearchAlertFrequency,
    alertLocale: row.alertLocale ?? "pt",
    lastAlertAt: row.lastAlertAt?.toISOString(),
    notifiedListingIds: normalizeNotifiedIds(row.notifiedListingIds),
  };

  if (row.vertical === "vehicle") {
    return {
      ...base,
      vertical: "vehicle",
      filters: row.filters as VeiculosFilters,
    };
  }

  return {
    ...base,
    vertical: "property",
    filters: row.filters as ImoveisFilters,
  };
}

async function trimToMax(userId: string, vertical: SavedSearchVertical) {
  const rows = await db
    .select({ id: savedSearch.id })
    .from(savedSearch)
    .where(and(eq(savedSearch.userId, userId), eq(savedSearch.vertical, vertical)))
    .orderBy(desc(savedSearch.createdAt));

  if (rows.length <= MAX_SAVED_SEARCHES) return;

  const excessIds = rows.slice(MAX_SAVED_SEARCHES).map((row) => row.id);
  for (const id of excessIds) {
    await db.delete(savedSearch).where(eq(savedSearch.id, id));
  }
}

export async function listSavedSearches(
  userId: string,
  vertical?: SavedSearchVertical,
): Promise<Array<SavedPropertySearch | SavedVehicleSearch>> {
  const conditions = vertical
    ? and(eq(savedSearch.userId, userId), eq(savedSearch.vertical, vertical))
    : eq(savedSearch.userId, userId);

  const rows = await db
    .select()
    .from(savedSearch)
    .where(conditions)
    .orderBy(desc(savedSearch.createdAt))
    .limit(vertical ? MAX_SAVED_SEARCHES : MAX_SAVED_SEARCHES * 2);

  return rows.map(mapRow);
}

export async function getSavedSearchById(
  userId: string,
  id: string,
): Promise<SavedPropertySearch | SavedVehicleSearch | null> {
  const [row] = await db
    .select()
    .from(savedSearch)
    .where(and(eq(savedSearch.userId, userId), eq(savedSearch.id, id)))
    .limit(1);

  return row ? mapRow(row) : null;
}

export async function createSavedSearch(
  userId: string,
  input: CreateSavedSearchInput,
): Promise<SavedPropertySearch | SavedVehicleSearch> {
  await db
    .delete(savedSearch)
    .where(
      and(
        eq(savedSearch.userId, userId),
        eq(savedSearch.vertical, input.vertical),
        eq(savedSearch.label, input.label),
      ),
    );

  const [row] = await db
    .insert(savedSearch)
    .values({
      id: newId(),
      userId,
      vertical: input.vertical,
      label: input.label,
      filters: input.filters,
      alertsEnabled: input.alertsEnabled ?? false,
      alertFrequency: input.alertFrequency ?? "daily",
      alertLocale: input.alertLocale ?? "pt",
      notifiedListingIds: [],
    })
    .returning();

  await trimToMax(userId, input.vertical);
  return mapRow(row);
}

export async function updateSavedSearchAlerts(
  userId: string,
  id: string,
  input: UpdateSavedSearchAlertsInput,
): Promise<SavedPropertySearch | SavedVehicleSearch | null> {
  const existing = await getSavedSearchById(userId, id);
  if (!existing) return null;

  const enablingAlerts = input.alertsEnabled === true && !existing.alertsEnabled;

  const [row] = await db
    .update(savedSearch)
    .set({
      ...(input.alertsEnabled !== undefined ? { alertsEnabled: input.alertsEnabled } : {}),
      ...(input.alertFrequency !== undefined
        ? { alertFrequency: input.alertFrequency }
        : {}),
      ...(input.alertLocale !== undefined ? { alertLocale: input.alertLocale } : {}),
      ...(enablingAlerts ? { lastAlertAt: new Date() } : {}),
    })
    .where(and(eq(savedSearch.userId, userId), eq(savedSearch.id, id)))
    .returning();

  return row ? mapRow(row) : null;
}

export async function removeSavedSearch(userId: string, id: string): Promise<void> {
  await db
    .delete(savedSearch)
    .where(and(eq(savedSearch.userId, userId), eq(savedSearch.id, id)));
}

export async function syncSavedSearches(
  userId: string,
  items: CreateSavedSearchInput[],
): Promise<Array<SavedPropertySearch | SavedVehicleSearch>> {
  for (const item of items) {
    await createSavedSearch(userId, item);
  }

  return listSavedSearches(userId);
}

export type SavedSearchAlertCandidate = (SavedPropertySearch | SavedVehicleSearch) & {
  userEmail: string;
  userName: string;
};

export async function listSavedSearchesWithAlertsEnabled(): Promise<
  SavedSearchAlertCandidate[]
> {
  const rows = await db
    .select({
      search: savedSearch,
      userEmail: user.email,
      userName: user.name,
    })
    .from(savedSearch)
    .innerJoin(user, eq(savedSearch.userId, user.id))
    .where(eq(savedSearch.alertsEnabled, true))
    .orderBy(desc(savedSearch.updatedAt));

  return rows.map(({ search, userEmail, userName }) => ({
    ...mapRow(search),
    userEmail,
    userName,
  }));
}

export async function markSavedSearchAlertSent(
  id: string,
  listingIds: string[],
): Promise<void> {
  const [existing] = await db
    .select({ notifiedListingIds: savedSearch.notifiedListingIds })
    .from(savedSearch)
    .where(eq(savedSearch.id, id))
    .limit(1);

  if (!existing) return;

  const merged = [
    ...normalizeNotifiedIds(existing.notifiedListingIds),
    ...listingIds,
  ];
  const unique = [...new Set(merged)].slice(-MAX_NOTIFIED_IDS);

  await db
    .update(savedSearch)
    .set({
      lastAlertAt: new Date(),
      notifiedListingIds: unique,
    })
    .where(eq(savedSearch.id, id));
}
