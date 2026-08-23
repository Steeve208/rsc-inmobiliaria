import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { HERO_IMAGE, POPULAR_SEARCHES } from "@/lib/marketplace/catalog";
import { Link } from "@/lib/i18n/routing";

export async function MarketplaceHero() {
  const t = await getTranslations("marketplace.hero");
  const tSearch = await getTranslations("marketplace.search");

  return (
    <div className="relative h-[280px] overflow-hidden rounded-2xl sm:h-[300px] lg:h-full">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-[center_45%]"
        sizes="(max-width:1280px) 100vw, 900px"
      />
      <div className="absolute inset-0 bg-[#05070C]/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070C]/80 via-[#05070C]/40 to-[#05070C]/15" />
      <div className="relative z-10 flex h-full flex-col justify-end px-3.5 py-3 sm:px-4 sm:py-3.5 lg:px-5 lg:py-3">
        <h1 className="rk-display max-w-xl text-[1.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[1.7rem] lg:text-[1.85rem]">
          {t("titleStart")}{" "}
          <span className="text-[#E8A84A]">{t("titleHighlight")}</span>
        </h1>
        <p className="mt-1 max-w-lg text-[12px] text-white/80 sm:text-[13px]">
          {t("subtitle")}
        </p>
        <div className="mt-2">
          <HeroSearch />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-white/70">{tSearch("popular")}</span>
          {POPULAR_SEARCHES.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-black/60"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
