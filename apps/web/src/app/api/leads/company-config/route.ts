import { NextResponse } from "next/server";
import { getCompanyConfig, upsertCompanyConfig } from "@/lib/leads/store";
import { getDefaultCompanyConfig } from "@/lib/leads/utils";
import type { CompanyLeadConfig } from "@/lib/leads/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName");

  if (!companyId) {
    return NextResponse.json({ error: "companyId required" }, { status: 400 });
  }

  const config =
    (await getCompanyConfig(companyId)) ??
    getDefaultCompanyConfig(companyId) ??
    ({
      companyId,
      companyName: companyName ?? companyId,
      whatsappNumber: "5554999887766",
    } satisfies CompanyLeadConfig);

  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as CompanyLeadConfig;

  if (!body.companyId || !body.companyName || !body.whatsappNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const config = await upsertCompanyConfig(body);
  return NextResponse.json(config);
}
