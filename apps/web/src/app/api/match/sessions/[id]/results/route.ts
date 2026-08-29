import { NextResponse } from "next/server";
import { getSessionResults, handleAccessError, jsonError } from "@/lib/match/session-service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { id } = await context.params;
    const result = await getSessionResults(id);
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json({
      count: result.count,
      results: result.results,
      requirements: result.requirements,
    });
  } catch {
    return jsonError("match_failed", 500);
  }
}
