import { NextResponse } from "next/server";
import {
  getCompanyProperty,
  updateCompanyProperty,
} from "@/lib/listings/property-writes";
import { updatePropertySchema } from "@/lib/validations/property";

type RouteParams = {
  params: Promise<{ companyId: string; propertyId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { companyId, propertyId } = await params;

  try {
    const property = await getCompanyProperty(companyId, propertyId);
    if (!property) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { companyId, propertyId } = await params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updatePropertySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const updated = await updateCompanyProperty(companyId, propertyId, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }
}
