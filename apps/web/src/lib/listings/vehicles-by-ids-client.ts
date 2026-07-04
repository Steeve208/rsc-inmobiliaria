import type { VehicleListing } from "@/features/veiculos/types";

export async function fetchVehiclesByIds(ids: string[]): Promise<VehicleListing[]> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return [];

  const params = new URLSearchParams({ ids: uniqueIds.join(",") });
  const res = await fetch(`/api/listings/vehicles?${params}`);

  if (!res.ok) {
    throw new Error("vehicles_by_ids_failed");
  }

  return (await res.json()) as VehicleListing[];
}
