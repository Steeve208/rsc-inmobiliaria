"use client";

import {
  Building2,
  Home,
  Landmark,
  Mountain,
  Palmtree,
  Store,
  Trees,
  Warehouse,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  activeType?: string;
  onSelect: (type: string) => void;
};

const categories = [
  { id: "house", icon: Home },
  { id: "apartment", icon: Building2 },
  { id: "land", icon: Trees },
  { id: "commercial", icon: Store },
  { id: "launches", icon: Warehouse },
  { id: "condo", icon: Landmark },
  { id: "beach", icon: Palmtree },
  { id: "countryside", icon: Mountain },
] as const;

export function CategoriesBar({ activeType, onSelect }: Props) {
  const t = useTranslations("imoveis.categories");

  return (
    <section className="pb-4 lg:pb-5">
      <div className="market-container">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:gap-3">
          {categories.map(({ id, icon: Icon }) => {
            const active = activeType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(active ? "" : id)}
                className={cn(
                  "group flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 transition-all sm:px-5 sm:py-3",
                  active
                    ? "bg-[#1d4ed8] text-white shadow-md shadow-[#1d4ed8]/25"
                    : "bg-white/[0.03] text-white/75 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    active
                      ? "bg-white/15"
                      : "bg-white/5 group-hover:bg-white/10",
                  )}
                >
                  <Icon
                    className={cn("size-4", active ? "text-white" : "text-[#60a5fa]")}
                    strokeWidth={1.75}
                  />
                </span>
                <span className="whitespace-nowrap text-sm font-medium">{t(id)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
