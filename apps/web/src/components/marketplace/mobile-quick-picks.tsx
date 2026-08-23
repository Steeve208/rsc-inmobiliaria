import { getTranslations } from "next-intl/server";
import {
  Building2,
  Car,
  ChevronRight,
  Construction,
  Gem,
  Home,
  KeyRound,
  Trees,
} from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { QUICK_PICKS } from "@/lib/marketplace/catalog";

const icons = {
  propertiesUnder: Home,
  luxury: Gem,
  rentals: KeyRound,
  carsUnder: Car,
  projects: Construction,
  commercial: Building2,
  land: Trees,
} as const;

export async function MobileQuickPicks() {
  const t = await getTranslations("marketplace.quickPicks");

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-bold tracking-[0.18em] text-[#0B1220] uppercase">
          {t("title")}
        </h2>
        <Link href="/imoveis" className="text-xs font-semibold text-[#6B7285]">
          {t("viewAll")}
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_PICKS.map((item) => {
          const Icon = icons[item.id];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex w-[210px] shrink-0 items-center gap-3 rounded-2xl bg-white p-2.5 ring-1 ring-black/[0.04]"
            >
              <Icon className="size-5 shrink-0 text-[#1F2937]" strokeWidth={1.6} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#0B1220]">
                  {t(`${item.id}.title`)}
                </span>
                <span className="block text-xs text-[#6B7285]">
                  {t(`${item.id}.subtitle`)}
                </span>
              </span>
              <ChevronRight className="size-4 text-[#D1D5DB]" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
