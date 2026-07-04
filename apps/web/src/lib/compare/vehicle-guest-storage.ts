const STORAGE_KEY = "rsc_compare_vehicles";
export const MAX_COMPARE_ITEMS = 3;

function canUseStorage() {
  return typeof window !== "undefined";
}

function normalizeIds(ids: string[]) {
  const unique: string[] = [];
  for (const id of ids) {
    if (typeof id === "string" && id.length > 0 && !unique.includes(id)) {
      unique.push(id);
    }
  }
  return unique.slice(0, MAX_COMPARE_ITEMS);
}

export function readGuestVehicleCompareIds(): string[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? normalizeIds(parsed) : [];
  } catch {
    return [];
  }
}

export function writeGuestVehicleCompareIds(ids: string[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeIds(ids)));
}

export function clearGuestVehicleCompareIds() {
  if (!canUseStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function toggleGuestVehicleCompareId(listingId: string): string[] {
  const current = readGuestVehicleCompareIds();
  const next = current.includes(listingId)
    ? current.filter((id) => id !== listingId)
    : current.length >= MAX_COMPARE_ITEMS
      ? [...current.slice(1), listingId]
      : [...current, listingId];

  writeGuestVehicleCompareIds(next);
  return next;
}

export function removeGuestVehicleCompareId(listingId: string): string[] {
  const next = readGuestVehicleCompareIds().filter((id) => id !== listingId);
  writeGuestVehicleCompareIds(next);
  return next;
}
