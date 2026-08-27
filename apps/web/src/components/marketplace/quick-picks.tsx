import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { QUICK_PICKS } from "@/lib/marketplace/catalog";
import {
  IconApartments,
  IconCars,
  IconCommercial,
  IconLand,
  IconLuxury,
  IconProjects,
  IconProperties,
  QUICK_PICK_TONES,
} from "@/components/marketplace/marketplace-icons";

const icons = {
  propertiesUnder: IconProperties,
  luxury: IconLuxury,
  rentals: IconApartments,
  carsUnder: IconCars,
  projects: IconProjects,
  commercial: IconCommercial,
  land: IconLand,
} as const;

export async function QuickPicks() {
  const t = await getTranslations("marketplace.quickPicks");

  return (
    <aside className="flex h-full flex-col bg-[#FAFBFC]">
      <div className="px-3.5 pb-1.5 pt-3.5">
        <h2 className="text-[11px] font-bold tracking-[0.14em] text-[#0B1220] uppercase">
          {t("title")}
        </h2>
      </div>
      <ul className="flex flex-1 flex-col justify-center gap-0.5">
        {QUICK_PICKS.map((item) => {
          const Icon = icons[item.id];
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-1.5 transition hover:bg-white"
              >
                <span
                  className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${QUICK_PICK_TONES[item.id]}`}
                >
                  <Icon className="size-[22px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold leading-tight text-[#0B1220]">
                    {t(`${item.id}.title`)}
                  </span>
                  <span className="block text-[11px] leading-tight text-[#6B7285]">
                    {t(`${item.id}.subtitle`)}
                  </span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-[#C5CAD3]" strokeWidth={2} />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="px-3.5 pb-3.5 pt-1">
        <Link
          href="/imoveis"
          className="flex h-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#4B5563] transition hover:border-[#EBAD5B] hover:text-[#D49A3F]"
        >
          {t("viewAll")}
        </Link>
      </div>
    </aside>
  );
}
