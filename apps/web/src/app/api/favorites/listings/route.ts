import { NextResponse } from "next/server";
import { probeBackofficeListingById, isBackofficeConfigured } from "@/lib/backoffice/client";
import {
  mapBackofficeToPropertyListing,
  mapBackofficeToVehicleListing,
} from "@/lib/backoffice/mappers";
import { listPropertiesByIds } from "@/lib/listings/property-repository";
import { listVehiclesByIds } from "@/lib/listings/vehicle-repository";
import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";

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

async function resolveWithBackoffice(items: FavoriteListingItem[]) {
  const properties: PropertyListing[] = [];
  const vehicles: VehicleListing[] = [];
  const missing: FavoriteListingItem[] = [];

  await Promise.all(
    items.map(async (item) => {
      const probed = await probeBackofficeListingById(item.listingId);

      if (probed.status === "error") {
        return;
      }

      if (probed.status === "not_found") {
        missing.push(item);
        return;
      }

      const { listing } = probed;
      if (item.listingKind === "property") {
        if (listing.category === "real_estate") {
          properties.push(mapBackofficeToPropertyListing(listing));
        } else {
          missing.push(item);
        }
        return;
      }

      if (listing.category === "automotive") {
        vehicles.push(mapBackofficeToVehicleListing(listing));
      } else {
        missing.push(item);
      }
    }),
  );

  return { properties, vehicles, missing };
}

async function resolveLocal(items: FavoriteListingItem[]) {
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

  const found = new Set([
    ...properties.map((item) => `property:${item.id}`),
    ...vehicles.map((item) => `vehicle:${item.id}`),
  ]);

  const missing = items.filter(
    (item) => !found.has(`${item.listingKind}:${item.listingId}`),
  );

  return { properties, vehicles, missing };
}

async function resolveListings(items: FavoriteListingItem[]) {
  if (isBackofficeConfigured()) {
    return resolveWithBackoffice(items);
  }
  return resolveLocal(items);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const propertyIds = parseIdList(
    searchParams.get("properties") ?? searchParams.get("propertyIds"),
  );
  const vehicleIds = parseIdList(
    searchParams.get("vehicles") ?? searchParams.get("vehicleIds"),
  );

  const items: FavoriteListingItem[] = [
    ...propertyIds.map((listingId) => ({
      listingKind: "property" as const,
      listingId,
    })),
    ...vehicleIds.map((listingId) => ({
      listingKind: "vehicle" as const,
      listingId,
    })),
  ];

  if (items.length === 0) {
    return NextResponse.json({ properties: [], vehicles: [], missing: [] });
  }

  return NextResponse.json(await resolveListings(items));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const items = parseItems(body);

  if (items.length === 0) {
    return NextResponse.json({ properties: [], vehicles: [], missing: [] });
  }

  return NextResponse.json(await resolveListings(items));
}
