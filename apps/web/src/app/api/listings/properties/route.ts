import { NextResponse } from "next/server";
import {
  getLaunchProperties,
  getPremiumProperties,
  getRecommendedProperties,
  listProperties,
} from "@/lib/listings/property-repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");

  if (section === "premium") {
    return NextResponse.json(await getPremiumProperties());
  }
  if (section === "recommended") {
    return NextResponse.json(await getRecommendedProperties());
  }
  if (section === "launch") {
    return NextResponse.json(await getLaunchProperties());
  }

  return NextResponse.json(await listProperties());
}
