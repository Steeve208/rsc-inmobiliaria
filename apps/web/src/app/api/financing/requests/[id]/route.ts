import { NextResponse } from "next/server";
import { getFinancingRequest } from "@/lib/financing/store";
import { getAuthActor, requireBuyerAccess } from "@/lib/auth/authorize";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const requestRecord = await getFinancingRequest(id);

  if (!requestRecord) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const actor = await getAuthActor();
  if (actor.isAdmin) {
    return NextResponse.json(requestRecord);
  }

  const access = await requireBuyerAccess(requestRecord.buyerId);
  if (!access.ok) return access.response;

  return NextResponse.json(requestRecord);
}
