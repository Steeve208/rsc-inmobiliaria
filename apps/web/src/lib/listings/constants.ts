export const LISTING_PLACEHOLDER_IMAGE = "/placeholder-listing.svg";

export function listingImageUrl(url?: string | null) {
  return url?.trim() ? url : LISTING_PLACEHOLDER_IMAGE;
}
