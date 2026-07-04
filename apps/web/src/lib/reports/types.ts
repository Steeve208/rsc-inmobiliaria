export const LISTING_REPORT_STATUSES = [
  "pending",
  "reviewing",
  "resolved",
  "dismissed",
] as const;

export type ListingReportStatus = (typeof LISTING_REPORT_STATUSES)[number];

export type ListingReport = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingKind: "property" | "vehicle";
  reason: string;
  reporterEmail?: string;
  reporterUserId?: string;
  status: ListingReportStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateListingReportInput = {
  listingId: string;
  listingTitle: string;
  listingKind: "property" | "vehicle";
  reason: string;
  reporterEmail?: string;
  reporterUserId?: string;
};

export type UpdateListingReportInput = {
  id: string;
  status: ListingReportStatus;
  adminNotes?: string;
  reviewedBy: string;
};
