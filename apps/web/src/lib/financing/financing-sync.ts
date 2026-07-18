import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { upsertMarketplaceLead } from "@/lib/leads/lead-sync";
import type { FinancingRequest } from "./types";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function mapStatusToDashboard(status: FinancingRequest["status"]): string {
  if (status === "in_analysis") return "reviewing";
  return status;
}

async function resolveOrganizationId(companySlug: string): Promise<string | null> {
  const rows = await db.execute<{ id: string }>(sql`
    select id::text as id
    from public.organizations
    where slug = ${companySlug}
    limit 1
  `);
  return rows[0]?.id ?? null;
}

async function resolveOrgFromListing(
  listingId: string,
): Promise<{ organizationId: string; listingUuid: string } | null> {
  if (!isUuid(listingId)) return null;

  const rows = await db.execute<{ organization_id: string; id: string }>(sql`
    select organization_id::text as organization_id, id::text as id
    from public.listings
    where id = ${listingId}::uuid
    limit 1
  `);
  const row = rows[0];
  if (!row) return null;
  return { organizationId: row.organization_id, listingUuid: row.id };
}

export async function syncFinancingToBackoffice(
  request: FinancingRequest,
): Promise<void> {
  try {
    let organizationId: string | null = null;
    let listingUuid: string | null = null;

    if (request.companyId) {
      organizationId = await resolveOrganizationId(request.companyId);
    }

    if (request.listingId) {
      const fromListing = await resolveOrgFromListing(request.listingId);
      if (fromListing) {
        listingUuid = fromListing.listingUuid;
        organizationId = organizationId ?? fromListing.organizationId;
      }
    }

    if (!organizationId) {
      console.warn(
        `[financing-sync] organization not found for company=${request.companyId ?? "—"} listing=${request.listingId ?? "—"}`,
      );
      return;
    }

    const leadId = request.buyerId
      ? await upsertMarketplaceLead({
          organizationId,
          buyerId: request.buyerId,
          name: request.buyerName?.trim() || "Comprador marketplace",
          phone: request.buyerPhone,
          email: request.buyerEmail,
          listingId: listingUuid ?? request.listingId,
          notes: `Financiamento: ${request.listingTitle ?? request.id}`,
        })
      : null;

    const notes = [
      request.notes,
      request.listingTitle ? `Anúncio: ${request.listingTitle}` : null,
      `Entrada: ${request.downPaymentPct}% (${request.downPaymentAmount})`,
      `Prazo: ${request.termMonths} meses`,
      `Taxa: ${request.interestRate}% a.m.`,
      `Parcela estimada: ${request.estimatedInstallment}`,
    ]
      .filter(Boolean)
      .join("\n");

    const dashboardStatus = mapStatusToDashboard(request.status);
    const applicantName = request.buyerName?.trim() || "Comprador marketplace";

    await db.execute(sql`
      insert into public.financing_requests (
        organization_id,
        lead_id,
        listing_id,
        applicant_name,
        applicant_email,
        applicant_phone,
        amount,
        currency,
        status,
        notes,
        documents,
        external_financing_id,
        buyer_id,
        source,
        created_at,
        updated_at
      ) values (
        ${organizationId}::uuid,
        ${leadId ? sql`${leadId}::uuid` : sql`null`},
        ${listingUuid ? sql`${listingUuid}::uuid` : sql`null`},
        ${applicantName},
        ${request.buyerEmail ?? null},
        ${request.buyerPhone ?? null},
        ${request.propertyValue},
        ${request.currency},
        ${dashboardStatus}::public.financing_status,
        ${notes || null},
        '[]'::jsonb,
        ${request.id},
        ${request.buyerId},
        'marketplace',
        ${request.createdAt}::timestamptz,
        now()
      )
      on conflict (external_financing_id) where external_financing_id is not null
      do update set
        lead_id = coalesce(excluded.lead_id, financing_requests.lead_id),
        listing_id = coalesce(excluded.listing_id, financing_requests.listing_id),
        applicant_name = excluded.applicant_name,
        applicant_email = excluded.applicant_email,
        applicant_phone = excluded.applicant_phone,
        amount = excluded.amount,
        currency = excluded.currency,
        -- Preserve backoffice review decisions over stale marketplace pending
        status = case
          when financing_requests.status in ('reviewing', 'approved', 'rejected', 'cancelled')
            and excluded.status = 'pending'
          then financing_requests.status
          else excluded.status
        end,
        notes = excluded.notes,
        buyer_id = excluded.buyer_id,
        updated_at = now()
    `);
  } catch (error) {
    console.error("[financing-sync] failed to mirror financing to backoffice", error);
  }
}

export async function syncFinancingStatusToBackoffice(
  externalId: string,
  status: FinancingRequest["status"],
): Promise<void> {
  try {
    const dashboardStatus = mapStatusToDashboard(status);
    await db.execute(sql`
      update public.financing_requests
      set
        status = ${dashboardStatus}::public.financing_status,
        updated_at = now()
      where external_financing_id = ${externalId}
    `);
  } catch (error) {
    console.error("[financing-sync] failed to sync status", error);
  }
}
