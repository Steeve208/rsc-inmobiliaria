import { getTranslations } from "next-intl/server";
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

export async function MobileQuickPicks() {
  const t = await getTranslations("marketplace.quickPicks");

  return (
    <div className="px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-bold tracking-[0.14em] text-[#0B1220] uppercase">
          {t("title")}
        </h2>
        <Link href="/imoveis" className="text-xs font-semibold text-[#D49A3F]">
          {t("viewAll")}
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_PICKS.map((item) => {
          const Icon = icons[item.id];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#F4F7FA] px-3 py-2"
            >
              <span
                className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ${QUICK_PICK_TONES[item.id]}`}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-[13px] font-semibold whitespace-nowrap text-[#0B1220]">
                {t(`${item.id}.title`)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
