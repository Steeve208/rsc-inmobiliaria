import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HeroSearch } from "@/components/marketplace/hero-search";
import { Link } from "@/lib/i18n/routing";
import type { MarketplaceHeroContent } from "@/lib/marketplace/types";

type Props = {
  hero: MarketplaceHeroContent;
};

export async function MarketplaceHero({ hero }: Props) {
  const t = await getTranslations("marketplace.hero");
  const tSearch = await getTranslations("marketplace.search");
  const remoteImage = /^https?:\/\//i.test(hero.imageUrl);
  const title = t("titleStart");
  const highlight = t("titleHighlight");
  const subtitle = t("subtitle");

  return (
    <div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[340px] lg:h-full lg:rounded-none">
      <Image
        src={hero.imageUrl}
        alt=""
        fill
        priority
        unoptimized={remoteImage}
        className="object-cover object-[center_40%]"
        sizes="(max-width:1280px) 100vw, 900px"
      />
      <div className="absolute inset-0 bg-[#05070C]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05070C]/75 via-[#05070C]/35 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-between px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-5">
        <div>
          <h1 className="rk-display max-w-xl text-[1.6rem] font-bold leading-[1.12] tracking-tight text-white sm:text-[1.85rem] lg:text-[2.05rem]">
            {title}{" "}
            <span className="text-[#F9B14D]">{highlight}</span>
          </h1>
          <p className="mt-1.5 max-w-lg text-[12px] leading-snug text-white/85 sm:text-[13px]">
            {subtitle}
          </p>
        </div>

        <div>
          <HeroSearch
            footer={
              <>
                <span className="text-[11px] font-medium text-white/75">
                  {tSearch("popular")}
                </span>
                {hero.popularSearches.map((item) => (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="rounded-full border border-white/30 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-black/55"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
