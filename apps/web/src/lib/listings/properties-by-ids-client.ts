import type { PropertyListing } from "@/features/imoveis/types";

export async function fetchPropertiesByIds(ids: string[]): Promise<PropertyListing[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const params = new URLSearchParams({ ids: uniqueIds.join(",") });
  const res = await fetch(`/api/listings/properties?${params}`);

  if (!res.ok) {
    throw new Error("properties_by_ids_failed");
  }

  return (await res.json()) as PropertyListing[];
}
