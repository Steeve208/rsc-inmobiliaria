import { NextResponse } from "next/server";
import { listBusinesses } from "@/lib/listings/business-repository";

export async function GET() {
  return NextResponse.json(await listBusinesses());
}
