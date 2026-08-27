import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { PROMO_PANELS } from "@/lib/marketplace/catalog";
import { cn } from "@/lib/utils";

function HotTagsGraphic() {
  return (
    <div className="absolute inset-y-0 right-0 w-[58%] overflow-hidden" aria-hidden>
      <span className="absolute -right-2 top-0 size-14 rounded-full bg-white/20 blur-xl" />
      <span className="absolute right-[12%] top-1 flex size-9 -rotate-[18deg] items-center justify-center rounded-full bg-white/25 text-sm font-black text-white shadow-sm">
        %
      </span>
      <span className="absolute right-1 top-[48%] flex size-7 rotate-[14deg] items-center justify-center rounded-full bg-white/20 text-xs font-black text-white">
        %
      </span>
      <span className="absolute right-[28%] bottom-1 flex size-6 -rotate-[8deg] items-center justify-center rounded-full bg-white/15 text-[10px] font-black text-white">
        %
      </span>
    </div>
  );
}

const PANEL_STYLE: Record<
  string,
  { gradient: string; solid?: string }
> = {
  premium: {
    gradient: "from-[#0B1220] via-[#0B1220]/90 to-[#0B1220]/20",
  },
  projects: {
    gradient: "from-[#0F3D3A] via-[#0F766E]/85 to-[#14B8A6]/25",
    solid: "bg-[#0F766E]",
  },
  vehicles: {
    gradient: "from-[#3B0764] via-[#6B21A8]/90 to-[#A855F7]/30",
    solid: "bg-[#6B21A8]",
  },
  hot: {
    gradient: "from-[#B91C1C] via-[#DC2626] to-[#EF4444]/80",
    solid: "bg-[#DC2626]",
  },
};

export async function PromoPanels() {
  const t = await getTranslations("marketplace.promos");

  return (
    <div className="flex h-full flex-col gap-1.5 bg-transparent p-1.5 lg:p-2">
      {PROMO_PANELS.map((panel) => {
        const isHot = panel.graphic === "tags";
        const style = PANEL_STYLE[panel.id] ?? PANEL_STYLE.premium;
        return (
          <Link
            key={panel.id}
            href={panel.href}
            className={cn(
              "group relative flex min-h-[58px] flex-1 overflow-hidden rounded-xl lg:min-h-0",
              style.solid,
              !style.solid && "bg-[#0B1220]",
            )}
          >
            {isHot ? (
              <HotTagsGraphic />
            ) : panel.image ? (
              <div className="absolute inset-y-0 right-0 w-[54%]">
                <Image
                  src={panel.image}
                  alt=""
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
            ) : null}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r",
                style.gradient,
              )}
            />
            <div className="relative z-10 flex max-w-[70%] flex-col justify-center px-3 py-2 text-white">
              <p className="text-[12px] font-bold leading-tight tracking-tight">
                {t(`${panel.id}.title`)}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-white/80">
                {t(`${panel.id}.subtitle`)}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-white">
                {t(`cta.${panel.ctaKey}`)}
                <ArrowRight className="size-3" strokeWidth={2.5} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
