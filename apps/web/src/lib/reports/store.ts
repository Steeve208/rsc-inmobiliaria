import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listingReport } from "@/lib/db/schema";
import type {
  CreateListingReportInput,
  ListingReport,
  ListingReportStatus,
  UpdateListingReportInput,
} from "./types";

function newId() {
  return `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

type Row = typeof listingReport.$inferSelect;

function mapRow(row: Row): ListingReport {
  return {
    id: row.id,
    listingId: row.listingId,
    listingTitle: row.listingTitle,
    listingKind: row.listingKind as ListingReport["listingKind"],
    reason: row.reason,
    reporterEmail: row.reporterEmail ?? undefined,
    reporterUserId: row.reporterUserId ?? undefined,
    status: row.status as ListingReportStatus,
    adminNotes: row.adminNotes ?? undefined,
    reviewedBy: row.reviewedBy ?? undefined,
    reviewedAt: row.reviewedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createListingReport(
  input: CreateListingReportInput,
): Promise<ListingReport> {
  const [row] = await db
    .insert(listingReport)
    .values({
      id: newId(),
      listingId: input.listingId,
      listingTitle: input.listingTitle,
      listingKind: input.listingKind,
      reason: input.reason,
      reporterEmail: input.reporterEmail,
      reporterUserId: input.reporterUserId,
      status: "pending",
    })
    .returning();

  return mapRow(row);
}

export async function listListingReports(filters: {
  status?: ListingReportStatus;
}): Promise<ListingReport[]> {
  const conditions = [];
  if (filters.status) conditions.push(eq(listingReport.status, filters.status));

  const rows = await db
    .select()
    .from(listingReport)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(listingReport.createdAt));

  return rows.map(mapRow);
}

export async function getListingReport(
  id: string,
): Promise<ListingReport | undefined> {
  const [row] = await db
    .select()
    .from(listingReport)
    .where(eq(listingReport.id, id))
    .limit(1);

  return row ? mapRow(row) : undefined;
}

export async function updateListingReport(
  input: UpdateListingReportInput,
): Promise<ListingReport | undefined> {
  const [row] = await db
    .update(listingReport)
    .set({
      status: input.status,
      adminNotes: input.adminNotes,
      reviewedBy: input.reviewedBy,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(listingReport.id, input.id))
    .returning();

  return row ? mapRow(row) : undefined;
}
