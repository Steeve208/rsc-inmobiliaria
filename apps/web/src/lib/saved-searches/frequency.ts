import type { SavedSearchAlertFrequency } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

export function shouldSendAlertForFrequency(
  frequency: SavedSearchAlertFrequency,
  lastAlertAt: Date | null,
  now = new Date(),
): boolean {
  if (frequency === "instant") return true;
  if (!lastAlertAt) return true;

  const elapsed = now.getTime() - lastAlertAt.getTime();
  if (frequency === "daily") return elapsed >= DAY_MS;
  if (frequency === "weekly") return elapsed >= WEEK_MS;
  return false;
}
