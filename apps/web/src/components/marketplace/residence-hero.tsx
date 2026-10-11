"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Home, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ListingImage } from "@/components/listing-image";
import { ResidenceNav } from "@/components/marketplace/residence-nav";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import { defaultImoveisFilters } from "@/features/imoveis/types";
import {
  clearLocationFilters,
  resolvedLocationToFilters,
  type ResolvedLocation,
} from "@/lib/geocoding/types";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { Link, useRouter } from "@/lib/i18n/routing";
import { formatMarketplacePrice } from "@/lib/marketplace/format";
import type { MarketplaceListing } from "@/lib/marketplace/types";
import { useMarket } from "@/lib/providers/market-provider";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80";

const RAIL = [
  { id: "estates", href: "/imoveis?type=house" },
  { id: "apartments", href: "/imoveis?type=apartment" },
  { id: "waterfront", href: "/imoveis?q=waterfront" },
  { id: "mountain", href: "/imoveis?q=mountain" },
  { id: "investment", href: "/imoveis?type=commercial" },
] as const;

const RESIDENCE_TYPES = ["", "house", "apartment", "estate"] as const;

function priceOptions(code: string) {
  if (code === "BRL") {
    return [
      { id: "", min: "", max: "" },
      { id: "0-300", min: "", max: "300000" },
      { id: "300-600", min: "300000", max: "600000" },
      { id: "600-1200", min: "600000", max: "1200000" },
      { id: "1200+", min: "1200000", max: "" },
    ];
  }
  return [
    { id: "", min: "", max: "" },
    { id: "0-500", min: "", max: "500000" },
    { id: "500-1500", min: "500000", max: "1500000" },
    { id: "1500-5000", min: "1500000", max: "5000000" },
    { id: "5000+", min: "5000000", max: "" },
  ];
}

function priceLabel(
  option: { min: string; max: string },
  symbol: string,
  anyPrice: string,
) {
  const fmt = (n: string) => {
    const value = Number(n);
    if (value >= 1_000_000) return `${symbol}${value / 1_000_000}M`;
    return `${symbol}${Math.round(value / 1000)}k`;
  };
  if (!option.min && !option.max) return anyPrice;
  if (!option.min) return `≤ ${fmt(option.max)}`;
  if (!option.max) return `${fmt(option.min)}+`;
  return `${fmt(option.min)} – ${fmt(option.max)}`;
}

type Props = {
  slides: MarketplaceListing[];
  showJournal?: boolean;
};

export function ResidenceHero({ slides, showJournal = false }: Props) {
  const t = useTranslations("marketplace.residence");
  const locale = useLocale();
  const router = useRouter();
  const { market } = useMarket();
  const formRef = useRef<HTMLFormElement>(null);
  const [destination, setDestination] = useState("");
  const [resolved, setResolved] = useState<ResolvedLocation | null>(null);
  const [residence, setResidence] = useState<(typeof RESIDENCE_TYPES)[number]>("");
  const [priceId, setPriceId] = useState("");
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const options = priceOptions(market.currency.code);
  const total = slides.length;
  const featured = slides[slide] ?? slides[0];

  useEffect(() => {
    if (total < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setSlide((value) => (value + 1) % total);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, total, slide]);

  function explore() {
    const selected = options.find((option) => option.id === priceId) ?? options[0];
    const locationFields = resolved
      ? resolvedLocationToFilters(resolved)
      : clearLocationFilters();
    const params = imoveisFiltersToParams({
      ...defaultImoveisFilters,
      ...locationFields,
      query: resolved ? "" : destination.trim(),
      type: residence === "estate" ? "house" : residence,
      featuredOnly: residence === "estate",
      priceMin: selected?.min ?? "",
      priceMax: selected?.max ?? "",
    });
    const query = params.toString();
    router.push(query ? `/imoveis?${query}` : "/imoveis");
  }

  return (
    <section className="bg-[#0b0e13] text-white">
      <div className="flex lg:h-[600px] lg:min-h-[600px]">
        <aside className="z-30 hidden w-[72px] shrink-0 flex-col overflow-hidden bg-[#0c0f14] lg:flex">
          <nav className="flex flex-1 flex-col items-center justify-center gap-5 py-6">
            {RAIL.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-1.5 text-white/75 transition hover:text-white"
              >
                <span className="w-4 text-[9px] font-medium tracking-[0.12em] text-[#d9c7a4]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[9px] font-medium uppercase tracking-[0.16em]"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {t(`rail.${item.id}`)}
                </span>
              </Link>
            ))}
          </nav>
          <span
            className="mb-5 self-center text-[8px] font-medium uppercase tracking-[0.18em] text-white/40"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {t("rail.collection")}
          </span>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          <ResidenceNav
            showJournal={showJournal}
            onSearch={() => {
              const input = formRef.current?.querySelector("input");
              input?.focus();
              formRef.current?.scrollIntoView({ block: "nearest" });
            }}
            className="relative shrink-0 bg-[#0b0e13] lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent"
          />

          <div className="relative z-0 flex min-w-0 flex-1 flex-col lg:min-h-0 lg:flex-row">
            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="relative min-h-[min(42svh,22rem)] lg:min-h-0 lg:flex-1">
                <img
                  src={HERO_IMAGE}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_30%] lg:object-[center_45%]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090d] via-[#07090d]/40 to-[#07090d]/15 lg:bg-gradient-to-r lg:from-[#07090d]/75 lg:via-[#07090d]/25 lg:to-[#07090d]/10" />
                <div className="pointer-events-none relative z-10 flex h-full min-h-[min(42svh,22rem)] flex-col justify-end px-5 pb-6 pt-6 sm:px-8 lg:min-h-full lg:justify-start lg:px-10 lg:pb-28 lg:pt-24">
                  <div className="pointer-events-auto max-w-[480px]">
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#E7C48A] sm:tracking-[0.28em]">
                      {t("eyebrow")}
                    </p>
                    <h1
                      className="mt-3 max-w-[18ch] text-[length:var(--rk-type-display)] font-medium leading-[1.05] text-white lg:max-w-[12ch] lg:text-[3.15rem] lg:leading-[1.02]"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {t("title")}
                    </h1>
                    <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/80 lg:text-[12px] lg:text-white/75">
                      {t("subtitle")}
                    </p>
                  </div>
                </div>
              </div>

              <form
                ref={formRef}
                className="pointer-events-auto relative z-20 mx-4 mb-4 mt-3 flex w-auto flex-col gap-1 rounded-2xl bg-white p-1.5 text-[#1c1917] shadow-[0_12px_32px_rgba(0,0,0,.22)] lg:absolute lg:inset-x-10 lg:bottom-6 lg:mx-0 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:rounded-full lg:p-1"
                  onSubmit={(event) => {
                    event.preventDefault();
                    explore();
                  }}
                >
                  <label className="flex min-w-0 flex-1 items-center gap-2 px-3 py-1.5">
                    <MapPin className="size-4 shrink-0 text-[#8A8175]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8175]">
                        {t("search.destination")}
                      </span>
                      <LocationAutocomplete
                        value={destination}
                        placeholder={t("search.destinationPlaceholder")}
                        onValueChange={(value) => {
                          setDestination(value);
                          setResolved(null);
                        }}
                        onPlaceResolved={(location) => {
                          setResolved(location);
                          setDestination(location.label);
                        }}
                        onLocationCleared={() => setResolved(null)}
                        onEnter={explore}
                        theme="light"
                        hideIcon
                        hideGps
                        className="mt-0.5"
                      />
                    </span>
                  </label>

                  <label className="flex min-w-0 flex-1 items-center gap-2 border-t border-[#E7E1D8] px-3 py-1.5 lg:border-t-0 lg:border-l">
                    <Home className="size-4 shrink-0 text-[#8A8175]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8175]">
                        {t("search.residenceType")}
                      </span>
                      <span className="relative mt-0.5 block">
                        <select
                          value={residence}
                          onChange={(event) =>
                            setResidence(event.target.value as (typeof RESIDENCE_TYPES)[number])
                          }
                          className="w-full min-w-0 appearance-none truncate bg-transparent py-1 pr-6 text-[13px] font-medium text-[#1c1917] outline-none"
                        >
                          {RESIDENCE_TYPES.map((id) => (
                            <option key={id || "any"} value={id}>
                              {t(`search.types.${id || "any"}`)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-[#8A8175]" />
                      </span>
                    </span>
                  </label>

                  <label className="flex min-w-0 flex-1 items-center gap-2 border-t border-[#E7E1D8] px-3 py-1.5 lg:border-t-0 lg:border-l">
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8175]">
                        {t("search.priceRange")}
                      </span>
                      <span className="relative mt-0.5 block">
                        <select
                          value={priceId}
                          onChange={(event) => setPriceId(event.target.value)}
                          className="w-full min-w-0 appearance-none truncate bg-transparent py-1 pr-6 text-[13px] font-medium text-[#1c1917] outline-none"
                        >
                          {options.map((option) => (
                            <option key={option.id || "any"} value={option.id}>
                              {priceLabel(option, market.currency.symbol, t("search.anyPrice"))}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-[#8A8175]" />
                      </span>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#161616] px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-black lg:h-10 lg:w-auto lg:min-h-10"
                  >
                    {t("search.explore")}
                    <ArrowRight className="size-3.5" />
                  </button>
                </form>
            </div>

            <FeaturedResidence
              item={featured}
              index={total ? slide : 0}
              total={total}
              onPrev={() => setSlide((value) => (value - 1 + total) % total)}
              onNext={() => setSlide((value) => (value + 1) % total)}
              onPause={() => setPaused(true)}
              onResume={() => setPaused(false)}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedResidence({
  item,
  index,
  total,
  onPrev,
  onNext,
  onPause,
  onResume,
  locale,
}: {
  item?: MarketplaceListing;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
  locale: string;
}) {
  const t = useTranslations("marketplace.residence");
  const area =
    item?.area && item.area > 0
      ? `${new Intl.NumberFormat(locale).format(item.area)} m²`
      : null;

  return (
    <article
      className="flex w-full min-w-0 shrink-0 flex-col bg-[#10141a] lg:h-full lg:w-[300px] xl:w-[340px]"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={onResume}
    >
      <div className="relative aspect-[16/10] shrink-0 lg:aspect-auto lg:h-[38%]">
        {item?.image ? (
          <ListingImage
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="440px"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1a1f27]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/45 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#C4A574]">
            {t("featured.label")}
          </p>
          {total > 0 ? (
            <div className="flex items-center gap-2 text-[11px] text-white/70">
              {total > 1 ? (
                <button type="button" onClick={onPrev} aria-label={t("featured.prev")} className="inline-flex size-11 items-center justify-center">
                  ‹
                </button>
              ) : null}
              <span>
                {String(index + 1).padStart(2, "0")} / {String(Math.max(total, 1)).padStart(2, "0")}
              </span>
              {total > 1 ? (
                <button type="button" onClick={onNext} aria-label={t("featured.next")} className="inline-flex size-11 items-center justify-center">
                  ›
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <h2
          className="mt-2 text-[clamp(1.25rem,4vw,1.45rem)] leading-tight text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {item?.title ?? t("featured.emptyTitle")}
        </h2>
        {item?.location ? (
          <p className="mt-1 text-[13px] text-white/60">{item.location}</p>
        ) : null}
        {item ? (
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-3 min-[520px]:grid-cols-4 lg:grid-cols-2">
            <Stat label={t("featured.beds")} value={item.bedrooms ? String(item.bedrooms) : "—"} />
            <Stat label={t("featured.baths")} value={item.bathrooms ? String(item.bathrooms) : "—"} />
            <Stat label={t("featured.interior")} value={area ?? "—"} />
            <Stat label={t("featured.land")} value="—" />
          </dl>
        ) : null}
        {item && item.price > 0 ? (
          <p
            className="mt-3 break-words text-[clamp(1.25rem,4vw,1.45rem)] text-white"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {formatMarketplacePrice(item.price, item.currency)}
          </p>
        ) : null}
        <Link
          href={item?.href ?? "/imoveis"}
          className="mt-4 inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#C4A574] px-5 text-[13px] font-semibold hover:bg-[#d4b896]"
          style={{ color: "#1A1205" }}
        >
          {t("featured.viewDetails")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-white/45">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-white">{value}</dd>
    </div>
  );
}
