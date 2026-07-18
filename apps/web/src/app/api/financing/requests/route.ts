import { NextResponse } from "next/server";
import {
  createFinancingRequest,
  listFinancingRequests,
  updateFinancingRequestStatus,
} from "@/lib/financing/store";
import {
  createFinancingRequestSchema,
  updateFinancingRequestStatusSchema,
} from "@/lib/financing/validation";
import type { FinancingRequestStatus } from "@/lib/financing/types";
import { FINANCING_REQUEST_STATUSES } from "@/lib/financing/types";
import {
  requireAdminAccess,
  requireBuyerAccess,
} from "@/lib/auth/authorize";
import { enforceRateLimit } from "@/lib/security/rate-limit";

function isValidStatus(value: string): value is FinancingRequestStatus {
  return FINANCING_REQUEST_STATUSES.includes(value as FinancingRequestStatus);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerId = searchParams.get("buyerId") ?? undefined;
  const statusParam = searchParams.get("status") ?? undefined;
  const status =
    statusParam && isValidStatus(statusParam) ? statusParam : undefined;

  if (buyerId) {
    const access = await requireBuyerAccess(buyerId);
    if (!access.ok) return access.response;
    return NextResponse.json(await listFinancingRequests({ buyerId, status }));
  }

  const admin = await requireAdminAccess();
  if (!admin.ok) return admin.response;

  return NextResponse.json(await listFinancingRequests({ status }));
}

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, "financing-create", 10, 60_000);
  if (limited) return limited;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createFinancingRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  const access = await requireBuyerAccess(parsed.data.buyerId);
  if (!access.ok) return access.response;

  const requestRecord = await createFinancingRequest({
    ...parsed.data,
    buyerId: access.buyerId,
  });
  return NextResponse.json(requestRecord, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminAccess();
  if (!admin.ok) return admin.response;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateFinancingRequestStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const updated = await updateFinancingRequestStatus(parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
