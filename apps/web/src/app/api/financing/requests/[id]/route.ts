import { NextResponse } from "next/server";
import { getFinancingRequest } from "@/lib/financing/store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const requestRecord = await getFinancingRequest(id);

  if (!requestRecord) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(requestRecord);
}
