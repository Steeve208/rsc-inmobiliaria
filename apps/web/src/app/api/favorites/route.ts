import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  addFavorite,
  listFavorites,
  removeFavorite,
  syncFavorites,
} from "@/lib/listings/favorites-repository";

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await listFavorites(userId));
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    listingKind?: "property" | "vehicle";
    listingId?: string;
    items?: { listingKind: "property" | "vehicle"; listingId: string }[];
  };

  if (Array.isArray(body.items)) {
    const favorites = await syncFavorites(userId, body.items);
    return NextResponse.json(favorites);
  }

  if (!body.listingKind || !body.listingId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  try {
    const favorite = await addFavorite(userId, body.listingKind, body.listingId);
    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("[favorites] POST failed:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingKind = searchParams.get("listingKind") as "property" | "vehicle" | null;
  const listingId = searchParams.get("listingId");

  if (!listingKind || !listingId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  await removeFavorite(userId, listingKind, listingId);
  return NextResponse.json({ ok: true });
}
