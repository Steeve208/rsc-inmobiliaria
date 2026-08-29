import { NextResponse } from "next/server";
import { sessionMessageBodySchema } from "@/lib/match/schemas";
import { addSessionMessage, handleAccessError, jsonError } from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const limited = await enforceRateLimit(request, "match-messages", 30, 60_000);
  if (limited) return limited;

  try {
    const { id } = await context.params;
    const parsed = sessionMessageBodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("invalid_request", 400);
    const result = await addSessionMessage({
      sessionId: id,
      message: parsed.data.message,
      optionId: parsed.data.optionId,
    });
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json(result.session);
  } catch {
    return jsonError("match_failed", 500);
  }
}
