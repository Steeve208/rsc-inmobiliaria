import type { ScheduledVisit, UpdateVisitInput, VisitStatus } from "./types";

/**
 * Buyers may cancel, accept/decline reschedules, or adjust their slot.
 * Company-only fields (companyMessage, arbitrary status) are stripped.
 */
export function sanitizeBuyerVisitUpdate(
  existing: ScheduledVisit,
  body: UpdateVisitInput,
): UpdateVisitInput | { error: string } {
  const update: UpdateVisitInput = { visitId: body.visitId };

  if (body.preferredDate !== undefined) {
    update.preferredDate = body.preferredDate;
  }
  if (body.preferredTime !== undefined) {
    update.preferredTime = body.preferredTime;
  }

  if (body.status !== undefined) {
    const allowed = buyerAllowedStatus(existing.status, body.status);
    if (!allowed) {
      return { error: "buyer_status_not_allowed" };
    }
    update.status = body.status;
  }

  // Declining a reschedule clears the proposal (empty strings).
  if (existing.status === "reschedule_proposed" && body.status === "pending") {
    update.proposedDate = "";
    update.proposedTime = "";
  } else if (
    body.proposedDate !== undefined ||
    body.proposedTime !== undefined ||
    body.companyMessage !== undefined
  ) {
    return { error: "buyer_fields_not_allowed" };
  }

  return update;
}

function buyerAllowedStatus(
  current: VisitStatus,
  next: VisitStatus,
): boolean {
  if (next === "cancelled") return true;
  if (current === "reschedule_proposed" && next === "confirmed") return true;
  if (current === "reschedule_proposed" && next === "pending") return true;
  return false;
}
