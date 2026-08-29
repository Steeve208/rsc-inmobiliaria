import { NextResponse } from "next/server";
import { askBodySchema } from "@/lib/match/schemas";
import { askAboutProperty, handleAccessError, jsonError } from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string; pid: string }> };

export async function POST(request: Request, context: Ctx) {
  const limited = await enforceRateLimit(request, "match-ask", 20, 60_000);
  if (limited) return limited;

  try {
    const { id, pid } = await context.params;
    const parsed = askBodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("invalid_request", 400);
    const result = await askAboutProperty({
      sessionId: id,
      propertyId: pid,
      question: parsed.data.question,
    });
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json({ answer: result.answer });
  } catch {
    return jsonError("match_failed", 500);
  }
}
