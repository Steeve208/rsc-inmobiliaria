import {
  defaultProjetosFilters,
  type ProjectSort,
  type ProjectStatus,
  type ProjectType,
  type ProjetosFilters,
  type ProjetosView,
} from "@/features/projetos/types";

const SEARCH_KEYS = [
  "city",
  "state",
  "country",
  "type",
  "status",
  "lat",
  "lng",
  "locationLabel",
  "q",
  "priceMin",
  "priceMax",
  "deliveryFrom",
  "deliveryTo",
  "verified",
  "plan",
  "roi",
  "luxury",
  "eco",
  "amenities",
  "sort",
] as const;

export function hasProjetosSearchParams(params: URLSearchParams): boolean {
  return SEARCH_KEYS.some((key) => {
    const value = params.get(key);
    return value != null && value !== "";
  });
}

export function parseProjetosSearchParams(
  params: URLSearchParams,
  defaults: ProjetosFilters = defaultProjetosFilters,
): { filters: ProjetosFilters; view: ProjetosView; searched: boolean } {
  const lat = params.get("lat");
  const lng = params.get("lng");
  const city = params.get("city") ?? "";

  const filters: ProjetosFilters = {
    ...defaults,
    query: params.get("q") ?? "",
    type: (params.get("type") as ProjectType | "") ?? "",
    status: (params.get("status") as ProjectStatus | "") ?? "",
    deliveryFrom: params.get("deliveryFrom") ?? "",
    deliveryTo: params.get("deliveryTo") ?? "",
    priceMin: params.get("priceMin") ?? "",
    priceMax: params.get("priceMax") ?? "",
    country: params.get("country") ?? "",
    state: params.get("state") ?? "",
    city,
    locationLabel: params.get("locationLabel") ?? city,
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
    verifiedOnly: params.get("verified") === "1",
    paymentPlan: params.get("plan") === "1",
    highRoi: params.get("roi") === "1",
    luxury: params.get("luxury") === "1",
    sustainable: params.get("eco") === "1",
    withAmenities: params.get("amenities") === "1",
    sort: (params.get("sort") as ProjectSort) || defaults.sort,
  };

  const rawView = params.get("view");
  const view: ProjetosView =
    rawView === "list" || rawView === "map" ? rawView : "grid";

  return {
    filters,
    view,
    searched: hasProjetosSearchParams(params),
  };
}

export function projetosFiltersToParams(
  filters: ProjetosFilters,
  view?: ProjetosView,
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
    ["status", filters.status],
    ["deliveryFrom", filters.deliveryFrom],
    ["deliveryTo", filters.deliveryTo],
    ["priceMin", filters.priceMin],
    ["priceMax", filters.priceMax],
    ["verified", filters.verifiedOnly ? "1" : ""],
    ["plan", filters.paymentPlan ? "1" : ""],
    ["roi", filters.highRoi ? "1" : ""],
    ["luxury", filters.luxury ? "1" : ""],
    ["eco", filters.sustainable ? "1" : ""],
    ["amenities", filters.withAmenities ? "1" : ""],
    ["sort", filters.sort !== defaultProjetosFilters.sort ? filters.sort : ""],
  ];

  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }

  if (view && view !== "grid") params.set("view", view);

  return params;
}
