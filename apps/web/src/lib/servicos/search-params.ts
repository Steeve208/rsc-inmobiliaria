import {
  defaultServicesFilters,
  type ServiceCategory,
  type ServiceCycle,
  type ServiceSort,
  type ServicesFilters,
  type ServicesView,
} from "@/features/services/types";

const SEARCH_KEYS = [
  "q",
  "type",
  "city",
  "state",
  "country",
  "locationLabel",
  "lat",
  "lng",
  "priceMin",
  "priceMax",
  "verified",
  "today",
  "week",
  "online",
  "cycle",
  "sort",
] as const;

export function hasServicesSearchParams(params: URLSearchParams) {
  return SEARCH_KEYS.some((key) => {
    const value = params.get(key);
    return value != null && value !== "";
  });
}

export function parseServicesSearchParams(
  params: URLSearchParams,
  defaults: ServicesFilters = defaultServicesFilters,
): { filters: ServicesFilters; view: ServicesView } {
  const lat = params.get("lat");
  const lng = params.get("lng");
  const city = params.get("city") ?? "";
  const rawView = params.get("view");

  return {
    filters: {
      ...defaults,
      query: params.get("q") ?? "",
      type: (params.get("type") as ServiceCategory | "") ?? "",
      priceMin: params.get("priceMin") ?? "",
      priceMax: params.get("priceMax") ?? "",
      country: params.get("country") ?? "",
      state: params.get("state") ?? "",
      city,
      locationLabel: params.get("locationLabel") ?? city,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      verifiedOnly: params.get("verified") === "1",
      availableToday: params.get("today") === "1",
      availableWeek: params.get("week") === "1",
      online: params.get("online") === "1",
      cycle: (params.get("cycle") as ServiceCycle | "") ?? "",
      sort: (params.get("sort") as ServiceSort) || defaults.sort,
    },
    view: rawView === "list" || rawView === "map" ? rawView : "grid",
  };
}

export function servicesFiltersToParams(
  filters: ServicesFilters,
  view?: ServicesView,
) {
  const params = new URLSearchParams();
  const entries: [string, string][] = [
    ["q", filters.query],
    ["type", filters.type],
    ["country", filters.country],
    ["state", filters.state],
    ["city", filters.city],
    ["locationLabel", filters.locationLabel],
    ["lat", filters.lat != null ? String(filters.lat) : ""],
    ["lng", filters.lng != null ? String(filters.lng) : ""],
    ["priceMin", filters.priceMin],
    ["priceMax", filters.priceMax],
    ["verified", filters.verifiedOnly ? "1" : ""],
    ["today", filters.availableToday ? "1" : ""],
    ["week", filters.availableWeek ? "1" : ""],
    ["online", filters.online ? "1" : ""],
    ["cycle", filters.cycle],
    ["sort", filters.sort !== defaultServicesFilters.sort ? filters.sort : ""],
  ];
  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }
  if (view && view !== "grid") params.set("view", view);
  return params;
}
