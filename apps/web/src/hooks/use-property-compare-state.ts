"use client";

import { useCompareContext } from "@/lib/providers/compare-provider";

export function usePropertyCompare() {
  return useCompareContext();
}
