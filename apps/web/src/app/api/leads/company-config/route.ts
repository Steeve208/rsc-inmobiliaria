import { NextResponse } from "next/server";
import { getCompanyConfig, upsertCompanyConfig } from "@/lib/leads/store";
import type { CompanyLeadConfig } from "@/lib/leads/types";
import { requireCompanyAccess } from "@/lib/auth/authorize";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName");

  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  const config =
    (await getCompanyConfig(companyId)) ??
    ({
      companyId,
      companyName: companyName ?? companyId,
      whatsappNumber: "",
    } satisfies CompanyLeadConfig);

  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as CompanyLeadConfig;

  if (!body.companyId || !body.companyName || !body.whatsappNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const access = await requireCompanyAccess(body.companyId);
  if (!access.ok) return access.response;

  const config = await upsertCompanyConfig(body);
  return NextResponse.json(config);
}
