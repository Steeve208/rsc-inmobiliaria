import { NextResponse } from "next/server";
import {
  getFeaturedVehicles,
  getPremiumVehicles,
  getRecommendedVehicles,
  listVehicles,
} from "@/lib/listings/vehicle-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

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
