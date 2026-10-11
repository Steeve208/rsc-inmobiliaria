"use client";

import { useTranslations } from "next-intl";
import type { PropertySort } from "../types";

type Props = {
  sort: PropertySort;
  totalCount: number;
  visibleCount: number;
  onSortChange: (sort: PropertySort) => void;
  onSaveSearch?: () => void;
  saveDisabled?: boolean;
};

const sortOptions: PropertySort[] = [
  "relevance",
  "price_asc",
  "price_desc",
  "area_desc",
  "newest",
];

export function ResultsToolbar({
  sort,
  totalCount,
  visibleCount,
  onSortChange,
}: Props) {
  const t = useTranslations("imoveis.results");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-white/55">
        {visibleCount < totalCount
          ? t("showingCount", { visible: visibleCount, total: totalCount })
          : t("count", { count: totalCount })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/75">
          <span className="text-white/45">{t("sortLabel")}</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as PropertySort)}
            className="bg-transparent text-white outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option} className="bg-[#0a111f]">
                {t(`sort.${option}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
