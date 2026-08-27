import { NextResponse } from "next/server";
import { listMagazines } from "@/lib/listings/magazine-store";

export async function GET() {
  return NextResponse.json(await listMagazines());
}
