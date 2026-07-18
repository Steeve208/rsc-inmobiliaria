import { NextResponse } from "next/server";
import { getBackofficeRegistrationUrl } from "@/lib/backoffice/config";
import { enforceRateLimit } from "@/lib/security/rate-limit";
import {
  createAdminSupabase,
  hasSupabaseStorage,
} from "@/utils/supabase/admin";

const VALID_CATEGORIES = new Set([
  "real_estate",
  "automotive",
  "agency",
  "retail",
  "services",
]);

async function notifyRscAdmins(params: {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone?: string;
  cnpj?: string;
}) {
  try {
    const admin = createAdminSupabase();
    const ids = new Set<string>();

    const { data: accounts } = await admin
      .from("backoffice_accounts")
      .select("profile_id, account_type, role")
      .eq("status", "active");

    for (const account of accounts ?? []) {
      const role = String(account.role ?? "");
      const type = String(account.account_type ?? "");
      if (
        account.profile_id &&
        (type === "platform_owner" ||
          role === "rsc_admin" ||
          role === "rsc_moderator")
      ) {
        ids.add(String(account.profile_id));
      }
    }

    const { data: memberships } = await admin
      .from("memberships")
      .select("user_id, role")
      .in("role", ["rsc_admin", "rsc_moderator"]);

    for (const membership of memberships ?? []) {
      if (membership.user_id) ids.add(String(membership.user_id));
    }

    if (ids.size === 0) return;

    const body = [
      params.contactEmail,
      params.contactPhone || null,
      params.cnpj ? `Documento: ${params.cnpj}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    await admin.from("notifications").insert(
      [...ids].map((userId) => ({
        user_id: userId,
        organization_id: null,
        type: "system",
        title: `Nueva solicitud de empresa: ${params.companyName}`,
        body,
        entity_type: "registration_request",
        entity_id: params.id,
      })),
    );
  } catch (error) {
    console.error(
      "[registration-requests] admin notify failed:",
      error instanceof Error ? error.message : error,
    );
  }
}

/** Insert into the shared backoffice table so RSC admins see it immediately. */
async function submitViaSupabase(input: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  category: string;
  cnpj?: string;
  message?: string;
}) {
  const admin = createAdminSupabase();
  const message =
    input.message ||
    (input.cnpj ? `CNPJ/documento: ${input.cnpj}` : null);

  const baseRow = {
    company_name: input.companyName,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone || null,
    category: input.category,
    message,
    status: "pending" as const,
  };

  let { data, error } = await admin
    .from("registration_requests")
    .insert({ ...baseRow, cnpj: input.cnpj || null })
    .select("id")
    .single();

  if (
    error &&
    (error.code === "PGRST204" ||
      /cnpj/i.test(error.message) && /column|schema cache/i.test(error.message))
  ) {
    ({ data, error } = await admin
      .from("registration_requests")
      .insert(baseRow)
      .select("id")
      .single());
  }

  if (error) {
    if (error.code === "23505") {
      return { ok: false as const, error: "DUPLICATE_PENDING" as const };
    }
    console.error(
      "[registration-requests] supabase insert failed:",
      error.message,
      error.code,
    );
    return {
      ok: false as const,
      error: "SUBMIT_FAILED" as const,
      detail: `${error.code ?? "UNKNOWN"}: ${error.message}`,
    };
  }

  await notifyRscAdmins({
    id: data.id,
    companyName: input.companyName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    cnpj: input.cnpj,
  });

  return { ok: true as const, id: data.id };
}

async function submitViaBackofficeProxy(input: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  category: string;
  cnpj?: string;
  message?: string;
}) {
  const target = getBackofficeRegistrationUrl();
  if (!target) {
    return NextResponse.json({ error: "BACKOFFICE_NOT_CONFIGURED" }, { status: 503 });
  }

  const response = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyName: input.companyName,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
      category: input.category,
      cnpj: input.cnpj,
      message:
        input.message ||
        (input.cnpj ? `CNPJ/documento: ${input.cnpj}` : undefined),
    }),
  });

  const payload = await response.json().catch(() => ({}));
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "registration-requests", 5, 60_000);
  if (limited) return limited;

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const companyName = String(body.companyName ?? body.company ?? "").trim();
  const contactName = String(body.contactName ?? body.company ?? "").trim();
  const contactEmail = String(body.contactEmail ?? body.email ?? "")
    .trim()
    .toLowerCase();
  const contactPhone = String(body.contactPhone ?? body.phone ?? "").trim();
  const category = String(body.category ?? "real_estate").trim();
  const cnpj = String(body.cnpj ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!companyName || !contactName || !contactEmail) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: "INVALID_CATEGORY" }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(contactEmail)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const input = {
    companyName,
    contactName,
    contactEmail,
    contactPhone: contactPhone || undefined,
    category,
    cnpj: cnpj || undefined,
    message: message || undefined,
  };

  // Prefer direct DB write into the backoffice registration inbox.
  if (hasSupabaseStorage()) {
    const result = await submitViaSupabase(input);
    if (!result.ok) {
      const status = result.error === "DUPLICATE_PENDING" ? 409 : 500;
      return NextResponse.json(
        {
          error: result.error,
          ...("detail" in result && result.detail
            ? { detail: result.detail }
            : {}),
        },
        { status },
      );
    }

    return NextResponse.json(
      { ok: true, id: result.id, message: "REQUEST_SUBMITTED" },
      { status: 201 },
    );
  }

  try {
    return await submitViaBackofficeProxy(input);
  } catch {
    return NextResponse.json({ error: "BACKOFFICE_UNAVAILABLE" }, { status: 502 });
  }
}
