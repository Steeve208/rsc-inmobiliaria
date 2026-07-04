import {
  ArrowRight,
  Bike,
  Car,
  ChevronRight,
  MapPin,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { marketplace } from "@/lib/layout/marketplace";
import {
  buildCityCategoryHref,
  buildCitySearchHref,
} from "@/lib/veiculos/city-search-href";
import type { CityLandingEntry } from "@/lib/veiculos/city-slugs";
import { CityLandingFaq } from "@/features/imoveis/components/city-landing-faq";
import { VehicleCard } from "./vehicle-card";
import type { VehicleListing } from "../types";
import type { VehicleCategory } from "../types";
import { cn } from "@/lib/utils";

const FAQ_COUNT = 5;

const categoryLinks: { type: VehicleCategory; icon: typeof Car }[] = [
  { type: "car", icon: Car },
  { type: "suv", icon: Truck },
  { type: "electric", icon: Zap },
  { type: "motorcycle", icon: Bike },
];

type Props = {
  entry: CityLandingEntry;
  listings: VehicleListing[];
  relatedCities: CityLandingEntry[];
};

export async function VehicleCityLandingPage({ entry, listings, relatedCities }: Props) {
  const { city, state, slug } = entry;
  const t = await getTranslations("veiculos.cityLanding");
  const tc = await getTranslations("veiculos.categories");
  const labels = { city, state, count: listings.length };

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, index) => ({
    question: t(`faq.items.${index}.question`, labels),
    answer: t(`faq.items.${index}.answer`, labels),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: t("metaTitle", labels),
        description: t("metaDescription", labels),
        url: `/veiculos/cidade/${slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      ...(listings.length > 0
        ? [
            {
              "@type": "ItemList",
              name: t("featured.title", labels),
              numberOfItems: listings.length,
              itemListElement: listings.slice(0, 8).map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `/veiculos/${item.id}`,
                name: item.title,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="relative overflow-hidden bg-[#000810]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-white/8 bg-gradient-to-b from-[#0a1628]/80 to-[#000810]">
        <div className={cn(marketplace.container, "py-8 lg:py-12")}>
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1 text-xs text-white/45"
          >
            <Link href="/" className="hover:text-white/70">
              {t("breadcrumbHome")}
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/veiculos" className="hover:text-white/70">
              {t("breadcrumbVehicles")}
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-white/70">
              {city}, {state}
            </span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#22c55e]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#86efac]">
              <Sparkles className="size-3.5" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {t("hero.title", labels)}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              {t("hero.subtitle", labels)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={buildCitySearchHref(city, state)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t("hero.cta", labels)}
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                {t("hero.faqLink")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={marketplace.section}>
        <div className={marketplace.container}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <p className="text-2xl font-bold text-[#86efac]">{listings.length}</p>
              <p className="mt-1 text-sm text-white/55">{t("stats.listings", labels)}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <MapPin className="size-5 text-[#60a5fa]" />
              <p className="mt-3 text-sm font-medium text-white">
                {city}, {state}
              </p>
              <p className="mt-1 text-sm text-white/55">{t("stats.region", labels)}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white">{t("stats.financingTitle")}</p>
              <p className="mt-1 text-sm text-white/55">{t("stats.financingBody", labels)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={marketplace.section}>
        <div className={marketplace.container}>
          <h2 className={marketplace.titleLg}>{t("intro.title", labels)}</h2>
          <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-white/65 sm:text-base">
            <p>{t("intro.p1", labels)}</p>
            <p>{t("intro.p2", labels)}</p>
            <p>{t("intro.p3", labels)}</p>
          </div>
        </div>
      </section>

      <section className={marketplace.section}>
        <div className={marketplace.container}>
          <h2 className={marketplace.title}>{t("categories.title", labels)}</h2>
          <p className={marketplace.subtitle}>{t("categories.subtitle", labels)}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categoryLinks.map(({ type, icon: Icon }) => (
              <Link
                key={type}
                href={buildCityCategoryHref(city, state, type)}
                className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-[#22c55e]/30 hover:bg-white/[0.04]"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#22c55e]/15 text-[#86efac]">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium text-white group-hover:text-[#86efac]">
                  {tc(type)} — {city}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {listings.length > 0 ? (
        <section className={marketplace.section}>
          <div className={marketplace.container}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className={marketplace.title}>{t("featured.title", labels)}</h2>
                <p className={marketplace.subtitle}>{t("featured.subtitle", labels)}</p>
              </div>
              <Link
                href={buildCitySearchHref(city, state)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#86efac] hover:underline"
              >
                {t("featured.viewAll", labels)}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((item) => (
                <VehicleCard key={item.id} item={item} variant="gallery" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={marketplace.section}>
        <div className={cn(marketplace.container, "grid gap-10 lg:grid-cols-[1fr_320px]")}>
          <CityLandingFaq title={t("faq.title", labels)} items={faqItems} />

          <aside className="space-y-8">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-base font-semibold text-white">{t("links.title")}</h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href={buildCityCategoryHref(city, state, "car")}
                    className="text-white/65 hover:text-[#86efac]"
                  >
                    {t("links.cars", labels)}
                  </Link>
                </li>
                <li>
                  <Link
                    href={buildCityCategoryHref(city, state, "suv")}
                    className="text-white/65 hover:text-[#86efac]"
                  >
                    {t("links.suvs", labels)}
                  </Link>
                </li>
                <li>
                  <Link href="/financing" className="text-white/65 hover:text-[#86efac]">
                    {t("links.financing")}
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-white/65 hover:text-[#86efac]">
                    {t("links.help")}
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-white/65 hover:text-[#86efac]">
                    {t("links.services")}
                  </Link>
                </li>
              </ul>
            </div>

            {relatedCities.length > 0 ? (
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <h2 className="text-base font-semibold text-white">{t("related.title")}</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {relatedCities.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/veiculos/cidade/${related.slug}`}
                        className="text-white/65 hover:text-[#86efac]"
                      >
                        {related.city}, {related.state}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/veiculos"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#86efac] hover:underline"
                >
                  {t("related.viewAll")}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}
