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
};

export function MarketplaceCarousel({
  title,
  href,
  hrefLabel,
  children,
  className,
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
    <section className={cn("py-5 sm:py-6", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="rk-display text-lg font-bold tracking-tight text-[#0B1220] sm:text-xl">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {href && hrefLabel ? (
            <Link
              href={href}
              className="hidden text-sm font-semibold text-[#0B1220] hover:text-[#D4A62A] sm:inline"
            >
              {hrefLabel}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="hidden size-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#374151] transition hover:border-[#D4A62A] hover:text-[#D4A62A] md:inline-flex"
            aria-label="Previous"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="hidden size-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#374151] transition hover:border-[#D4A62A] hover:text-[#D4A62A] md:inline-flex"
            aria-label="Next"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}
