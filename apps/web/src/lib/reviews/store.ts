import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { platformReview } from "@/lib/db/schema";
import type { PlatformReview, PublicPlatformReview } from "./types";

function mapRow(row: typeof platformReview.$inferSelect): PlatformReview {
  return {
    id: row.id,
    userId: row.userId,
    rating: row.rating,
    comment: row.comment,
    displayName: row.displayName,
    locationLabel: row.locationLabel,
    avatarUrl: row.avatarUrl,
    status: row.status === "hidden" ? "hidden" : "published",
    createdAt: row.createdAt.toISOString(),
  };
}

function toPublic(row: PlatformReview): PublicPlatformReview {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    displayName: row.displayName,
    locationLabel: row.locationLabel,
    avatarUrl: row.avatarUrl,
    createdAt: row.createdAt,
  };
}

export async function listPublishedPlatformReviews(
  limit = 8,
): Promise<PublicPlatformReview[]> {
  try {
    const rows = await db
      .select()
      .from(platformReview)
      .where(eq(platformReview.status, "published"))
      .orderBy(desc(platformReview.createdAt))
      .limit(limit);
    return rows.map((row) => toPublic(mapRow(row)));
  } catch {
    return [];
  }
}

export async function getPlatformReviewByUserId(
  userId: string,
): Promise<PlatformReview | null> {
  const [row] = await db
    .select()
    .from(platformReview)
    .where(eq(platformReview.userId, userId))
    .limit(1);
  return row ? mapRow(row) : null;
}

export async function upsertPlatformReview(input: {
  userId: string;
  rating: number;
  comment: string;
  displayName: string;
  locationLabel?: string | null;
  avatarUrl?: string | null;
}): Promise<PlatformReview> {
  const existing = await getPlatformReviewByUserId(input.userId);
  const now = new Date();

  if (existing) {
    const [row] = await db
      .update(platformReview)
      .set({
        rating: input.rating,
        comment: input.comment,
        displayName: input.displayName,
        locationLabel: input.locationLabel ?? null,
        avatarUrl: input.avatarUrl ?? null,
        status: "published",
        updatedAt: now,
      })
      .where(eq(platformReview.userId, input.userId))
      .returning();
    return mapRow(row);
  }

  const id = `prv_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const [row] = await db
    .insert(platformReview)
    .values({
      id,
      userId: input.userId,
      rating: input.rating,
      comment: input.comment,
      displayName: input.displayName,
      locationLabel: input.locationLabel ?? null,
      avatarUrl: input.avatarUrl ?? null,
      status: "published",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return mapRow(row);
}
