import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { CATEGORY_SHORTCUTS } from "@/lib/marketplace/catalog";
import { CATEGORY_ICONS } from "@/components/marketplace/marketplace-icons";

export async function CategoryShortcuts() {
  const t = await getTranslations("marketplace.categories");

  return (
    <nav className="bg-white px-2 sm:px-4">
      <div className="flex h-[72px] gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:gap-1 lg:overflow-visible">
        {CATEGORY_SHORTCUTS.map((item) => {
          const Icon = CATEGORY_ICONS[item.id];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex w-[70px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-center transition hover:bg-[#F4F7FA] lg:w-auto"
            >
              <Icon className="size-9" />
              <span className="text-[10px] font-semibold leading-tight text-[#4B5563]">
                {t(item.id)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
