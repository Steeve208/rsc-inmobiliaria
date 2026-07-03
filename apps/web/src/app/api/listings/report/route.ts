import { NextResponse } from "next/server";
import { z } from "zod";

const reportSchema = z.object({
  listingId: z.string().min(1),
  listingTitle: z.string().min(1),
  listingKind: z.enum(["property", "vehicle"]),
  reason: z.string().min(10).max(2000),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
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

  // Queue for moderation — logged server-side until admin tooling exists.
  console.info("[listing-report]", parsed.data);

  return NextResponse.json({ ok: true }, { status: 201 });
}
