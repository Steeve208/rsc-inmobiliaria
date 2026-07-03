"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearCompareProperties,
  getComparePropertyIds,
  removeCompareProperty,
  toggleCompareProperty,
} from "@/hooks/use-property-compare";

export function usePropertyCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getComparePropertyIds());
  }, []);

  const toggle = useCallback((id: string) => {
    const next = toggleCompareProperty(id);
    setIds(next);
    return next;
  }, []);

  const remove = useCallback((id: string) => {
    const next = removeCompareProperty(id);
    setIds(next);
    return next;
  }, []);

  const clear = useCallback(() => {
    clearCompareProperties();
    setIds([]);
  }, []);

  const isCompared = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, toggle, remove, clear, isCompared, canAdd: ids.length < 3 };
}
