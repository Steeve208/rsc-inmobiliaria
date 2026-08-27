"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Loader2, MapPin, Search } from "lucide-react";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import {
  resolvedLocationToFilters,
  type ResolvedLocation,
} from "@/lib/geocoding/types";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { negociosFiltersToParams } from "@/lib/negocios/search-params";
import { projetosFiltersToParams } from "@/lib/projetos/search-params";
import { servicesFiltersToParams } from "@/lib/servicos/search-params";
import { veiculosFiltersToParams } from "@/lib/veiculos/search-params";
import { useRouter } from "@/lib/i18n/routing";
import { useMarket } from "@/lib/providers/market-provider";
import { defaultImoveisFilters } from "@/features/imoveis/types";
import { defaultNegociosFilters, type BusinessCategory } from "@/features/negocios/types";
import { defaultProjetosFilters, type ProjectType } from "@/features/projetos/types";
import { defaultServicesFilters } from "@/features/services/types";
import {
  defaultVeiculosFilters,
  type VehicleCategory,
} from "@/features/veiculos/types";
import { HERO_SEARCH_TABS, type HeroSearchTab } from "@/lib/marketplace/catalog";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = ["house", "apartment", "land", "commercial"] as const;
const BUSINESS_TYPES: BusinessCategory[] = [
  "food",
  "retail",
  "services",
  "beauty",
  "education",
  "hospitality",
];
const PROJECT_TYPES: ProjectType[] = [
  "residential",
  "commercial",
  "mixed",
  "industrial",
  "hospitality",
];
const VEHICLE_TYPES: VehicleCategory[] = [
  "car",
  "suv",
  "motorcycle",
  "truck",
  "van",
];

function propertyPriceOptions(code: string) {
  if (code === "BRL") {
    return [
      { id: "0-300", min: "", max: "300000" },
      { id: "300-600", min: "300000", max: "600000" },
      { id: "600-1200", min: "600000", max: "1200000" },
      { id: "1200+", min: "1200000", max: "" },
    ];
  }
  return [
    { id: "0-200", min: "", max: "200000" },
    { id: "200-500", min: "200000", max: "500000" },
    { id: "500-1000", min: "500000", max: "1000000" },
    { id: "1000+", min: "1000000", max: "" },
  ];
}

function vehiclePriceOptions(code: string) {
  if (code === "BRL") {
    return [
      { id: "0-50", min: "", max: "50000" },
      { id: "50-100", min: "50000", max: "100000" },
      { id: "100-200", min: "100000", max: "200000" },
      { id: "200+", min: "200000", max: "" },
    ];
  }
  return [
    { id: "0-15", min: "", max: "15000" },
    { id: "15-35", min: "15000", max: "35000" },
    { id: "35-70", min: "35000", max: "70000" },
    { id: "70+", min: "70000", max: "" },
  ];
}

function formatPriceLabel(
  option: { min: string; max: string },
  symbol: string,
  upTo: string,
  from: string,
) {
  const fmt = (n: string) => {
    const value = Number(n);
    if (value >= 1_000_000) return `${symbol}${value / 1_000_000}M`;
    if (value >= 1000) return `${symbol}${Math.round(value / 1000)}k`;
    return `${symbol}${value}`;
  };
  if (!option.min && option.max) return `${upTo} ${fmt(option.max)}`;
  if (option.min && !option.max) return `${from} ${fmt(option.min)}`;
  return `${fmt(option.min)} – ${fmt(option.max)}`;
}

export function HeroSearch() {
  const t = useTranslations("marketplace.search");
  const tLanding = useTranslations("landing.search");
  const tVeiculos = useTranslations("veiculos.categories");
  const tProjects = useTranslations("marketplace.projects");
  const tBusinesses = useTranslations("marketplace.businesses");
  const { market } = useMarket();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [tab, setTab] = useState<HeroSearchTab>("properties");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [resolvedLocation, setResolvedLocation] =
    useState<ResolvedLocation | null>(null);
  const [propertyType, setPropertyType] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [businessType, setBusinessType] = useState<BusinessCategory | "">("");
  const [vehicleType, setVehicleType] = useState<VehicleCategory | "">("");
  const [priceRangeId, setPriceRangeId] = useState("");

  const priceOptions = useMemo(
    () =>
      tab === "vehicles"
        ? vehiclePriceOptions(market.currency.code)
        : propertyPriceOptions(market.currency.code),
    [market.currency.code, tab],
  );
  const selectedPrice = priceOptions.find((option) => option.id === priceRangeId);

  const locationFields = useMemo(() => {
    if (resolvedLocation) return resolvedLocationToFilters(resolvedLocation);
    return {
      city: location.trim(),
      state: "",
      neighborhood: "",
      country: location.trim() ? "" : market.countryName,
      locationLabel: location.trim(),
      lat: null as number | null,
      lng: null as number | null,
    };
  }, [location, market.countryName, resolvedLocation]);

  const goToSearch = () => {
    const q = query.trim();

    if (tab === "services") {
      const params = servicesFiltersToParams({
        ...defaultServicesFilters,
        query: q,
        state: locationFields.state,
        city: locationFields.city,
        country: locationFields.country,
        locationLabel: locationFields.locationLabel,
        lat: locationFields.lat,
        lng: locationFields.lng,
      });
      startTransition(() => {
        router.push(`/services${params.toString() ? `?${params.toString()}` : ""}`);
      });
      return;
    }

    if (tab === "vehicles") {
      const params = veiculosFiltersToParams({
        ...defaultVeiculosFilters,
        query: q,
        type: vehicleType,
        state: locationFields.state,
        city: locationFields.city,
        locationLabel: locationFields.locationLabel,
        lat: locationFields.lat,
        lng: locationFields.lng,
        priceMin: selectedPrice?.min ?? "",
        priceMax: selectedPrice?.max ?? "",
      });
      startTransition(() => {
        router.push(`/veiculos${params.toString() ? `?${params.toString()}` : ""}`);
      });
      return;
    }

    if (tab === "businesses") {
      const params = negociosFiltersToParams({
        ...defaultNegociosFilters,
        query: q,
        type: businessType,
        state: locationFields.state,
        city: locationFields.city,
        country: locationFields.country,
        locationLabel: locationFields.locationLabel,
        lat: locationFields.lat,
        lng: locationFields.lng,
        priceMin: selectedPrice?.min ?? "",
        priceMax: selectedPrice?.max ?? "",
      });
      startTransition(() => {
        router.push(`/negocios${params.toString() ? `?${params.toString()}` : ""}`);
      });
      return;
    }

    if (tab === "projects") {
      const params = projetosFiltersToParams({
        ...defaultProjetosFilters,
        query: q,
        type: projectType,
        state: locationFields.state,
        city: locationFields.city,
        country: locationFields.country,
        locationLabel: locationFields.locationLabel,
        lat: locationFields.lat,
        lng: locationFields.lng,
        priceMin: selectedPrice?.min ?? "",
        priceMax: selectedPrice?.max ?? "",
      });
      startTransition(() => {
        router.push(`/projetos${params.toString() ? `?${params.toString()}` : ""}`);
      });
      return;
    }

    const params = imoveisFiltersToParams({
      ...defaultImoveisFilters,
      query: q,
      country: locationFields.country || market.countryName,
      state: locationFields.state,
      city: locationFields.city,
      neighborhood: locationFields.neighborhood,
      locationLabel: locationFields.locationLabel,
      lat: locationFields.lat,
      lng: locationFields.lng,
      type: propertyType,
      priceMin: selectedPrice?.min ?? "",
      priceMax: selectedPrice?.max ?? "",
    });
    startTransition(() => {
      router.push(`/imoveis${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  const showTypeAndPrice =
    tab === "properties" || tab === "vehicles" || tab === "projects" || tab === "businesses";
  const fieldClass =
    "flex min-h-[48px] items-center gap-2 border-b border-[#EEEEEE] px-3 py-1.5 lg:border-b-0 lg:border-r lg:border-[#E8EEF4]";
  const labelClass =
    "block text-[11px] font-semibold leading-none text-[#6B7285]";
  const controlClass =
    "mt-1 w-full bg-transparent text-[13px] font-medium leading-tight text-[#1A1F2B] outline-none placeholder:text-[#9CA3AF]";

  return (
    <div className="w-full">
      <div className="flex items-end gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HERO_SEARCH_TABS.map((id) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setPriceRangeId("");
                setPropertyType("");
                setProjectType("");
                setBusinessType("");
                setVehicleType("");
              }}
              className={cn(
                "shrink-0 px-3.5 py-1.5 text-[12px] font-semibold transition",
                active
                  ? "rounded-t-lg bg-white text-[#0B1220]"
                  : "mb-0.5 rounded-lg bg-black/40 text-white hover:bg-black/55",
              )}
            >
              {t(`tabs.${id}`)}
            </button>
          );
        })}
      </div>

      <form
        className={cn(
          "overflow-hidden bg-white shadow-[0_10px_28px_rgba(0,0,0,.22)]",
          tab === "properties"
            ? "rounded-xl rounded-tl-none"
            : "rounded-xl",
        )}
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch();
        }}
      >
        <div
          className={cn(
            "grid items-stretch",
            showTypeAndPrice
              ? "lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1.05fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.72fr)]"
              : "lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1.05fr)_minmax(0,0.72fr)]",
          )}
        >
          <label className={fieldClass}>
            <Search className="size-4 shrink-0 text-[#9CA3AF]" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className={labelClass}>{t("query")}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("queryPlaceholder")}
                className={controlClass}
              />
            </span>
          </label>

          <div className={fieldClass}>
            <MapPin className="size-4 shrink-0 text-[#9CA3AF]" strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <span className={labelClass}>{t("location")}</span>
              <LocationAutocomplete
                theme="light"
                hideGps
                hideIcon
                value={location}
                placeholder={t("locationPlaceholder")}
                onValueChange={(value) => {
                  setLocation(value);
                  if (!value) setResolvedLocation(null);
                }}
                onPlaceResolved={(place) => {
                  setResolvedLocation(place);
                  setLocation(place.label);
                }}
                onLocationCleared={() => setResolvedLocation(null)}
                onEnter={goToSearch}
                className="[&_div]:min-h-0 [&_div]:h-auto [&_div]:rounded-none [&_div]:border-0 [&_div]:px-0 [&_div]:ring-0"
              />
            </div>
          </div>

          {showTypeAndPrice ? (
            <label className={fieldClass}>
              <span className="min-w-0 flex-1">
                <span className={labelClass}>{t("type")}</span>
                <span className="relative block">
                  {tab === "vehicles" ? (
                    <select
                      value={vehicleType}
                      onChange={(event) =>
                        setVehicleType(event.target.value as VehicleCategory | "")
                      }
                      className={cn(controlClass, "appearance-none pr-5")}
                    >
                      <option value="">{t("anyType")}</option>
                      {VEHICLE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {tVeiculos(type)}
                        </option>
                      ))}
                    </select>
                  ) : tab === "businesses" ? (
                    <select
                      value={businessType}
                      onChange={(event) =>
                        setBusinessType(event.target.value as BusinessCategory | "")
                      }
                      className={cn(controlClass, "appearance-none pr-5")}
                    >
                      <option value="">{t("anyType")}</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {tBusinesses(`types.${type}`)}
                        </option>
                      ))}
                    </select>
                  ) : tab === "projects" ? (
                    <select
                      value={projectType}
                      onChange={(event) =>
                        setProjectType(event.target.value as ProjectType | "")
                      }
                      className={cn(controlClass, "appearance-none pr-5")}
                    >
                      <option value="">{t("anyType")}</option>
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {tProjects(`types.${type}`)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={propertyType}
                      onChange={(event) => setPropertyType(event.target.value)}
                      className={cn(controlClass, "appearance-none pr-5")}
                    >
                      <option value="">{t("anyType")}</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {tLanding(`filters.${type === "house" ? "houses" : type === "apartment" ? "apartments" : type}`)}
                        </option>
                      ))}
                    </select>
                  )}
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-[#9CA3AF]" />
                </span>
              </span>
            </label>
          ) : null}

          {showTypeAndPrice ? (
            <label className={cn(fieldClass, "lg:border-r-0")}>
              <span className="min-w-0 flex-1">
                <span className={labelClass}>{t("price")}</span>
                <span className="relative block">
                  <select
                    value={priceRangeId}
                    onChange={(event) => setPriceRangeId(event.target.value)}
                    className={cn(controlClass, "appearance-none pr-5")}
                  >
                    <option value="">{t("anyPrice")}</option>
                    {priceOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {formatPriceLabel(
                          option,
                          market.currency.symbol,
                          tLanding("priceUpTo"),
                          tLanding("priceFrom"),
                        )}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-3.5 -translate-y-1/2 text-[#9CA3AF]" />
                </span>
              </span>
            </label>
          ) : null}

          <div className="flex items-center p-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#F9B14D] px-4 text-[13px] font-bold text-[#1A1205] transition hover:bg-[#F2C06E] disabled:opacity-70"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : t("submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
