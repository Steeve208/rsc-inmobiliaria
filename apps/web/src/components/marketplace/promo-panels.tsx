import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { PROMO_PANELS } from "@/lib/marketplace/catalog";
import { cn } from "@/lib/utils";

const panelTheme = {
  premium: {
    bg: "bg-[#0B3A6A]",
    fade: "from-[#0B3A6A] from-30% via-[#0B3A6A]/75 to-transparent",
  },
  projects: {
    bg: "bg-[#0F766E]",
    fade: "from-[#0F766E] from-30% via-[#0F766E]/75 to-transparent",
  },
  vehicles: {
    bg: "bg-[#5B21B6]",
    fade: "from-[#5B21B6] from-30% via-[#6D28D9]/75 to-transparent",
  },
  hot: {
    bg: "bg-[#DC2626]",
    fade: "from-[#DC2626] from-35% via-[#DC2626]/70 to-transparent",
  },
} as const;

function HotTagsGraphic() {
  return (
    <div className="absolute inset-y-0 right-0 w-[58%] overflow-hidden" aria-hidden>
      <span className="absolute -right-4 top-1 size-24 rounded-full bg-[#F59E0B]/35 blur-2xl" />
      <span className="absolute bottom-0 right-6 size-16 rounded-full bg-[#FBBF24]/40 blur-xl" />
      <span className="absolute right-[18%] top-3 flex size-[4.25rem] -rotate-[18deg] items-center justify-center rounded-full bg-[#E11D2E] text-[1.65rem] font-black text-white shadow-[0_10px_18px_rgba(0,0,0,.28)] ring-[3px] ring-white/35">
        %
      </span>
      <span className="absolute right-2 top-[42%] flex size-14 rotate-[16deg] items-center justify-center rounded-full bg-[#BE123C] text-xl font-black text-white shadow-[0_8px_16px_rgba(0,0,0,.28)] ring-[3px] ring-white/30">
        %
      </span>
      <span className="absolute bottom-3 right-[38%] flex size-11 -rotate-[8deg] items-center justify-center rounded-full bg-[#9F1239] text-base font-black text-white shadow-[0_6px_12px_rgba(0,0,0,.25)] ring-[3px] ring-white/25">
        %
      </span>
      <span className="absolute bottom-5 right-3 size-3 rounded-full bg-[#FBBF24]" />
      <span className="absolute top-10 right-[8%] size-2 rounded-full bg-[#FDE68A]" />
    </div>
  );
}

export async function PromoPanels() {
  const t = await getTranslations("marketplace.promos");

  return (
    <div className="grid grid-cols-1 gap-3 lg:h-full lg:grid-rows-4">
      {PROMO_PANELS.map((panel) => {
        const theme = panelTheme[panel.id];
        return (
          <Link
            key={panel.id}
            href={panel.href}
            className={cn(
              "group relative flex min-h-[88px] overflow-hidden rounded-2xl lg:min-h-0",
              theme.bg,
            )}
          >
            {panel.graphic === "tags" ? (
              <HotTagsGraphic />
            ) : panel.image ? (
              <div className="absolute inset-y-0 right-0 w-[58%]">
                <Image
                  src={panel.image}
                  alt=""
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="280px"
                />
              </div>
            ) : null}
            <div className={cn("absolute inset-0 bg-gradient-to-r", theme.fade)} />
            <div className="relative z-10 flex max-w-[68%] flex-col justify-center px-3 py-2 text-white">
              <p className="text-[13px] font-bold leading-tight tracking-tight">
                {t(`${panel.id}.title`)}
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-white/85">
                {t(`${panel.id}.subtitle`)}
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold">
                {t(`cta.${panel.ctaKey}`)}
                <ArrowRight className="size-3.5" strokeWidth={2.5} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
