"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ImoveisFilters } from "../types";

type Props = {
  transaction: ImoveisFilters["transaction"];
  onChange: (transaction: ImoveisFilters["transaction"]) => void;
};

const tabs = [
  { id: "buy" as const, labelKey: "buy" },
  { id: "rent" as const, labelKey: "rent" },
];

export function TransactionTabs({ transaction, onChange }: Props) {
  const t = useTranslations("imoveis.search");

  return (
    <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
      {tabs.map(({ id, labelKey }) => {
        const active = transaction === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(active ? "" : id)}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              active
                ? "bg-[#1d4ed8] text-white shadow-sm shadow-[#1d4ed8]/25"
                : "text-white/65 hover:bg-white/[0.06] hover:text-white",
            )}
          >
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
