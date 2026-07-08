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

function visitWindow(date: string, time: string) {
  const starts = new Date(`${date}T${time}:00`);
  const ends = new Date(starts.getTime() + 60 * 60 * 1000);
  return { starts, ends };
}

export async function syncVisitToBackoffice(visit: ScheduledVisit): Promise<void> {
  try {
    const organizationId = await resolveOrganizationId(visit.companyId);
    if (!organizationId) {
      console.warn(`[visit-sync] organization not found for slug: ${visit.companyId}`);
      return;
    }

    const listingId = await resolveListingUuid(visit.listingId);
    const { starts, ends } = visitWindow(visit.preferredDate, visit.preferredTime);
    const description = [
      visit.buyerName,
      visit.buyerPhone,
      visit.buyerEmail,
      visit.notes,
    ]
      .filter(Boolean)
      .join(" · ");

    await db.execute(sql`
      insert into public.appointments (
        organization_id,
        title,
        description,
        type,
        status,
        starts_at,
        ends_at,
        listing_id,
        external_visit_id,
        buyer_id,
        buyer_name,
        buyer_phone,
        buyer_email,
        source,
        market_status,
        company_message,
        proposed_date,
        proposed_time,
        created_at,
        updated_at
      ) values (
        ${organizationId}::uuid,
        ${`Visita — ${visit.listingTitle}`},
        ${description || null},
        'visit',
        'scheduled',
        ${starts.toISOString()}::timestamptz,
        ${ends.toISOString()}::timestamptz,
        ${listingId ? sql`${listingId}::uuid` : sql`null`},
        ${visit.id},
        ${visit.buyerId},
        ${visit.buyerName},
        ${visit.buyerPhone},
        ${visit.buyerEmail ?? null},
        'marketplace',
        ${visit.status},
        ${visit.companyMessage ?? null},
        ${visit.proposedDate ?? null},
        ${visit.proposedTime ?? null},
        ${visit.createdAt}::timestamptz,
        now()
      )
      on conflict (external_visit_id) where external_visit_id is not null
      do update set
        title = excluded.title,
        description = excluded.description,
        starts_at = excluded.starts_at,
        ends_at = excluded.ends_at,
        listing_id = excluded.listing_id,
        buyer_name = excluded.buyer_name,
        buyer_phone = excluded.buyer_phone,
        buyer_email = excluded.buyer_email,
        market_status = excluded.market_status,
        company_message = excluded.company_message,
        proposed_date = excluded.proposed_date,
        proposed_time = excluded.proposed_time,
        updated_at = now()
    `);
  } catch (error) {
    console.error("[visit-sync] failed to mirror visit to backoffice", error);
  }
}
