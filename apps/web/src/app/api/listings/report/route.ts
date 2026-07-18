import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { notifyAdminNewReport } from "@/lib/reports/notify-admin";
import { createListingReport } from "@/lib/reports/store";
import { enforceRateLimit } from "@/lib/security/rate-limit";

const reportSchema = z.object({
  listingId: z.string().min(1),
  listingTitle: z.string().min(1),
  listingKind: z.enum(["property", "vehicle"]),
  reason: z.string().min(10).max(2000),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, "listing-report", 8, 60_000);
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = reportSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: await headers() });

  const report = await createListingReport({
    listingId: parsed.data.listingId,
    listingTitle: parsed.data.listingTitle,
    listingKind: parsed.data.listingKind,
    reason: parsed.data.reason,
    reporterEmail: parsed.data.email,
    reporterUserId: session?.user?.id,
  });

  void notifyAdminNewReport(report);

  return NextResponse.json({ ok: true, id: report.id }, { status: 201 });
}
