import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import {
  quickPickIcon,
  quickPickTone,
} from "@/components/marketplace/marketplace-icons";
import type { MarketplaceQuickPick } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceQuickPick[];
};

export async function MobileQuickPicks({ items }: Props) {
  const t = await getTranslations("marketplace.quickPicks");
  if (items.length === 0) return null;

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
        {items.map((item) => {
          const Icon = quickPickIcon(item.id);
          const titleKey = `${item.id}.title`;
          const title =
            item.title?.trim() || (t.has(titleKey) ? t(titleKey) : item.id);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#F4F7FA] px-3 py-2"
            >
              <span
                className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ${quickPickTone(item.id)}`}
              >
                <Icon className="size-6 object-contain" />
              </span>
              <span className="text-[13px] font-semibold whitespace-nowrap text-[#0B1220]">
                {title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
