import { NextResponse } from "next/server";
import { handleAccessError, jsonError, runSessionMatching } from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const limited = await enforceRateLimit(request, "match-run", 20, 60_000);
  if (limited) return limited;

  try {
    const { id } = await context.params;
    const result = await runSessionMatching(id);
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json(result.session);
  } catch {
    return jsonError("match_failed", 500);
  }
}
