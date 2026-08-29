import { NextResponse } from "next/server";
import { getMatchSession, handleAccessError, jsonError } from "@/lib/match/session-service";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { id } = await context.params;
    const result = await getMatchSession(id);
    if (!result.ok) return handleAccessError(result.error);
    return NextResponse.json(result.session);
  } catch {
    return jsonError("match_failed", 500);
  }
}
