"use client";

const STORAGE_KEY = "rsc_compare_properties";
const MAX_ITEMS = 3;

export function getComparePropertyIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

export function toggleCompareProperty(id: string): string[] {
  const current = getComparePropertyIds();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : current.length >= MAX_ITEMS
      ? [...current.slice(1), id]
      : [...current, id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeCompareProperty(id: string): string[] {
  const next = getComparePropertyIds().filter((item) => item !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearCompareProperties() {
  localStorage.removeItem(STORAGE_KEY);
}
