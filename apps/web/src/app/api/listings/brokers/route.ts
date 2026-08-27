import { NextResponse } from "next/server";
import { listBrokers } from "@/lib/listings/broker-repository";

export async function GET() {
  return NextResponse.json(await listBrokers());
}
