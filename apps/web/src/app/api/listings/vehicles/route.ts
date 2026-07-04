import { NextResponse } from "next/server";
import {
  getFeaturedVehicles,
  getPremiumVehicles,
  getRecommendedVehicles,
  listVehicles,
  listVehiclesByIds,
} from "@/lib/listings/vehicle-repository";

function parseIdList(value: string | null) {
  if (!value?.trim()) return [];
  return [...new Set(value.split(",").map((id) => id.trim()).filter(Boolean))];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  const ids = parseIdList(searchParams.get("ids"));

  if (ids.length > 0) {
    return NextResponse.json(await listVehiclesByIds(ids));
  }

  if (section === "featured") {
    return NextResponse.json(await getFeaturedVehicles());
  }
  if (section === "premium") {
    return NextResponse.json(await getPremiumVehicles());
  }
  if (section === "recommended") {
    return NextResponse.json(await getRecommendedVehicles());
  }

  return NextResponse.json(await listVehicles());
}
