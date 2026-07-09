import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import type { ScheduledVisit } from "./types";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
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

async function resolveListingUuid(listingId: string): Promise<string | null> {
  if (!isUuid(listingId)) return null;

  const rows = await db.execute<{ id: string }>(sql`
    select id::text as id
    from public.listings
    where id = ${listingId}::uuid
    limit 1
  `);
  return rows[0]?.id ?? null;
}

export type MarketplaceLeadInput = {
  organizationId: string;
  buyerId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  listingId?: string | null;
  notes?: string | null;
};

export async function upsertMarketplaceLead(
  input: MarketplaceLeadInput,
): Promise<string | null> {
  try {
    const listingUuid =
      input.listingId && isUuid(input.listingId)
        ? input.listingId
        : input.listingId
          ? await resolveListingUuid(input.listingId)
          : null;

    const rows = await db.execute<{ id: string }>(sql`
      insert into public.leads (
        organization_id,
        name,
        phone,
        email,
        listing_id,
        status,
        buyer_id,
        source,
        notes,
        created_at,
        updated_at
      ) values (
        ${input.organizationId}::uuid,
        ${input.name},
        ${input.phone ?? null},
        ${input.email ?? null},
        ${listingUuid ? sql`${listingUuid}::uuid` : sql`null`},
        'new',
        ${input.buyerId},
        'marketplace',
        ${input.notes ?? null},
        now(),
        now()
      )
      on conflict (organization_id, buyer_id) where buyer_id is not null
      do update set
        name = excluded.name,
        phone = coalesce(excluded.phone, leads.phone),
        email = coalesce(excluded.email, leads.email),
        listing_id = coalesce(excluded.listing_id, leads.listing_id),
        notes = case
          when excluded.notes is not null
            and excluded.notes is distinct from coalesce(leads.notes, '')
          then trim(both from coalesce(leads.notes || E'\n', '') || excluded.notes)
          else leads.notes
        end,
        updated_at = now()
      returning id::text as id
    `);

    return rows[0]?.id ?? null;
  } catch (error) {
    console.error("[lead-sync] failed to upsert lead", error);
    return null;
  }
}

export async function syncLeadFromVisit(visit: ScheduledVisit): Promise<void> {
  const organizationId = await resolveOrganizationId(visit.companyId);
  if (!organizationId) {
    console.warn(`[lead-sync] organization not found for slug: ${visit.companyId}`);
    return;
  }

  const leadId = await upsertMarketplaceLead({
    organizationId,
    buyerId: visit.buyerId,
    name: visit.buyerName,
    phone: visit.buyerPhone,
    email: visit.buyerEmail,
    listingId: visit.listingId,
    notes: `Visita solicitada: ${visit.preferredDate} ${visit.preferredTime}`,
  });

  if (!leadId) return;

  try {
    await db.execute(sql`
      update public.appointments
      set lead_id = ${leadId}::uuid, updated_at = now()
      where external_visit_id = ${visit.id}
        and (lead_id is null or lead_id <> ${leadId}::uuid)
    `);
  } catch (error) {
    console.warn("[lead-sync] failed to link appointment to lead", error);
  }
}

export async function syncLeadFromChatThread(input: {
  companyId: string;
  buyerId: string;
  buyerName: string;
  listingId: string;
  buyerPhone?: string | null;
  buyerEmail?: string | null;
}): Promise<void> {
  const organizationId = await resolveOrganizationId(input.companyId);
  if (!organizationId) return;

  await upsertMarketplaceLead({
    organizationId,
    buyerId: input.buyerId,
    name: input.buyerName,
    phone: input.buyerPhone,
    email: input.buyerEmail,
    listingId: input.listingId,
    notes: "Contacto vía chat del marketplace",
  });
}

export async function syncAllLeadsForBuyer(
  buyerId: string,
  profile?: { name?: string; email?: string | null; phone?: string | null },
): Promise<number> {
  let synced = 0;

  const visits = await db.execute<{
    company_id: string;
    buyer_id: string;
    buyer_name: string;
    buyer_phone: string;
    buyer_email: string | null;
    listing_id: string;
    preferred_date: string;
    preferred_time: string;
  }>(sql`
    select
      company_id,
      buyer_id,
      buyer_name,
      buyer_phone,
      buyer_email,
      listing_id,
      preferred_date,
      preferred_time
    from public.scheduled_visit
    where buyer_id = ${buyerId}
  `);

  for (const visit of visits) {
    const organizationId = await resolveOrganizationId(visit.company_id);
    if (!organizationId) continue;

    const leadId = await upsertMarketplaceLead({
      organizationId,
      buyerId: visit.buyer_id,
      name: profile?.name ?? visit.buyer_name,
      phone: profile?.phone ?? visit.buyer_phone,
      email: profile?.email ?? visit.buyer_email,
      listingId: visit.listing_id,
      notes: `Visita solicitada: ${visit.preferred_date} ${visit.preferred_time}`,
    });

    if (leadId) synced += 1;
  }

  const threads = await db.execute<{
    company_id: string;
    buyer_id: string;
    buyer_name: string;
    listing_id: string;
  }>(sql`
    select company_id, buyer_id, buyer_name, listing_id
    from public.chat_thread
    where buyer_id = ${buyerId}
  `);

  for (const thread of threads) {
    const organizationId = await resolveOrganizationId(thread.company_id);
    if (!organizationId) continue;

    const leadId = await upsertMarketplaceLead({
      organizationId,
      buyerId: thread.buyer_id,
      name: profile?.name ?? thread.buyer_name,
      phone: profile?.phone ?? null,
      email: profile?.email ?? null,
      listingId: thread.listing_id,
      notes: "Contacto vía chat del marketplace",
    });

    if (leadId) synced += 1;
  }

  return synced;
}
