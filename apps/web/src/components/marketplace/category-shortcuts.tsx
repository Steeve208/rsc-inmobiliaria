import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { categoryIcon } from "@/components/marketplace/marketplace-icons";
import type { MarketplaceCategoryShortcut } from "@/lib/marketplace/types";

type Props = {
  items: MarketplaceCategoryShortcut[];
};

export async function CategoryShortcuts({ items }: Props) {
  const t = await getTranslations("marketplace.categories");
  if (items.length === 0) return null;

  return (
    <nav className="bg-white px-2 sm:px-4">
      <div className="flex h-[80px] gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:gap-1 lg:overflow-visible">
        {items.map((item) => {
          const Icon = categoryIcon(item.id);
          const label =
            item.label?.trim() || (t.has(item.id) ? t(item.id) : item.id);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex w-[70px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-center transition hover:bg-[#F4F7FA] lg:w-auto"
            >
              <Icon className="size-11 object-contain" priority />
              <span className="text-[10px] font-semibold leading-tight text-[#4B5563]">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
