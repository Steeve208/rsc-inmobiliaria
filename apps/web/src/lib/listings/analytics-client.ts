export type ListingAnalyticsEvent = "view" | "contact" | "click" | "favorite";

export async function trackListingEvent(
  listingId: string,
  event: ListingAnalyticsEvent,
): Promise<void> {
  try {
    await fetch("/api/listings/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, event }),
      keepalive: true,
    });
  } catch {
    // non-blocking analytics
  }
}
