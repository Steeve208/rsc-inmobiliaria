"use client";

import { X } from "lucide-react";
import { buildFilterTags } from "../utils/filter-tags";
import type { VeiculosFilters } from "../types";

type Props = {
  filters: VeiculosFilters;
  labels: Parameters<typeof buildFilterTags>[1];
  onRemove: (clear: Partial<VeiculosFilters>) => void;
  onClearAll: () => void;
  clearAllLabel: string;
};

export function ActiveFilterTags({
  filters,
  labels,
  onRemove,
  onClearAll,
  clearAllLabel,
}: Props) {
  const tags = buildFilterTags(filters, labels);
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#22c55e]/10 px-3 py-1 text-xs font-medium text-[#86efac]"
        >
          {tag.label}
          <button
            type="button"
            onClick={() => onRemove(tag.clear)}
            className="rounded-full p-0.5 transition-colors hover:bg-[#22c55e]/20"
            aria-label={`Remove ${tag.label}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-white/40 transition-colors hover:text-white/70"
      >
        {clearAllLabel}
      </button>
    </div>
  );
}
