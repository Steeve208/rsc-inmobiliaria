import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { company, companyLeadConfig } from "@/lib/db/schema";
import { companyRegistrationSchema } from "@/lib/validations/company";
import { slugifyCompanyId } from "@/lib/leads/utils";

async function uniqueCompanyId(base: string): Promise<string> {
  const slug = base || "empresa";
  const [existing] = await db
    .select({ id: company.id })
    .from(company)
    .where(eq(company.id, slug))
    .limit(1);

  if (!existing) return slug;
  return `${slug}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = companyRegistrationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const id = await uniqueCompanyId(slugifyCompanyId(data.company));
  const whatsappNumber = data.phone.replace(/\D/g, "");

  const [created] = await db
    .insert(company)
    .values({
      id,
      name: data.company,
      type: data.type ?? "real_estate",
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      whatsappNumber,
      marketId: data.marketId ?? "br",
      verified: false,
    })
    .returning({ id: company.id, name: company.name });

  // Sembrar la configuración de WhatsApp para que el botón de leads funcione.
  await db
    .insert(companyLeadConfig)
    .values({
      companyId: created.id,
      companyName: created.name,
      whatsappNumber,
    })
    .onConflictDoNothing({ target: companyLeadConfig.companyId });

  return NextResponse.json(
    { id: created.id, name: created.name, status: "pending" },
    { status: 201 },
  );
}
