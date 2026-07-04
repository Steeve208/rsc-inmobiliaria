import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  clearComparePropertyIds,
  listComparePropertyIds,
  removeComparePropertyId,
  syncComparePropertyIds,
  toggleComparePropertyId,
} from "@/lib/listings/compare-repository";

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

  const listingIds = await listComparePropertyIds(userId);
  return NextResponse.json({ listingIds });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    listingId?: string;
    listingIds?: string[];
  };

  if (Array.isArray(body.listingIds)) {
    const listingIds = await syncComparePropertyIds(userId, body.listingIds);
    return NextResponse.json({ listingIds });
  }

  if (!body.listingId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const listingIds = await toggleComparePropertyId(userId, body.listingId);
  return NextResponse.json({ listingIds });
}

export async function DELETE(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");

  const listingIds = listingId
    ? await removeComparePropertyId(userId, listingId)
    : await clearComparePropertyIds(userId);

  return NextResponse.json({ listingIds });
}
