import { NextResponse } from "next/server";
import {
  createVisit,
  getListingVisitAvailability,
  listVisits,
  updateVisit,
} from "@/lib/leads/store";
import type { CreateVisitInput, UpdateVisitInput } from "@/lib/leads/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get("buyerId") ?? undefined;
    const companyId = searchParams.get("companyId") ?? undefined;
    const listingId = searchParams.get("listingId") ?? undefined;

    if (listingId && companyId) {
      return NextResponse.json(
        await getListingVisitAvailability(listingId, companyId),
      );
    }

    if (!buyerId && !companyId) {
      return NextResponse.json({ error: "buyerId or companyId required" }, { status: 400 });
    }

    return NextResponse.json(await listVisits({ buyerId, companyId }));
  } catch (error) {
    console.error("[visits] list failed", error);
    return NextResponse.json({ error: "VISITS_UNAVAILABLE" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
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
  } catch (error) {
    if (error instanceof Error && error.message === "DATE_NOT_AVAILABLE") {
      return NextResponse.json({ error: "DATE_NOT_AVAILABLE" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "TIME_NOT_AVAILABLE") {
      return NextResponse.json({ error: "TIME_NOT_AVAILABLE" }, { status: 409 });
    }
    console.error("[visits] create failed", error);
    return NextResponse.json({ error: "VISIT_CREATE_FAILED" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateVisitInput;

    if (!body.visitId) {
      return NextResponse.json({ error: "visitId required" }, { status: 400 });
    }

    const visit = await updateVisit(body);
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    return NextResponse.json(visit);
  } catch (error) {
    if (error instanceof Error && error.message === "TIME_NOT_AVAILABLE") {
      return NextResponse.json({ error: "TIME_NOT_AVAILABLE" }, { status: 409 });
    }
    console.error("[visits] update failed", error);
    return NextResponse.json({ error: "VISIT_UPDATE_FAILED" }, { status: 500 });
  }
}
