import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { vehicleCompare } from "@/lib/db/schema";

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
    .select({ listingId: vehicleCompare.listingId })
    .from(vehicleCompare)
    .where(eq(vehicleCompare.userId, userId))
    .orderBy(asc(vehicleCompare.position));

  return rows.map((row) => row.listingId);
}

async function writeIds(userId: string, listingIds: string[]): Promise<string[]> {
  const next = normalizeIds(listingIds);

  await db.delete(vehicleCompare).where(eq(vehicleCompare.userId, userId));

  if (next.length > 0) {
    await db.insert(vehicleCompare).values(
      next.map((listingId, position) => ({
        userId,
        listingId,
        position,
      })),
    );
  }

  return next;
}

export async function listCompareVehicleIds(userId: string): Promise<string[]> {
  return readIds(userId);
}

export async function toggleCompareVehicleId(
  userId: string,
  listingId: string,
): Promise<string[]> {
  const current = await readIds(userId);
  return writeIds(userId, toggleIds(current, listingId));
}

export async function removeCompareVehicleId(
  userId: string,
  listingId: string,
): Promise<string[]> {
  const current = await readIds(userId);
  return writeIds(
    userId,
    current.filter((id) => id !== listingId),
  );
}

export async function clearCompareVehicleIds(userId: string): Promise<string[]> {
  await db.delete(vehicleCompare).where(eq(vehicleCompare.userId, userId));
  return [];
}

export async function syncCompareVehicleIds(
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
