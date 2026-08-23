import {
  defaultVeiculosFilters,
  type VeiculosFilters,
  type VeiculosView,
  type VehicleCategory,
  type VehicleSort,
} from "@/features/veiculos/types";

const SEARCH_KEYS = [
  "city",
  "state",
  "country",
  "type",
  "lat",
  "lng",
  "locationLabel",
  "q",
  "make",
  "model",
  "yearMin",
  "yearMax",
  "priceMin",
  "priceMax",
  "mileageMin",
  "mileageMax",
  "fuel",
  "transmission",
  "condition",
  "verified",
  "photos",
  "lowKm",
  "reduced",
  "newWeek",
  "sort",
] as const;

export function hasVeiculosSearchParams(params: URLSearchParams): boolean {
  return SEARCH_KEYS.some((key) => {
    const value = params.get(key);
    return value != null && value !== "";
  });
}

export function parseVeiculosSearchParams(
  params: URLSearchParams,
  defaults: VeiculosFilters = defaultVeiculosFilters,
): { filters: VeiculosFilters; view: VeiculosView; searched: boolean } {
  const lat = params.get("lat");
  const lng = params.get("lng");
  const city = params.get("city") ?? "";

  const filters: VeiculosFilters = {
    ...defaults,
    query: params.get("q") ?? "",
    type: (params.get("type") as VehicleCategory | "") ?? "",
    make: params.get("make") ?? "",
    model: params.get("model") ?? "",
    yearMin: params.get("yearMin") ?? "",
    yearMax: params.get("yearMax") ?? "",
    priceMin: params.get("priceMin") ?? "",
    priceMax: params.get("priceMax") ?? "",
    mileageMin: params.get("mileageMin") ?? "",
    mileageMax: params.get("mileageMax") ?? "",
    fuel: (params.get("fuel") as VeiculosFilters["fuel"]) ?? "",
    transmission: (params.get("transmission") as VeiculosFilters["transmission"]) ?? "",
    color: params.get("color") ?? "",
    engine: params.get("engine") ?? "",
    drive: (params.get("drive") as VeiculosFilters["drive"]) ?? "",
    financing: params.get("financing") === "1",
    condition: (params.get("condition") as VeiculosFilters["condition"]) ?? "",
    country: params.get("country") ?? "",
    state: params.get("state") ?? "",
    city,
    locationLabel: params.get("locationLabel") ?? city,
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
    verifiedOnly: params.get("verified") === "1",
    withPhotos: params.get("photos") === "1",
    lowMileage: params.get("lowKm") === "1",
    priceReduced: params.get("reduced") === "1",
    newThisWeek: params.get("newWeek") === "1",
    sort: (params.get("sort") as VehicleSort) || defaults.sort,
  };

  const rawView = params.get("view");
  const view: VeiculosView =
    rawView === "list" || rawView === "map" ? rawView : "grid";

  return {
    filters,
    view,
    searched: hasVeiculosSearchParams(params),
  };
}

export function veiculosFiltersToParams(
  filters: VeiculosFilters,
  view?: VeiculosView,
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
    ["make", filters.make],
    ["model", filters.model],
    ["yearMin", filters.yearMin],
    ["yearMax", filters.yearMax],
    ["priceMin", filters.priceMin],
    ["priceMax", filters.priceMax],
    ["mileageMin", filters.mileageMin],
    ["mileageMax", filters.mileageMax],
    ["fuel", filters.fuel],
    ["transmission", filters.transmission],
    ["color", filters.color],
    ["engine", filters.engine],
    ["drive", filters.drive],
    ["condition", filters.condition],
    ["financing", filters.financing ? "1" : ""],
    ["verified", filters.verifiedOnly ? "1" : ""],
    ["photos", filters.withPhotos ? "1" : ""],
    ["lowKm", filters.lowMileage ? "1" : ""],
    ["reduced", filters.priceReduced ? "1" : ""],
    ["newWeek", filters.newThisWeek ? "1" : ""],
    ["sort", filters.sort !== defaultVeiculosFilters.sort ? filters.sort : ""],
  ];

  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }

  if (view && view !== "grid") params.set("view", view);

  return params;
}
