import { NextResponse } from "next/server";
import { createSessionBodySchema } from "@/lib/match/schemas";
import { createMatchSession, jsonError } from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(
    request,
    "match-sessions",
    Number(process.env.AI_RATE_LIMIT_PER_MINUTE ?? 20),
    60_000,
  );
  if (limited) return limited;

  try {
    const parsed = createSessionBodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("invalid_request", 400);
    const body = parsed.data;
    const result = await createMatchSession({
      message: body.message,
      purposeHint: body.purposeHint,
      locale: body.locale,
      source: body.source,
      hints: body.hints,
    });
    if (!result.ok) {
      return jsonError(result.error, result.error === "forbidden" ? 403 : 404);
    }
    return NextResponse.json(result.session, { status: 201 });
  } catch {
    return jsonError("match_failed", 500);
  }
}
