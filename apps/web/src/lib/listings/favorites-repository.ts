import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { favorite } from "@/lib/db/schema";

function newId() {
  return `fav_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export type FavoriteItem = {
  id: string;
  listingKind: "property" | "vehicle";
  listingId: string;
  createdAt: string;
};

export async function listFavorites(userId: string): Promise<FavoriteItem[]> {
  const rows = await db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, userId));

  return rows.map((row) => ({
    id: row.id,
    listingKind: row.listingKind as FavoriteItem["listingKind"],
    listingId: row.listingId,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function addFavorite(
  userId: string,
  listingKind: "property" | "vehicle",
  listingId: string,
): Promise<FavoriteItem> {
  const id = newId();
  const [row] = await db
    .insert(favorite)
    .values({ id, userId, listingKind, listingId })
    .onConflictDoNothing()
    .returning();

  if (row) {
    return {
      id: row.id,
      listingKind: row.listingKind as FavoriteItem["listingKind"],
      listingId: row.listingId,
      createdAt: row.createdAt.toISOString(),
    };
  }

  const [existing] = await db
    .select()
    .from(favorite)
    .where(
      and(
        eq(favorite.userId, userId),
        eq(favorite.listingKind, listingKind),
        eq(favorite.listingId, listingId),
      ),
    )
    .limit(1);

  return {
    id: existing!.id,
    listingKind: existing!.listingKind as FavoriteItem["listingKind"],
    listingId: existing!.listingId,
    createdAt: existing!.createdAt.toISOString(),
  };
}

export async function removeFavorite(
  userId: string,
  listingKind: "property" | "vehicle",
  listingId: string,
): Promise<void> {
  await db
    .delete(favorite)
    .where(
      and(
        eq(favorite.userId, userId),
        eq(favorite.listingKind, listingKind),
        eq(favorite.listingId, listingId),
      ),
    );
}

export async function isFavorite(
  userId: string,
  listingKind: "property" | "vehicle",
  listingId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: favorite.id })
    .from(favorite)
    .where(
      and(
        eq(favorite.userId, userId),
        eq(favorite.listingKind, listingKind),
        eq(favorite.listingId, listingId),
      ),
    )
    .limit(1);
  return Boolean(row);
}
