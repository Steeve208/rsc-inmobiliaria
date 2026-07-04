import {
  defaultVeiculosFilters,
  type VeiculosFilters,
  type VeiculosView,
  type VehicleCategory,
} from "@/features/veiculos/types";

const SEARCH_KEYS = [
  "city",
  "state",
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
  "mileageMax",
  "fuel",
  "transmission",
  "condition",
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
    mileageMax: params.get("mileageMax") ?? "",
    fuel: (params.get("fuel") as VeiculosFilters["fuel"]) ?? "",
    transmission: (params.get("transmission") as VeiculosFilters["transmission"]) ?? "",
    color: params.get("color") ?? "",
    engine: params.get("engine") ?? "",
    drive: (params.get("drive") as VeiculosFilters["drive"]) ?? "",
    financing: params.get("financing") === "1",
    condition: (params.get("condition") as VeiculosFilters["condition"]) ?? "",
    state: params.get("state") ?? "",
    city,
    locationLabel: params.get("locationLabel") ?? city,
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
  };

  const view = (params.get("view") as VeiculosView) || "list";

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
    ["mileageMax", filters.mileageMax],
    ["fuel", filters.fuel],
    ["transmission", filters.transmission],
    ["color", filters.color],
    ["engine", filters.engine],
    ["drive", filters.drive],
    ["condition", filters.condition],
    ["financing", filters.financing ? "1" : ""],
  ];

  for (const [key, value] of entries) {
    if (value) params.set(key, value);
  }

  if (view && view !== "list") params.set("view", view);

  return params;
}
