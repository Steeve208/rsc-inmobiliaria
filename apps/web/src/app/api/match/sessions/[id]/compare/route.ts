import { NextResponse } from "next/server";
import { compareBodySchema } from "@/lib/match/schemas";
import {
  compareSessionProperties,
  handleAccessError,
  jsonError,
} from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const limited = await enforceRateLimit(request, "match-compare", 20, 60_000);
  if (limited) return limited;

  try {
    const { id } = await context.params;
    const parsed = compareBodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("invalid_request", 400);
    const result = await compareSessionProperties({
      sessionId: id,
      propertyIds: parsed.data.propertyIds,
    });
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json({ items: result.items, narrative: result.narrative });
  } catch {
    return jsonError("match_failed", 500);
  }
}
