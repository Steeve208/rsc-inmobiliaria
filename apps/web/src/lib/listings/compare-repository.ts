import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { propertyCompare } from "@/lib/db/schema";

export const MAX_COMPARE_ITEMS = 3;

function normalizeIds(ids: string[]) {
  const unique: string[] = [];
  for (const id of ids) {
    if (typeof id === "string" && id.length > 0 && !unique.includes(id)) {
      unique.push(id);
    }
  }
  return unique.slice(0, MAX_COMPARE_ITEMS);
}

function toggleIds(current: string[], listingId: string) {
  if (current.includes(listingId)) {
    return current.filter((id) => id !== listingId);
  }
  if (current.length >= MAX_COMPARE_ITEMS) {
    return [...current.slice(1), listingId];
  }
  return [...current, listingId];
}

async function readIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ listingId: propertyCompare.listingId })
    .from(propertyCompare)
    .where(eq(propertyCompare.userId, userId))
    .orderBy(asc(propertyCompare.position));

  return rows.map((row) => row.listingId);
}

async function writeIds(userId: string, listingIds: string[]): Promise<string[]> {
  const next = normalizeIds(listingIds);

  await db.delete(propertyCompare).where(eq(propertyCompare.userId, userId));

  if (next.length > 0) {
    await db.insert(propertyCompare).values(
      next.map((listingId, position) => ({
        userId,
        listingId,
        position,
      })),
    );
  }

  return next;
}

export async function listComparePropertyIds(userId: string): Promise<string[]> {
  return readIds(userId);
}

export async function setComparePropertyIds(
  userId: string,
  listingIds: string[],
): Promise<string[]> {
  return writeIds(userId, listingIds);
}

export async function toggleComparePropertyId(
  userId: string,
  listingId: string,
): Promise<string[]> {
  const current = await readIds(userId);
  return writeIds(userId, toggleIds(current, listingId));
}

export async function removeComparePropertyId(
  userId: string,
  listingId: string,
): Promise<string[]> {
  const current = await readIds(userId);
  return writeIds(
    userId,
    current.filter((id) => id !== listingId),
  );
}

export async function clearComparePropertyIds(userId: string): Promise<string[]> {
  await db.delete(propertyCompare).where(eq(propertyCompare.userId, userId));
  return [];
}

export async function syncComparePropertyIds(
  userId: string,
  listingIds: string[],
): Promise<string[]> {
  const server = await readIds(userId);
  const merged: string[] = [];

  for (const id of [...server, ...listingIds]) {
    if (!merged.includes(id)) merged.push(id);
  }

  return writeIds(userId, merged.slice(-MAX_COMPARE_ITEMS));
}
