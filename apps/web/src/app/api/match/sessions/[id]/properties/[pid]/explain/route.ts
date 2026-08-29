import { NextResponse } from "next/server";
import { explainPropertyMatch, handleAccessError, jsonError } from "@/lib/match/session-service";

type Ctx = { params: Promise<{ id: string; pid: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { id, pid } = await context.params;
    const result = await explainPropertyMatch(id, pid);
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json(result.explain);
  } catch {
    return jsonError("match_failed", 500);
  }
}
