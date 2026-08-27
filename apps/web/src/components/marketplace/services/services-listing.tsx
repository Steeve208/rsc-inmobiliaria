"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Award, BadgeCheck, Globe, Headphones } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import { ListingPagination } from "@/components/marketplace/properties/listing-pagination";
import type {
  ServiceListing,
  ServicesFilters,
  ServicesView,
} from "@/features/services/types";
import { ListingAside } from "./listing-aside";
import { ListingFilters } from "./listing-filters";
import {
  ListingMobileBar,
  ListingMobileFilters,
  ListingMobileMap,
} from "./listing-mobile";
import { ListingServiceCard } from "./listing-card";
import { ListingToolbar } from "./listing-toolbar";

const ServiceMap = dynamic(
  () =>
    import("@/features/services/components/service-map").then((mod) => mod.ServiceMap),
  {
    ssr: false,
    loading: () => <div className="h-[640px] animate-pulse rounded-xl bg-[#E5E7EB]" />,
  },
);

const PAGE_SIZE = 12;
const TRUST_ITEMS = [
  ["verified", BadgeCheck],
  ["quality", Award],
  ["support", Headphones],
  ["global", Globe],
] as const;

type Props = {
  results: ServiceListing[];
  catalog: ServiceListing[];
  filters: ServicesFilters;
  view: ServicesView;
  highlightedId: string | null;
  onChange: (patch: Partial<ServicesFilters>) => void;
  onViewChange: (view: ServicesView) => void;
  onHighlight: (id: string | null) => void;
  onReset: () => void;
};

export function ServicesListing({
  results,
  catalog,
  filters,
  view,
  highlightedId,
  onChange,
  onViewChange,
  onHighlight,
  onReset,
}: Props) {
  const t = useTranslations("marketplace.services");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [results, filters.sort, view]);

  useEffect(() => {
    if (view === "map") setMapOpen(true);
  }, [view]);

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [page, results]);

  return (
    <div className="bg-[#F4F7FA] text-[#0B1220]">
      <div className="rk-container py-4">
        <div className="grid items-start gap-4 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_260px]">
          <aside className="sticky top-24 hidden self-start rounded-xl bg-white px-3 lg:block">
            <ListingFilters filters={filters} catalog={catalog} onChange={onChange} />
          </aside>

          <section className="min-w-0">
            <nav className="text-xs text-[#6B7285]">
              <Link href="/" className="hover:text-[#2BB8A8]">
                {t("breadcrumbHome")}
              </Link>
              <span className="mx-1.5">›</span>
              <span>{t("breadcrumbServices")}</span>
            </nav>

            <div className="mt-2 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="rk-display text-xl font-bold tracking-tight sm:text-2xl">
                  {t("title")}
                </h1>
                <p className="mt-0.5 text-sm text-[#6B7285]">{t("subtitle")}</p>
              </div>
              <Link
                href="/empresa/cadastro"
                className="relative hidden h-[72px] w-[200px] shrink-0 overflow-hidden rounded-lg bg-[#0B1220] lg:block"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=720&q=80)",
                  }}
                />
                <div className="relative flex h-full flex-col justify-center p-3">
                  <p className="text-xs font-bold leading-snug text-white">{t("promoTitle")}</p>
                  <span className="mt-1.5 inline-flex w-fit rounded-md bg-[#2BB8A8] px-2 py-1 text-[10px] font-bold text-[#070B14]">
                    {t("promoCta")}
                  </span>
                </div>
              </Link>
            </div>

            <p className="mt-3 text-sm font-semibold">{t("count", { count: results.length })}</p>

            <div className="mt-2">
              <ListingMobileBar
                filters={filters}
                resultCount={results.length}
                onChange={onChange}
                onOpenFilters={() => setFiltersOpen(true)}
                onOpenMap={() => {
                  setMapOpen(true);
                  onViewChange("map");
                }}
              />
              <ListingToolbar
                filters={filters}
                catalog={catalog}
                view={view}
                onChange={onChange}
                onViewChange={(next) => {
                  onViewChange(next);
                  if (next === "map") setMapOpen(true);
                }}
              />
            </div>

            {results.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white px-6 py-12 text-center">
                <p className="font-semibold">{t("empty")}</p>
                <p className="mt-1 text-sm text-[#6B7285]">{t("emptyHint")}</p>
              </div>
            ) : view === "map" ? (
              <div className="mt-3 hidden gap-3 lg:grid lg:grid-cols-2">
                <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
                  {pageItems.map((item) => (
                    <ListingServiceCard
                      key={item.id}
                      item={item}
                      variant="compact"
                      highlighted={highlightedId === item.id}
                      onHover={() => onHighlight(item.id)}
                      onLeave={() => onHighlight(null)}
                    />
                  ))}
                </div>
                <ServiceMap
                  items={results}
                  highlightedId={highlightedId}
                  onHighlight={onHighlight}
                  theme="light"
                  pricePins
                  className="h-[640px] rounded-xl"
                />
              </div>
            ) : view === "list" ? (
              <div className="mt-3 space-y-3">
                {pageItems.map((item) => (
                  <ListingServiceCard
                    key={item.id}
                    item={item}
                    variant="list"
                    highlighted={highlightedId === item.id}
                    onHover={() => onHighlight(item.id)}
                    onLeave={() => onHighlight(null)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((item) => (
                  <ListingServiceCard
                    key={item.id}
                    item={item}
                    highlighted={highlightedId === item.id}
                    onHover={() => onHighlight(item.id)}
                    onLeave={() => onHighlight(null)}
                  />
                ))}
              </div>
            )}

            <div className="mt-6">
              <ListingPagination
                page={Math.min(page, totalPages)}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </section>

          <div className="sticky top-24 hidden xl:block">
            <ListingAside
              results={results}
              catalog={catalog}
              highlightedId={highlightedId}
              onHighlight={onHighlight}
              onSelectType={(type) => onChange({ type, cycle: "" })}
              onExpandMap={() => {
                setMapOpen(true);
                onViewChange("map");
              }}
            />
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_ITEMS.map(([key, Icon]) => (
              <div
                key={key}
                className="flex items-start gap-3.5 border-b border-[#EFECE4] px-5 py-5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#0B1220] text-[#2BB8A8] shadow-[0_8px_18px_rgba(11,18,32,.12)]">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight text-[#0B1220]">
                    {t(`trust.${key}.title`)}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6B7285]">
                    {t(`trust.${key}.text`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {filtersOpen ? (
        <ListingMobileFilters
          filters={filters}
          catalog={catalog}
          resultCount={results.length}
          onChange={onChange}
          onReset={onReset}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}

      {mapOpen ? (
        <div className="lg:hidden">
          <ListingMobileMap
            results={results}
            highlightedId={highlightedId}
            filters={filters}
            onHighlight={onHighlight}
            onChange={onChange}
            onClose={() => {
              setMapOpen(false);
              onViewChange("grid");
            }}
          />
        </div>
      ) : null}

      <MarketplaceFooter />
    </div>
  );
}
