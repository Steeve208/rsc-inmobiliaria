"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { ResidenceNav } from "@/components/marketplace/residence-nav";
import { Link } from "@/lib/i18n/routing";
import type {
  DestinationCatalog,
  DestinationCity,
  DestinationCountry,
} from "@/lib/marketplace/destination-catalog";
import { DESTINATION_REGIONS } from "@/lib/marketplace/destination-regions";
import { cn } from "@/lib/utils";

const serif = { fontFamily: "var(--font-playfair), Georgia, serif" };

type RegionFilter = "all" | (typeof DESTINATION_REGIONS)[number];

type Props = {
  catalog: DestinationCatalog;
  showJournal?: boolean;
};

export function DestinationsPage({ catalog, showJournal = false }: Props) {
  const t = useTranslations("marketplace.destinationsPage");
  const [region, setRegion] = useState<RegionFilter>("all");
  const [offset, setOffset] = useState(0);

  const cities = catalog.cities.filter((item) => region === "all" || item.region === region);
  const countries = catalog.countries.filter(
    (item) => region === "all" || item.region === region,
  );
  const visible = cities.slice(offset, offset + 4);

  useEffect(() => {
    setOffset(0);
  }, [region]);

  return (
    <div className="bg-[#f6f3ee] text-[#1c1917]">
      <section className="relative bg-[#0c1218] text-white lg:h-[560px]">
        {catalog.hero?.image ? (
          // Listing photograph used as the section backdrop.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={catalog.hero.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_35%] lg:object-[center_40%]"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b10] via-[#070b10]/55 to-[#070b10]/20 lg:bg-gradient-to-r lg:from-[#070b10] lg:via-[#070b10]/80 lg:to-[#070b10]/25" />

        <ResidenceNav className="relative z-20" showJournal={showJournal} />

        <div className="relative z-10 flex min-h-[min(78vw,22rem)] flex-col justify-end px-5 pb-8 sm:px-8 lg:h-[calc(100%-4rem)] lg:max-w-[640px] lg:min-h-0 lg:px-10 lg:pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:tracking-[0.24em]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-[16ch] text-[length:var(--rk-type-display)] leading-[1.05] lg:max-w-[12ch] lg:text-[3.4rem] lg:leading-[1.02]" style={serif}>
            {t("title")}
          </h1>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/75">{t("subtitle")}</p>
          <a
            href="#featured-destinations"
            className="mt-6 inline-flex h-10 w-fit items-center gap-2 rounded-full border border-white/40 px-5 text-[13px] text-white hover:bg-white/10"
          >
            {t("explore")}
            <ArrowRight className="size-3.5" />
          </a>
        </div>
        {catalog.hero ? (
          <p className="absolute bottom-6 right-8 z-10 hidden text-right text-[13px] text-white/85 lg:block">
            <span className="block" style={serif}>
              {catalog.hero.city}
            </span>
            {catalog.hero.country ? (
              <span className="mt-1 block text-[11px] text-white/60">{catalog.hero.country}</span>
            ) : null}
          </p>
        ) : null}
      </section>

      <div className="border-b border-[#e6e0d6] bg-[#f6f3ee]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 lg:px-8">
          <div className="flex min-w-0 flex-1 gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <RegionButton active={region === "all"} onClick={() => setRegion("all")}>
              {t("regions.all")}
            </RegionButton>
            {DESTINATION_REGIONS.map((id) => (
              <RegionButton key={id} active={region === id} onClick={() => setRegion(id)}>
                {t(`regions.${id}`)}
              </RegionButton>
            ))}
          </div>
          <Link
            href="/imoveis?view=map"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[13px] text-[#3f3a34] hover:text-black"
          >
            <Globe className="size-3.5" />
            {t("viewOnMap")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <section id="featured-destinations" className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-[length:var(--rk-type-title)] leading-none" style={serif}>
            {t("featuredTitle")}
          </h2>
          <div className="hidden max-w-xs items-center gap-4 md:flex">
            <p className="text-[13px] leading-relaxed text-[#8a8175]">{t("featuredText")}</p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label={t("prev")}
                disabled={offset === 0}
                onClick={() => setOffset((value) => Math.max(0, value - 1))}
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#d9d1c6] disabled:opacity-30"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label={t("next")}
                disabled={offset + 4 >= cities.length}
                onClick={() => setOffset((value) => value + 1)}
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#d9d1c6] disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
        {cities.length > 0 ? (
          <>
            <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
              {cities.map((item) => (
                <div key={item.key} className="w-[min(78%,18rem)] shrink-0 snap-start">
                  <CityCard item={item} countLabel={t("propertiesCount", { count: item.count })} />
                </div>
              ))}
            </div>
            <div className="mt-6 hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
              {visible.map((item) => (
                <CityCard key={item.key} item={item} countLabel={t("propertiesCount", { count: item.count })} />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-8 text-sm text-[#8a8175]">{t("empty")}</p>
        )}
      </section>

      <section className="mx-auto max-w-[1240px] px-5 pb-14 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="min-w-0 text-[length:var(--rk-type-title)] leading-none" style={serif}>
            {t("exploreTitle")}
          </h2>
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#3f3a34] hover:text-black"
          >
            {t("viewAllCountries")}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        {countries.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {countries.map((item) => (
              <CountryCard
                key={item.key}
                item={item}
                countLabel={t("propertiesCount", { count: item.count })}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-[#8a8175]">{t("empty")}</p>
        )}
      </section>

      <MarketplaceFooter />
    </div>
  );
}

function RegionButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center border-b-2 text-[13px]",
        active
          ? "border-[#c4a574] font-medium text-[#1c1917]"
          : "border-transparent text-[#8a8175] hover:text-[#1c1917]",
      )}
    >
      {children}
    </button>
  );
}

function CityCard({ item, countLabel }: { item: DestinationCity; countLabel: string }) {
  return (
    <Link href={item.href} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#1c1917]">
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : null}
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
      <span className="absolute bottom-4 left-4 right-14">
        <span className="block text-[1.35rem] leading-tight text-white" style={serif}>
          {item.city}
        </span>
        {item.country ? (
          <span className="mt-1 block text-[12px] text-white/75">{item.country}</span>
        ) : null}
        <span className="mt-2 block text-[12px] text-white/70">{countLabel}</span>
      </span>
      <span className="absolute bottom-4 right-4 inline-flex size-8 items-center justify-center rounded-full border border-white/50 text-white">
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

function CountryCard({ item, countLabel }: { item: DestinationCountry; countLabel: string }) {
  return (
    <Link href={item.href} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-[#1c1917]">
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : null}
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
      <span className="absolute bottom-2.5 left-2.5 right-8">
        <span className="block truncate text-[14px] leading-4 text-white" style={serif}>
          {item.country}
        </span>
        <span className="mt-1 block truncate text-[11px] leading-3 text-white/75">{countLabel}</span>
      </span>
      <span className="absolute bottom-2.5 right-2.5 inline-flex size-6 items-center justify-center rounded-full bg-white/90 text-[#1c1917]">
        <ArrowRight className="size-3" />
      </span>
    </Link>
  );
}
