import { NextResponse } from "next/server";
import { listProperties } from "@/lib/listings/property-repository";
import { listVehicles } from "@/lib/listings/vehicle-repository";
import type { ListingItem } from "@/features/search/types";

function propertyToSearchItem(
  p: Awaited<ReturnType<typeof listProperties>>[number],
): ListingItem {
  return {
    id: p.id,
    category: "properties",
    title: p.title,
    type: p.type,
    price: p.price,
    currency: p.currency,
    country: p.country,
    state: p.state,
    city: p.city,
    neighborhood: p.neighborhood,
    bedrooms: p.bedrooms,
    garage: p.garage,
    pool: p.pool,
    area: p.area,
    company: p.company,
    financing: p.financing,
    image: p.image,
    lat: p.lat,
    lng: p.lng,
    publishedAt: p.publishedAt,
  };
}

function vehicleToSearchItem(
  v: Awaited<ReturnType<typeof listVehicles>>[number],
): ListingItem {
  return {
    id: v.id,
    category: "vehicles",
    title: v.title,
    type: v.type,
    price: v.price,
    currency: v.currency,
    country: v.country,
    state: v.state,
    city: v.city,
    neighborhood: "",
    bedrooms: 0,
    garage: 0,
    pool: false,
    area: 0,
    company: v.company,
    financing: v.financing,
    image: v.image,
    lat: v.lat,
    lng: v.lng,
    publishedAt: v.publishedAt,
  };
}

export async function GET() {
  const [properties, vehicles] = await Promise.all([
    listProperties(),
    listVehicles(),
  ]);

  const items: ListingItem[] = [
    ...properties.map(propertyToSearchItem),
    ...vehicles.map(vehicleToSearchItem),
  ];

  return NextResponse.json(items);
}
