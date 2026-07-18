import { NextResponse } from "next/server";
import { getBackofficeRegistrationUrl } from "@/lib/backoffice/config";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "registration-requests", 5, 60_000);
  if (limited) return limited;

  const target = getBackofficeRegistrationUrl();
  if (!target) {
    return NextResponse.json({ error: "BACKOFFICE_NOT_CONFIGURED" }, { status: 503 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const companyName = String(body.companyName ?? body.company ?? "").trim();
  const contactName = String(body.contactName ?? body.company ?? "").trim();
  const contactEmail = String(body.contactEmail ?? body.email ?? "").trim().toLowerCase();
  const contactPhone = String(body.contactPhone ?? body.phone ?? "").trim();
  const category = String(body.category ?? "real_estate").trim();
  const cnpj = String(body.cnpj ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!companyName || !contactName || !contactEmail) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        contactName,
        contactEmail,
        contactPhone: contactPhone || undefined,
        category,
        cnpj: cnpj || undefined,
        message:
          message ||
          (cnpj ? `CNPJ/documento: ${cnpj}` : undefined),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json({ error: "BACKOFFICE_UNAVAILABLE" }, { status: 502 });
  }
}
