"use client";

import { useRef, type ReactNode } from "react";
import { Link } from "@/lib/i18n/routing";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  className?: string;
  /** Equal-width grid columns on desktop (e.g. 5 for properties) */
  columns?: number;
};

export function MarketplaceCarousel({
  title,
  href,
  hrefLabel,
  children,
  className,
  columns,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.8, 640);
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("min-w-0", className)}>
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <h2 className="rk-display text-base font-bold tracking-tight text-[#0B1220]">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {href && hrefLabel ? (
            <Link
              href={href}
              className="hidden text-[13px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] sm:inline"
            >
              {hrefLabel}
            </Link>
          ) : null}
          {!columns ? (
            <>
              <button
                type="button"
                onClick={() => scroll("left")}
                className="hidden size-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#374151] transition hover:border-[#D49A3F] hover:text-[#D49A3F] md:inline-flex"
                aria-label="Previous"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="hidden size-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#374151] transition hover:border-[#D49A3F] hover:text-[#D49A3F] md:inline-flex"
                aria-label="Next"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </>
          ) : null}
        </div>
      </div>
      {columns ? (
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {children}
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      )}
    </section>
  );
}
