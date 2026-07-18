import { NextResponse } from "next/server";
import {
  isBackofficeConfigured,
  recordBackofficeListingEvent,
} from "@/lib/backoffice/client";
import type { ListingAnalyticsEvent } from "@/lib/listings/analytics-client";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, "listing-events", 120, 60_000);
    if (limited) return limited;

    const body = (await request.json()) as {
      listingId?: string;
      event?: ListingAnalyticsEvent;
    };

    const listingId = body.listingId?.trim();
    const event = body.event;

    if (!listingId || !event) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    if (!["view", "contact", "click", "favorite"].includes(event)) {
      return NextResponse.json({ error: "invalid_event" }, { status: 400 });
    }

    if (!isBackofficeConfigured()) {
      return NextResponse.json({ success: true, skipped: true });
    }

    await recordBackofficeListingEvent(listingId, event);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[listings/events] failed", error);
    return NextResponse.json({ error: "track_failed" }, { status: 500 });
  }
}
