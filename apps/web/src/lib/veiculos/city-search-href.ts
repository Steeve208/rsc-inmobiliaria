import type { VehicleCategory } from "@/features/veiculos/types";
import { defaultVeiculosFilters } from "@/features/veiculos/types";
import { veiculosFiltersToParams } from "@/lib/veiculos/search-params";

export function buildCitySearchHref(
  city: string,
  state: string,
  patch: Partial<typeof defaultVeiculosFilters> = {},
) {
  const filters = {
    ...defaultVeiculosFilters,
    city,
    state,
    locationLabel: `${city}, ${state}`,
    ...patch,
  };

  const query = veiculosFiltersToParams(filters).toString();
  return query ? `/veiculos?${query}` : "/veiculos";
}

export function buildCityCategoryHref(
  city: string,
  state: string,
  type: VehicleCategory,
) {
  return buildCitySearchHref(city, state, { type });
}
