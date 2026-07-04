import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  clearCompareVehicleIds,
  listCompareVehicleIds,
  removeCompareVehicleId,
  syncCompareVehicleIds,
  toggleCompareVehicleId,
} from "@/lib/listings/vehicle-compare-repository";

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

  const listingIds = await listCompareVehicleIds(userId);
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
    const listingIds = await syncCompareVehicleIds(userId, body.listingIds);
    return NextResponse.json({ listingIds });
  }

  if (!body.listingId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const listingIds = await toggleCompareVehicleId(userId, body.listingId);
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
    ? await removeCompareVehicleId(userId, listingId)
    : await clearCompareVehicleIds(userId);

  return NextResponse.json({ listingIds });
}
