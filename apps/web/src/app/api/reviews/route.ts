import { NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { getAuthActor, unauthorizedResponse } from "@/lib/auth/authorize";
import { auth } from "@/lib/auth";
import {
  getPlatformReviewByUserId,
  listPublishedPlatformReviews,
  upsertPlatformReview,
} from "@/lib/reviews/store";

const bodySchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(600),
  locationLabel: z.string().trim().max(120).optional().nullable(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine") === "1";

  if (mine) {
    const actor = await getAuthActor();
    if (!actor.userId) return unauthorizedResponse();
    const review = await getPlatformReviewByUserId(actor.userId);
    return NextResponse.json({ review });
  }

  const limit = Math.min(Number(searchParams.get("limit") ?? 8) || 8, 24);
  const reviews = await listPublishedPlatformReviews(limit);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const actor = await getAuthActor();
  if (!actor.userId) return unauthorizedResponse();

  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user?.id) return unauthorizedResponse();

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const review = await upsertPlatformReview({
    userId: user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    displayName: user.name?.trim() || user.email?.split("@")[0] || "Usuario",
    locationLabel: parsed.data.locationLabel ?? null,
    avatarUrl: user.image ?? null,
  });

  return NextResponse.json({ review }, { status: 201 });
}
