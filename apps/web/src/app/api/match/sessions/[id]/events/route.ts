import { NextResponse } from "next/server";
import { eventBodySchema } from "@/lib/match/schemas";
import { canAccessConversation, resolveMatchActor } from "@/lib/match/identity";
import { getConversation, recordPropertyEvent } from "@/lib/match/repository";
import { jsonError } from "@/lib/match/session-service";
import { enforceRateLimit } from "@/lib/security/rate-limit";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const limited = await enforceRateLimit(request, "match-events", 60, 60_000);
  if (limited) return limited;

  try {
    const { id } = await context.params;
    const parsed = eventBodySchema.safeParse(await request.json());
    if (!parsed.success) return jsonError("invalid_request", 400);
    const body = parsed.data;
    const actor = await resolveMatchActor();
    const loaded = await getConversation(id);
    if (!loaded?.conversation) return jsonError("not_found", 404);
    if (!canAccessConversation(actor, loaded.conversation)) {
      return jsonError("forbidden", 403);
    }
    await recordPropertyEvent({
      userId: actor.userId,
      guestId: actor.guestId,
      conversationId: id,
      propertyId: body.propertyId,
      eventType: body.eventType,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return jsonError("match_failed", 500);
  }
}
