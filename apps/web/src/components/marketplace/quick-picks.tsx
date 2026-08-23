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

export async function QuickPicks() {
  const t = await getTranslations("marketplace.quickPicks");

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,.06)] ring-1 ring-black/[0.05]">
      <div className="px-3.5 py-2">
        <h2 className="text-[11px] font-bold tracking-[0.16em] text-[#0B1220] uppercase">
          {t("title")}
        </h2>
      </div>
      <ul className="flex flex-1 flex-col justify-between">
        {QUICK_PICKS.map((item) => {
          const Icon = icons[item.id];
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-1 transition hover:bg-[#F8FAFC]"
              >
                <Icon
                  className="size-[18px] shrink-0 text-[#1F2937]"
                  strokeWidth={1.7}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold leading-tight text-[#0B1220]">
                    {t(`${item.id}.title`)}
                  </span>
                  <span className="block text-[12px] leading-tight text-[#4B5563]">
                    {t(`${item.id}.subtitle`)}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-[#9CA3AF]" />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-2.5">
        <Link
          href="/imoveis"
          className="flex h-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#0B1220] transition hover:border-[#E8A84A] hover:text-[#C48A2A]"
        >
          {t("viewAll")}
        </Link>
      </div>
    </aside>
  );
}
