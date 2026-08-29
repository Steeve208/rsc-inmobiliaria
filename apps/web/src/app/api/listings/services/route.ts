import { NextResponse } from "next/server";
import { listServices } from "@/lib/listings/service-repository";

export async function GET() {
  return NextResponse.json(await listServices());
}
