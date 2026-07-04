import { defaultImoveisFilters } from "@/features/imoveis/types";
import { imoveisFiltersToParams } from "@/lib/imoveis/search-params";

export function buildCitySearchHref(
  city: string,
  state: string,
  patch: Partial<typeof defaultImoveisFilters> = {},
) {
  const filters = {
    ...defaultImoveisFilters,
    city,
    state,
    locationLabel: `${city}, ${state}`,
    ...patch,
  };

  const query = imoveisFiltersToParams(filters).toString();
  return query ? `/imoveis?${query}` : "/imoveis";
}
