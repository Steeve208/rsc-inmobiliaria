import { NextResponse } from "next/server";
import { requireAdminUserId } from "@/lib/auth/admin";
import { getListingReport } from "@/lib/reports/store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const adminId = await requireAdminUserId();
  if (!adminId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const report = await getListingReport(id);
  if (!report) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(report);
}
