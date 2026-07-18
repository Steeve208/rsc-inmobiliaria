import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import type { FinancingRequestStatus } from "./types";

type FinancingOrder = {
  external_financing_id: string;
  status: string;
};

function mapStatusToMarket(status: string): FinancingRequestStatus | null {
  if (status === "reviewing") return "in_analysis";
  if (status === "cancelled") return "rejected";
  if (
    status === "pending" ||
    status === "in_analysis" ||
    status === "approved" ||
    status === "rejected"
  ) {
    return status;
  }
  return null;
}

/**
 * Apply backoffice financing decisions onto market financing_request rows.
 */
export async function pullFinancingOrdersFromBackoffice(
  financingIds: string[],
): Promise<number> {
  const ids = [...new Set(financingIds.filter(Boolean))];
  if (ids.length === 0) return 0;

  try {
    const rows = await db.execute<FinancingOrder>(sql`
      select
        external_financing_id,
        status::text as status
      from public.financing_requests
      where source = 'marketplace'
        and external_financing_id = any(${ids})
    `);

    let applied = 0;

    for (const row of rows) {
      if (!row.external_financing_id) continue;
      const status = mapStatusToMarket(row.status);
      if (!status) continue;

      const result = await db.execute<{ id: string }>(sql`
        update public.financing_request
        set
          status = ${status},
          updated_at = now()
        where id = ${row.external_financing_id}
          and status is distinct from ${status}
        returning id
      `);

      if (result.length > 0) applied += 1;
    }

    return applied;
  } catch (error) {
    console.error("[backoffice-orders] financing pull failed", error);
    return 0;
  }
}
