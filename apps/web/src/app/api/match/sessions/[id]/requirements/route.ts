import { NextResponse } from "next/server";
import { patchRequirementsBodySchema } from "@/lib/match/schemas";
import {
  handleAccessError,
  jsonError,
  patchSessionRequirements,
} from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const limited = await enforceRateLimit(request, "match-requirements", 40, 60_000);
  if (limited) return limited;

  try {
    const { id } = await context.params;
    const parsed = patchRequirementsBodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("invalid_request", 400);
    const result = await patchSessionRequirements({
      sessionId: id,
      patch: parsed.data.requirements,
    });
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json(result.session);
  } catch {
    return jsonError("match_failed", 500);
  }
}
