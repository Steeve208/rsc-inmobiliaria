import { NextResponse } from "next/server";
import { listPropertiesByIds } from "@/lib/listings/property-repository";
import { listVehiclesByIds } from "@/lib/listings/vehicle-repository";

type FavoriteListingItem = {
  listingKind: "property" | "vehicle";
  listingId: string;
};

function parseIdList(value: string | null) {
  if (!value?.trim()) return [];
  return [...new Set(value.split(",").map((id) => id.trim()).filter(Boolean))];
}

function parseItems(body: unknown): FavoriteListingItem[] {
  if (!body || typeof body !== "object") return [];

  const items = (body as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];

  return items.filter((item): item is FavoriteListingItem => {
    if (!item || typeof item !== "object") return false;
    const kind = (item as FavoriteListingItem).listingKind;
    const id = (item as FavoriteListingItem).listingId;
    return (
      (kind === "property" || kind === "vehicle") &&
      typeof id === "string" &&
      id.length > 0
    );
  });
}

async function resolveListings(items: FavoriteListingItem[]) {
  const propertyIds = items
    .filter((item) => item.listingKind === "property")
    .map((item) => item.listingId);
  const vehicleIds = items
    .filter((item) => item.listingKind === "vehicle")
    .map((item) => item.listingId);

  const [properties, vehicles] = await Promise.all([
    listPropertiesByIds(propertyIds),
    listVehiclesByIds(vehicleIds),
  ]);

  return { properties, vehicles };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const propertyIds = parseIdList(
    searchParams.get("properties") ?? searchParams.get("propertyIds"),
  );
  const vehicleIds = parseIdList(
    searchParams.get("vehicles") ?? searchParams.get("vehicleIds"),
  );

  if (propertyIds.length === 0 && vehicleIds.length === 0) {
    return NextResponse.json({ properties: [], vehicles: [] });
  }

  const [properties, vehicles] = await Promise.all([
    listPropertiesByIds(propertyIds),
    listVehiclesByIds(vehicleIds),
  ]);

  return NextResponse.json({ properties, vehicles });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const items = parseItems(body);

  if (items.length === 0) {
    return NextResponse.json({ properties: [], vehicles: [] });
  }

  return NextResponse.json(await resolveListings(items));
}
