export const LISTING_PLACEHOLDER_IMAGE = "/placeholder-listing.svg";

export function listingImageUrl(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed ? trimmed : LISTING_PLACEHOLDER_IMAGE;
}
