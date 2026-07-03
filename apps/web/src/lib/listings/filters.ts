import { haversineKm } from "@/lib/geocoding/geo-utils";
import type { ImoveisFilters, MapNavigation } from "@/features/imoveis/types";
import type { PropertyListing } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";
import type { VehicleListing } from "@/features/veiculos/types";
import { brazilStates } from "@/lib/listings/regions";

export function filterProperties(
  listings: PropertyListing[],
  filters: ImoveisFilters,
  nav: MapNavigation,
): PropertyListing[] {
  return listings.filter((item) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.neighborhood.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (nav.country && item.country !== nav.country) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (nav.state) {
      const stateMatch =
        item.state === nav.state ||
        item.state === brazilStates.find((s) => s.name === nav.state)?.id;
      if (!stateMatch) return false;
    }
    if (filters.state) {
      const stateMatch =
        item.state === filters.state ||
        item.state === brazilStates.find((s) => s.name === filters.state)?.id;
      if (!stateMatch) return false;
    }
    const cityFilter = filters.city || nav.city;
    const neighborhoodFilter = filters.neighborhood || nav.neighborhood;

    if (filters.lat != null && filters.lng != null) {
      const radius = filters.radiusKm || 40;
      const distance = haversineKm(filters.lat, filters.lng, item.lat, item.lng);
      if (distance > radius) return false;
    } else {
      if (cityFilter && !item.city.toLowerCase().includes(cityFilter.toLowerCase()))
        return false;
      if (
        neighborhoodFilter &&
        !item.neighborhood.toLowerCase().includes(neighborhoodFilter.toLowerCase())
      )
        return false;
    }
    if (filters.launchOnly && !item.launch) return false;
    if (filters.type && item.type !== filters.type) return false;
    if (filters.transaction && item.transaction !== filters.transaction) return false;
    if (filters.condition && item.condition !== filters.condition) return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.bedrooms && item.bedrooms < Number(filters.bedrooms)) return false;
    if (filters.garage && item.garage < Number(filters.garage)) return false;
    if (filters.pool && !item.pool) return false;
    if (filters.areaMin && item.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.area > Number(filters.areaMax)) return false;
    if (filters.financing && !item.financing) return false;
    if (filters.rscCredit && !item.financing) return false;
    return true;
  });
}

export function filterVehicles(
  listings: VehicleListing[],
  filters: VeiculosFilters,
): VehicleListing[] {
  return listings.filter((v) => {
    if (filters.type && v.type !== filters.type) return false;
    if (filters.make && !v.make.toLowerCase().includes(filters.make.toLowerCase()))
      return false;
    if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase()))
      return false;
    if (filters.yearMin && v.year < Number(filters.yearMin)) return false;
    if (filters.yearMax && v.year > Number(filters.yearMax)) return false;
    if (filters.priceMin && v.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && v.price > Number(filters.priceMax)) return false;
    if (filters.mileageMax && v.mileage > Number(filters.mileageMax)) return false;
    if (filters.fuel && v.fuel !== filters.fuel) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    if (filters.color && !v.color.toLowerCase().includes(filters.color.toLowerCase()))
      return false;
    if (filters.engine && !v.engine.toLowerCase().includes(filters.engine.toLowerCase()))
      return false;
    if (filters.drive && v.drive !== filters.drive) return false;
    if (filters.financing && !v.financing) return false;
    if (filters.city && !v.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.state && v.state !== filters.state) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${v.title} ${v.make} ${v.model} ${v.city}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.lat != null && filters.lng != null) {
      const dist = haversineKm(filters.lat, filters.lng, v.lat, v.lng);
      if (dist > 200) return false;
    }
    return true;
  });
}
