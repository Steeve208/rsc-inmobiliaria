import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import type { VisitStatus } from "./types";

type AppointmentOrder = {
  external_visit_id: string;
  market_status: string | null;
  company_message: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
};

function isVisitStatus(value: string | null | undefined): value is VisitStatus {
  return (
    value === "pending" ||
    value === "confirmed" ||
    value === "cancelled" ||
    value === "reschedule_proposed"
  );
}

/**
 * Apply backoffice appointment orders onto market scheduled_visit rows.
 * Ensures buyer UI follows company accept / reschedule / cancel decisions.
 */
export async function pullVisitOrdersFromBackoffice(
  visitIds: string[],
): Promise<number> {
  const ids = [...new Set(visitIds.filter(Boolean))];
  if (ids.length === 0) return 0;

  try {
    const rows = await db.execute<AppointmentOrder>(sql`
      select
        external_visit_id,
        market_status,
        company_message,
        proposed_date,
        proposed_time,
        to_char(starts_at, 'YYYY-MM-DD') as preferred_date,
        to_char(starts_at, 'HH24:MI') as preferred_time
      from public.appointments
      where source = 'marketplace'
        and external_visit_id = any(${ids})
    `);

    let applied = 0;

    for (const row of rows) {
      if (!row.external_visit_id || !isVisitStatus(row.market_status)) continue;

      const status = row.market_status;
      const clearProposal = status === "confirmed" || status === "cancelled";
      const proposedDate = clearProposal ? null : row.proposed_date;
      const proposedTime = clearProposal ? null : row.proposed_time;
      const preferredDate = row.preferred_date;
      const preferredTime = row.preferred_time;

      const result = await db.execute<{ id: string }>(sql`
        update public.scheduled_visit
        set
          status = ${status},
          company_message = ${row.company_message},
          proposed_date = ${proposedDate},
          proposed_time = ${proposedTime},
          preferred_date = coalesce(${preferredDate}, preferred_date),
          preferred_time = coalesce(${preferredTime}, preferred_time)
        where id = ${row.external_visit_id}
          and (
            status is distinct from ${status}
            or company_message is distinct from ${row.company_message}
            or proposed_date is distinct from ${proposedDate}
            or proposed_time is distinct from ${proposedTime}
            or (
              ${preferredDate}::text is not null
              and preferred_date is distinct from ${preferredDate}
            )
            or (
              ${preferredTime}::text is not null
              and preferred_time is distinct from ${preferredTime}
            )
          )
        returning id
      `);

      if (result.length > 0) applied += 1;
    }

    return applied;
  } catch (error) {
    console.error("[backoffice-orders] visit pull failed", error);
    return 0;
  }
}
