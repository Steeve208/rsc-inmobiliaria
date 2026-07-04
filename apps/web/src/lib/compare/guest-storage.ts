const STORAGE_KEY = "rsc_compare_properties";
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

export function readGuestCompareIds(): string[] {
  if (!canUseStorage()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? normalizeIds(parsed) : [];
  } catch {
    return [];
  }
}

export function writeGuestCompareIds(ids: string[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeIds(ids)));
}

export function clearGuestCompareIds() {
  if (!canUseStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function toggleGuestCompareId(listingId: string): string[] {
  const current = readGuestCompareIds();
  const next = current.includes(listingId)
    ? current.filter((id) => id !== listingId)
    : current.length >= MAX_COMPARE_ITEMS
      ? [...current.slice(1), listingId]
      : [...current, listingId];

  writeGuestCompareIds(next);
  return next;
}

export function removeGuestCompareId(listingId: string): string[] {
  const next = readGuestCompareIds().filter((id) => id !== listingId);
  writeGuestCompareIds(next);
  return next;
}
