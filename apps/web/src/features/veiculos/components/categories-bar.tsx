"use client";

import {
  Battery,
  Bike,
  Bus,
  Car,
  CarFront,
  Gauge,
  Tractor,
  Truck,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { VehicleCategory } from "../types";

type Props = {
  activeType?: VehicleCategory | "";
  onSelect: (type: VehicleCategory | "") => void;
};

const categories: {
  id: VehicleCategory;
  icon: typeof Car;
}[] = [
  { id: "car", icon: Car },
  { id: "suv", icon: CarFront },
  { id: "sports", icon: Gauge },
  { id: "van", icon: Bus },
  { id: "truck", icon: Truck },
  { id: "motorcycle", icon: Bike },
  { id: "machinery", icon: Tractor },
  { id: "electric", icon: Zap },
  { id: "hybrid", icon: Battery },
];

export function CategoriesBar({ activeType, onSelect }: Props) {
  const t = useTranslations("veiculos.categories");

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
                    ? "bg-[#22c55e] text-[#041008] shadow-md shadow-[#22c55e]/25"
                    : "bg-white/[0.03] text-white/75 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-colors",
                    active
                      ? "bg-black/15"
                      : "bg-white/5 group-hover:bg-white/10",
                  )}
                >
                  <Icon
                    className={cn("size-4", active ? "text-[#041008]" : "text-[#86efac]")}
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
