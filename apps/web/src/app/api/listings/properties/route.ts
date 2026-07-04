import { NextResponse } from "next/server";
import {
  getLaunchProperties,
  getPremiumProperties,
  getRecommendedProperties,
  listProperties,
  listPropertiesByIds,
} from "@/lib/listings/property-repository";

function parseIdList(value: string | null) {
  if (!value?.trim()) return [];
  return [...new Set(value.split(",").map((id) => id.trim()).filter(Boolean))];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section");
  const ids = parseIdList(searchParams.get("ids"));

  if (ids.length > 0) {
    return NextResponse.json(await listPropertiesByIds(ids));
  }

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
