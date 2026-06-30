"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { marketplace } from "@/lib/layout/marketplace";
import { VehicleCard } from "./vehicle-card";
import type { VehicleListing } from "../types";

type Props = {
  title: string;
  subtitle?: string;
  items: VehicleListing[];
  badge?: string;
};

export function ListingCarousel({ title, subtitle, items, badge }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="market-section">
      <div className="market-container">
        <div className={`${marketplace.headerGap} flex items-end justify-between gap-4`}>
          <div>
            {badge && (
              <span className="mb-3 inline-block rounded-full bg-[#22c55e]/15 px-3 py-1 text-xs font-semibold text-[#86efac]">
                {badge}
              </span>
            )}
            <h2 className={marketplace.title}>{title}</h2>
            {subtitle && <p className={marketplace.subtitle}>{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
              aria-label="Next"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className={marketplace.cardTrack}>
          {items.map((item) => (
            <div key={item.id} className="w-[280px] shrink-0 sm:w-[300px]">
              <VehicleCard item={item} variant="gallery" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
