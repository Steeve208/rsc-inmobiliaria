import {
  defaultNegociosFilters,
  type BusinessCategory,
  type BusinessSort,
  type NegociosFilters,
  type NegociosView,
} from "@/features/negocios/types";

const SEARCH_KEYS = [
  "city",
  "state",
  "country",
  "type",
  "lat",
  "lng",
  "locationLabel",
  "q",
  "priceMin",
  "priceMax",
  "revenueMin",
  "revenueMax",
  "verified",
  "profit",
  "equipment",
  "franchise",
  "financing",
  "reduced",
  "sort",
] as const;

export function hasNegociosSearchParams(params: URLSearchParams): boolean {
  return SEARCH_KEYS.some((key) => {
    const value = params.get(key);
    return value != null && value !== "";
  });
}

export function parseNegociosSearchParams(
  params: URLSearchParams,
  defaults: NegociosFilters = defaultNegociosFilters,
): { filters: NegociosFilters; view: NegociosView } {
  const lat = params.get("lat");
  const lng = params.get("lng");
  const city = params.get("city") ?? "";

  return {
    filters: {
      ...defaults,
      query: params.get("q") ?? "",
      type: (params.get("type") as BusinessCategory | "") ?? "",
      priceMin: params.get("priceMin") ?? "",
      priceMax: params.get("priceMax") ?? "",
      revenueMin: params.get("revenueMin") ?? "",
      revenueMax: params.get("revenueMax") ?? "",
      country: params.get("country") ?? "",
      state: params.get("state") ?? "",
      city,
      locationLabel: params.get("locationLabel") ?? city,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      verifiedOnly: params.get("verified") === "1",
      profitable: params.get("profit") === "1",
      withEquipment: params.get("equipment") === "1",
      franchise: params.get("franchise") === "1",
      sellerFinancing: params.get("financing") === "1",
      priceReduced: params.get("reduced") === "1",
      sort: (params.get("sort") as BusinessSort) || defaults.sort,
    },
    view: ((): NegociosView => {
      const rawView = params.get("view");
      return rawView === "list" || rawView === "map" ? rawView : "grid";
    })(),
  };
}

export function negociosFiltersToParams(
  filters: NegociosFilters,
  view?: NegociosView,
): URLSearchParams {
  const params = new URLSearchParams();
  const entries: [string, string][] = [
    ["q", filters.query],
    ["country", filters.country],
    ["state", filters.state],
    ["city", filters.city],
    ["locationLabel", filters.locationLabel],
    ["lat", filters.lat != null ? String(filters.lat) : ""],
    ["lng", filters.lng != null ? String(filters.lng) : ""],
    ["type", filters.type],
    ["priceMin", filters.priceMin],
    ["priceMax", filters.priceMax],
    ["revenueMin", filters.revenueMin],
    ["revenueMax", filters.revenueMax],
    ["verified", filters.verifiedOnly ? "1" : ""],
    ["profit", filters.profitable ? "1" : ""],
    ["equipment", filters.withEquipment ? "1" : ""],
    ["franchise", filters.franchise ? "1" : ""],
    ["financing", filters.sellerFinancing ? "1" : ""],
    ["reduced", filters.priceReduced ? "1" : ""],
    ["sort", filters.sort !== defaultNegociosFilters.sort ? filters.sort : ""],
  ];
  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }
  if (view && view !== "grid") params.set("view", view);
  return params;
}
