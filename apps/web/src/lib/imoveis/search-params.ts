import {
  defaultImoveisFilters,
  type ImoveisFilters,
  type ImoveisView,
} from "@/features/imoveis/types";

const SEARCH_KEYS = [
  "city",
  "lat",
  "lng",
  "locationLabel",
  "q",
  "transaction",
  "type",
  "launch",
  "state",
  "neighborhood",
  "country",
  "priceMin",
  "priceMax",
  "bedrooms",
  "garage",
  "condition",
  "areaMin",
  "areaMax",
  "pool",
  "pets",
  "financing",
  "rscCredit",
] as const;

export function hasImoveisSearchParams(params: URLSearchParams): boolean {
  return SEARCH_KEYS.some((key) => {
    const value = params.get(key);
    return value != null && value !== "";
  });
}

export function parseImoveisSearchParams(
  params: URLSearchParams,
  defaults: ImoveisFilters = defaultImoveisFilters,
): { filters: ImoveisFilters; view: ImoveisView; searched: boolean } {
  const lat = params.get("lat");
  const lng = params.get("lng");
  const city = params.get("city") ?? "";

  const filters: ImoveisFilters = {
    ...defaults,
    query: params.get("q") ?? "",
    country: params.get("country") || defaults.country,
    state: params.get("state") ?? "",
    city,
    neighborhood: params.get("neighborhood") ?? "",
    locationLabel: params.get("locationLabel") ?? city,
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
    type: params.get("type") ?? "",
    transaction: (params.get("transaction") as ImoveisFilters["transaction"]) ?? "",
    condition: (params.get("condition") as ImoveisFilters["condition"]) ?? "",
    priceMin: params.get("priceMin") ?? "",
    priceMax: params.get("priceMax") ?? "",
    bedrooms: params.get("bedrooms") ?? "",
    garage: params.get("garage") ?? "",
    pool: params.get("pool") === "1",
    areaMin: params.get("areaMin") ?? "",
    areaMax: params.get("areaMax") ?? "",
    financing: params.get("financing") === "1",
    pets: params.get("pets") === "1",
    rscCredit: params.get("rscCredit") === "1",
    launchOnly: params.get("launch") === "1",
    radiusKm: params.get("radius") ? Number(params.get("radius")) : defaults.radiusKm,
  };

  const view = (params.get("view") as ImoveisView) || "list";

  return {
    filters,
    view,
    searched: hasImoveisSearchParams(params),
  };
}

export function imoveisFiltersToParams(
  filters: ImoveisFilters,
  view?: ImoveisView,
): URLSearchParams {
  const params = new URLSearchParams();

  const entries: [string, string][] = [
    ["q", filters.query],
    ["country", filters.country !== defaultImoveisFilters.country ? filters.country : ""],
    ["state", filters.state],
    ["city", filters.city],
    ["neighborhood", filters.neighborhood],
    ["locationLabel", filters.locationLabel],
    ["lat", filters.lat != null ? String(filters.lat) : ""],
    ["lng", filters.lng != null ? String(filters.lng) : ""],
    ["type", filters.type],
    ["transaction", filters.transaction],
    ["condition", filters.condition],
    ["priceMin", filters.priceMin],
    ["priceMax", filters.priceMax],
    ["bedrooms", filters.bedrooms],
    ["garage", filters.garage],
    ["areaMin", filters.areaMin],
    ["areaMax", filters.areaMax],
    ["pool", filters.pool ? "1" : ""],
    ["pets", filters.pets ? "1" : ""],
    ["financing", filters.financing ? "1" : ""],
    ["rscCredit", filters.rscCredit ? "1" : ""],
    ["launch", filters.launchOnly ? "1" : ""],
    ["radius", filters.radiusKm !== defaultImoveisFilters.radiusKm ? String(filters.radiusKm) : ""],
  ];

  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }

  if (view && view !== "list") params.set("view", view);

  return params;
}
