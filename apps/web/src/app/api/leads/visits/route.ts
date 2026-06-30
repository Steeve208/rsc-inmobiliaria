import { NextResponse } from "next/server";
import { createVisit, listVisits } from "@/lib/leads/store";
import type { CreateVisitInput } from "@/lib/leads/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId") ?? undefined;
  const companyId = searchParams.get("companyId") ?? undefined;

  if (!buyerId && !companyId) {
    return NextResponse.json({ error: "buyerId or companyId required" }, { status: 400 });
  }

  return NextResponse.json(await listVisits({ buyerId, companyId }));
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateVisitInput;

  if (
    !body.listingId ||
    !body.listingTitle ||
    !body.companyId ||
    !body.buyerId ||
    !body.buyerName ||
    !body.buyerPhone ||
    !body.preferredDate ||
    !body.preferredTime
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const visit = await createVisit(body);
  return NextResponse.json(visit, { status: 201 });
}
