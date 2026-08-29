import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import {
  quickPickIcon,
  quickPickTone,
} from "@/components/marketplace/marketplace-icons";
import type { MarketplaceQuickPick } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceQuickPick[];
};

export async function QuickPicks({ items }: Props) {
  const t = await getTranslations("marketplace.quickPicks");
  if (items.length === 0) return null;

  return (
    <aside className="flex h-full flex-col bg-[#FAFBFC]">
      <div className="px-3.5 pb-1.5 pt-3.5">
        <h2 className="text-[11px] font-bold tracking-[0.14em] text-[#0B1220] uppercase">
          {t("title")}
        </h2>
      </div>
      <ul className="flex flex-1 flex-col justify-center gap-0.5">
        {items.map((item) => {
          const Icon = quickPickIcon(item.id);
          const titleKey = `${item.id}.title`;
          const subtitleKey = `${item.id}.subtitle`;
          const title = t.has(titleKey)
            ? t(titleKey)
            : item.title?.trim() || item.id;
          const subtitle = t.has(subtitleKey)
            ? t(subtitleKey)
            : item.subtitle?.trim() || "";
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-1.5 transition hover:bg-white"
              >
                <span
                  className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${quickPickTone(item.id)}`}
                >
                  <Icon className="size-7 object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold leading-tight text-[#0B1220]">
                    {title}
                  </span>
                  {subtitle ? (
                    <span className="block text-[11px] leading-tight text-[#6B7285]">
                      {subtitle}
                    </span>
                  ) : null}
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
