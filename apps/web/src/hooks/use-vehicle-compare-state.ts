"use client";

import { useVehicleCompareContext } from "@/lib/providers/vehicle-compare-provider";

export function useVehicleCompare() {
  return useVehicleCompareContext();
}
