import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "rsc-market-web",
    timestamp: new Date().toISOString(),
  });
}
