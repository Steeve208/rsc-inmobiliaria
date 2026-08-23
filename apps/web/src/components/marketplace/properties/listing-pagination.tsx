"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function pageItems(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("ellipsis");
  for (let value = start; value <= end; value += 1) items.push(value);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
}

export function ListingPagination({ page, totalPages, onChange }: Props) {
  const t = useTranslations("marketplace.listing");
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label={t("pagination")}>
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="inline-flex size-9 items-center justify-center rounded-md text-[#0B1220] hover:bg-white disabled:opacity-40"
        aria-label={t("previous")}
      >
        <ChevronLeft className="size-4" />
      </button>
      {pageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span key={`e-${index}`} className="px-1 text-sm text-[#9CA3AF]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-md text-sm font-semibold",
              item === page
                ? "bg-[#0B1220] text-white"
                : "text-[#0B1220] hover:bg-white",
            )}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="inline-flex size-9 items-center justify-center rounded-md text-[#0B1220] hover:bg-white disabled:opacity-40"
        aria-label={t("next")}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
