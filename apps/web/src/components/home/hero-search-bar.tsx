"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BedDouble,
  Bike,
  Building2,
  Car,
  ChevronDown,
  Home,
  Landmark,
  Loader2,
  Search,
  Trees,
  Truck,
} from "lucide-react";
import { LocationAutocomplete } from "@/components/search/location-autocomplete";
import {
  resolvedLocationToFilters,
  type ResolvedLocation,
} from "@/lib/geocoding/types";
import { filterProperties, filterVehicles } from "@/lib/listings/filters";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";
import { veiculosFiltersToParams } from "@/lib/veiculos/search-params";
import { useRouter } from "@/lib/i18n/routing";
import { useMarket } from "@/lib/providers/market-provider";
import {
  defaultImoveisFilters,
  type ImoveisFilters,
  type PropertyListing,
} from "@/features/imoveis/types";
import {
  defaultVeiculosFilters,
  type VehicleCategory,
  type VehicleListing,
  type VeiculosFilters,
} from "@/features/veiculos/types";
import { cn } from "@/lib/utils";

type SearchCategory = "properties" | "vehicles";

type PriceOption = {
  id: string;
  min: string;
  max: string;
};

function propertyPriceOptions(code: string): PriceOption[] {
  if (code === "BRL") {
    return [
      { id: "0-300", min: "", max: "300000" },
      { id: "300-600", min: "300000", max: "600000" },
      { id: "600-1200", min: "600000", max: "1200000" },
      { id: "1200+", min: "1200000", max: "" },
    ];
  }
  if (code === "EUR") {
    return [
      { id: "0-200", min: "", max: "200000" },
      { id: "200-500", min: "200000", max: "500000" },
      { id: "500-1000", min: "500000", max: "1000000" },
      { id: "1000+", min: "1000000", max: "" },
    ];
  }
  return [
    { id: "0-200", min: "", max: "200000" },
    { id: "200-500", min: "200000", max: "500000" },
    { id: "500-1000", min: "500000", max: "1000000" },
    { id: "1000+", min: "1000000", max: "" },
  ];
}

function vehiclePriceOptions(code: string): PriceOption[] {
  if (code === "BRL") {
    return [
      { id: "0-50", min: "", max: "50000" },
      { id: "50-100", min: "50000", max: "100000" },
      { id: "100-200", min: "100000", max: "200000" },
      { id: "200+", min: "200000", max: "" },
    ];
  }
  if (code === "EUR") {
    return [
      { id: "0-15", min: "", max: "15000" },
      { id: "15-35", min: "15000", max: "35000" },
      { id: "35-70", min: "35000", max: "70000" },
      { id: "70+", min: "70000", max: "" },
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
  option: PriceOption,
  symbol: string,
  tAny: (key: string) => string,
) {
  const fmt = (n: string) => {
    const value = Number(n);
    if (value >= 1_000_000) {
      const m = value / 1_000_000;
      return `${symbol}${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
    }
    if (value >= 1000) return `${symbol}${Math.round(value / 1000)}k`;
    return `${symbol}${value}`;
  };

  if (!option.min && option.max) return `${tAny("priceUpTo")} ${fmt(option.max)}`;
  if (option.min && !option.max) return `${tAny("priceFrom")} ${fmt(option.min)}`;
  return `${fmt(option.min)} – ${fmt(option.max)}`;
}

const propertyTypeIcons = {
  house: Home,
  apartment: Building2,
  land: Trees,
  commercial: Landmark,
} as const;

const vehicleTypeIcons: Partial<Record<VehicleCategory, typeof Car>> = {
  car: Car,
  suv: Car,
  motorcycle: Bike,
  truck: Truck,
};

const PROPERTY_TYPES = ["house", "apartment", "land", "commercial"] as const;
const VEHICLE_TYPES: VehicleCategory[] = [
  "car",
  "suv",
  "motorcycle",
  "truck",
  "van",
  "electric",
  "hybrid",
];

export function HeroSearchBar() {
  const t = useTranslations("landing.search");
  const tVeiculos = useTranslations("veiculos.categories");
  const { market } = useMarket();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useState<SearchCategory>("properties");
  const [location, setLocation] = useState("");
  const [resolvedLocation, setResolvedLocation] =
    useState<ResolvedLocation | null>(null);
  const [propertyType, setPropertyType] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleCategory | "">("");
  const [priceRangeId, setPriceRangeId] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [condition, setCondition] = useState<"" | "new" | "used">("");
  const [propertyCatalog, setPropertyCatalog] = useState<
    PropertyListing[] | null
  >(null);
  const [vehicleCatalog, setVehicleCatalog] = useState<
    VehicleListing[] | null
  >(null);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const priceOptions = useMemo(
    () =>
      category === "properties"
        ? propertyPriceOptions(market.currency.code)
        : vehiclePriceOptions(market.currency.code),
    [category, market.currency.code],
  );

  useEffect(() => {
    setPriceRangeId("");
  }, [category, market.currency.code]);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);

    const load =
      category === "properties"
        ? fetch("/api/listings/properties")
            .then((res) => (res.ok ? res.json() : []))
            .then((data: PropertyListing[]) => {
              if (!cancelled) setPropertyCatalog(Array.isArray(data) ? data : []);
            })
        : fetch("/api/listings/vehicles")
            .then((res) => (res.ok ? res.json() : []))
            .then((data: VehicleListing[]) => {
              if (!cancelled) setVehicleCatalog(Array.isArray(data) ? data : []);
            });

    load
      .catch(() => {
        if (cancelled) return;
        if (category === "properties") setPropertyCatalog([]);
        else setVehicleCatalog([]);
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  const selectedPrice = priceOptions.find((o) => o.id === priceRangeId);

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

  const draftPropertyFilters = useMemo((): ImoveisFilters => {
    return {
      ...defaultImoveisFilters,
      country: locationFields.country || market.countryName,
      state: locationFields.state,
      city: locationFields.city,
      neighborhood: locationFields.neighborhood,
      locationLabel: locationFields.locationLabel,
      lat: locationFields.lat,
      lng: locationFields.lng,
      type: propertyType,
      bedrooms,
      priceMin: selectedPrice?.min ?? "",
      priceMax: selectedPrice?.max ?? "",
    };
  }, [
    bedrooms,
    locationFields,
    market.countryName,
    propertyType,
    selectedPrice,
  ]);

  const draftVehicleFilters = useMemo((): VeiculosFilters => {
    return {
      ...defaultVeiculosFilters,
      state: locationFields.state,
      city: locationFields.city,
      locationLabel: locationFields.locationLabel,
      lat: locationFields.lat,
      lng: locationFields.lng,
      type: vehicleType,
      condition,
      priceMin: selectedPrice?.min ?? "",
      priceMax: selectedPrice?.max ?? "",
    };
  }, [condition, locationFields, selectedPrice, vehicleType]);

  const matchCount = useMemo(() => {
    if (category === "properties") {
      if (!propertyCatalog) return null;
      return filterProperties(propertyCatalog, draftPropertyFilters, {
        level: "properties",
        country: draftPropertyFilters.country || market.countryName,
        countryCode: market.countryCode,
        state: draftPropertyFilters.state || undefined,
        city: draftPropertyFilters.city || undefined,
        neighborhood: draftPropertyFilters.neighborhood || undefined,
      }).length;
    }
    if (!vehicleCatalog) return null;
    return filterVehicles(vehicleCatalog, draftVehicleFilters).length;
  }, [
    category,
    draftPropertyFilters,
    draftVehicleFilters,
    market.countryCode,
    market.countryName,
    propertyCatalog,
    vehicleCatalog,
  ]);

  const availablePropertyTypes = useMemo(() => {
    if (!propertyCatalog?.length) return PROPERTY_TYPES;
    const present = new Set(propertyCatalog.map((item) => item.type));
    return PROPERTY_TYPES.filter((type) => present.has(type));
  }, [propertyCatalog]);

  const availableVehicleTypes = useMemo(() => {
    if (!vehicleCatalog?.length) return VEHICLE_TYPES;
    const present = new Set(vehicleCatalog.map((item) => item.type));
    return VEHICLE_TYPES.filter((type) => present.has(type));
  }, [vehicleCatalog]);

  const goToSearch = () => {
    if (category === "vehicles") {
      const params = veiculosFiltersToParams(draftVehicleFilters, "list");
      startTransition(() => {
        router.push(
          `/veiculos${params.toString() ? `?${params.toString()}` : ""}`,
        );
      });
      return;
    }
    const params = imoveisFiltersToParams(draftPropertyFilters, "list");
    startTransition(() => {
      router.push(`/imoveis${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  const fieldClass =
    "group relative flex min-h-[72px] flex-1 flex-col justify-center gap-1 px-4 py-3 transition-colors duration-300 hover:bg-[#F7F4EC]/70 lg:min-h-[86px] lg:border-r lg:border-[#E8E4D9]";

  const selectClass =
    "w-full appearance-none bg-transparent pr-7 text-[15px] font-medium text-[#1A1F2B] outline-none";

  const TypeIcon =
    category === "properties"
      ? propertyType &&
        propertyTypeIcons[propertyType as keyof typeof propertyTypeIcons]
        ? propertyTypeIcons[propertyType as keyof typeof propertyTypeIcons]
        : Home
      : vehicleType && vehicleTypeIcons[vehicleType]
        ? vehicleTypeIcons[vehicleType]!
        : Car;

  return (
    <div className="rk-container relative z-30 -mt-11">
      <div className="mb-3 flex justify-center gap-2">
        {(
          [
            { id: "properties" as const, label: t("tabs.properties") },
            { id: "vehicles" as const, label: t("tabs.vehicles") },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
              category === tab.id
                ? "bg-[#D4A62A] text-[#0B1220]"
                : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch();
        }}
        className="overflow-hidden rounded-[999px] border border-white/40 bg-white shadow-[0_20px_60px_rgba(0,0,0,.25)] max-lg:rounded-[24px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className={cn(fieldClass, "min-w-0 lg:flex-[1.35]")}>
            <span className="rk-display text-[11px] font-semibold tracking-[0.08em] text-[#8C97A8] uppercase">
              {t("labels.location")}
            </span>
            <LocationAutocomplete
              theme="light"
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
              className="[&_div]:min-h-0 [&_div]:rounded-none [&_div]:border-0 [&_div]:px-0 [&_div]:ring-0"
            />
          </div>

          <label className={fieldClass}>
            <span className="rk-display text-[11px] font-semibold tracking-[0.08em] text-[#8C97A8] uppercase">
              {t("labels.type")}
            </span>
            <div className="relative flex items-center gap-2">
              <TypeIcon
                className="size-4 shrink-0 text-[#D4A62A]"
                strokeWidth={1.75}
              />
              {category === "properties" ? (
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("propertyType")}</option>
                  {availablePropertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {t(
                        `filters.${
                          type === "house"
                            ? "houses"
                            : type === "apartment"
                              ? "apartments"
                              : type === "land"
                                ? "land"
                                : "commercial"
                        }`,
                      )}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={vehicleType}
                  onChange={(e) =>
                    setVehicleType(e.target.value as VehicleCategory | "")
                  }
                  className={selectClass}
                >
                  <option value="">{t("vehicleType")}</option>
                  {availableVehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {tVeiculos(type)}
                    </option>
                  ))}
                </select>
              )}
              <ChevronDown className="pointer-events-none absolute right-0 size-4 text-[#8C97A8]" />
            </div>
          </label>

          <label className={fieldClass}>
            <span className="rk-display text-[11px] font-semibold tracking-[0.08em] text-[#8C97A8] uppercase">
              {t("labels.price")}
            </span>
            <div className="relative">
              <select
                value={priceRangeId}
                onChange={(e) => setPriceRangeId(e.target.value)}
                className={selectClass}
              >
                <option value="">{t("priceRange")}</option>
                {priceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {formatPriceLabel(option, market.currency.symbol, t)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-[#8C97A8]" />
            </div>
          </label>

          {category === "properties" ? (
            <label className={cn(fieldClass, "lg:border-r-0")}>
              <span className="rk-display text-[11px] font-semibold tracking-[0.08em] text-[#8C97A8] uppercase">
                {t("labels.bedrooms")}
              </span>
              <div className="relative flex items-center gap-2">
                <BedDouble
                  className="size-4 shrink-0 text-[#C8D0DD]"
                  strokeWidth={1.75}
                />
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className={selectClass}
                >
                  <option value="">{t("bedrooms")}</option>
                  {["1", "2", "3", "4", "5"].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 size-4 text-[#8C97A8]" />
              </div>
            </label>
          ) : (
            <label className={cn(fieldClass, "lg:border-r-0")}>
              <span className="rk-display text-[11px] font-semibold tracking-[0.08em] text-[#8C97A8] uppercase">
                {t("labels.condition")}
              </span>
              <div className="relative">
                <select
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value as "" | "new" | "used")
                  }
                  className={selectClass}
                >
                  <option value="">{t("conditionAny")}</option>
                  <option value="new">{t("conditionNew")}</option>
                  <option value="used">{t("conditionUsed")}</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-[#8C97A8]" />
              </div>
            </label>
          )}

          <div className="flex items-center gap-3 p-3 lg:pl-2">
            <div className="hidden min-w-[88px] text-right xl:block">
              {catalogLoading ? (
                <p className="text-xs text-[#8C97A8]">{t("loadingResults")}</p>
              ) : matchCount != null ? (
                <>
                  <p className="rk-display text-lg font-bold leading-none text-[#1A1F2B]">
                    {matchCount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C97A8]">{t("results")}</p>
                </>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="rk-btn-gold inline-flex h-[58px] w-full items-center justify-center gap-2 px-7 text-sm disabled:opacity-70 lg:min-w-[210px]"
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Search className="size-5" strokeWidth={2} />
              )}
              {isPending
                ? t("searching")
                : category === "vehicles"
                  ? t("submitVehicles")
                  : t("submit")}
            </button>
          </div>
        </div>
      </motion.form>

      {!catalogLoading && matchCount != null && (
        <p className="mt-3 text-center text-xs text-[#8C97A8] xl:hidden">
          {category === "vehicles"
            ? t("resultsMobileVehicles", { count: matchCount })
            : t("resultsMobile", { count: matchCount })}
        </p>
      )}
    </div>
  );
}
