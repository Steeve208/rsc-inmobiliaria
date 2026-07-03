import { NextResponse } from "next/server";
import {
  createCompanyProperty,
  listCompanyProperties,
} from "@/lib/listings/property-writes";
import { createPropertySchema } from "@/lib/validations/property";
import { db } from "@/lib/db";
import { company } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type RouteParams = { params: Promise<{ companyId: string }> };

async function companyExists(companyId: string) {
  const [row] = await db
    .select({ id: company.id })
    .from(company)
    .where(eq(company.id, companyId))
    .limit(1);
  return Boolean(row);
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { companyId } = await params;

  if (!(await companyExists(companyId))) {
    return NextResponse.json({ error: "company_not_found" }, { status: 404 });
  }

  try {
    const properties = await listCompanyProperties(companyId);
    return NextResponse.json(properties);
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  const { companyId } = await params;

  if (!(await companyExists(companyId))) {
    return NextResponse.json({ error: "company_not_found" }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createPropertySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const created = await createCompanyProperty(companyId, parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }
}
