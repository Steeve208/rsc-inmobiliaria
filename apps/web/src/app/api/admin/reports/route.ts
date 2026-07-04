import { NextResponse } from "next/server";
import { requireAdminUserId } from "@/lib/auth/admin";
import {
  listListingReports,
  updateListingReport,
} from "@/lib/reports/store";
import {
  LISTING_REPORT_STATUSES,
  type ListingReportStatus,
} from "@/lib/reports/types";

function isValidStatus(value: string): value is ListingReportStatus {
  return LISTING_REPORT_STATUSES.includes(value as ListingReportStatus);
}

export async function GET(request: Request) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status") ?? undefined;
  const status =
    statusParam && isValidStatus(statusParam) ? statusParam : undefined;

  return NextResponse.json(await listListingReports({ status }));
}

export async function PATCH(request: Request) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    id?: string;
    status?: string;
    adminNotes?: string;
  };

  if (!body.id || !body.status || !isValidStatus(body.status)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const updated = await updateListingReport({
    id: body.id,
    status: body.status,
    adminNotes: body.adminNotes,
    reviewedBy: adminId,
  });

  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
