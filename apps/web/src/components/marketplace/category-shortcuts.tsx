import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { CATEGORY_SHORTCUTS } from "@/lib/marketplace/catalog";
import { CATEGORY_ICONS } from "@/components/marketplace/marketplace-icons";

export async function CategoryShortcuts() {
  const t = await getTranslations("marketplace.categories");

  return (
    <section className="rounded-2xl bg-white px-2 py-5 shadow-[0_8px_24px_rgba(15,23,42,.04)] ring-1 ring-black/[0.04] sm:px-4">
      <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-12 lg:gap-2 lg:overflow-visible">
        {CATEGORY_SHORTCUTS.map((item) => {
          const Icon = CATEGORY_ICONS[item.id];
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-xl px-1 py-1 text-center transition hover:bg-[#F8FAFC] lg:w-auto"
            >
              <Icon className="size-11" />
              <span className="text-[11px] font-semibold leading-tight text-[#374151]">
                {t(item.id)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
