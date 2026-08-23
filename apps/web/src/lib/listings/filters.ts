import { haversineKm } from "@/lib/geocoding/geo-utils";
import type { ImoveisFilters, MapNavigation } from "@/features/imoveis/types";
import type { PropertyListing } from "@/features/imoveis/types";
import type { NegociosFilters, BusinessListing } from "@/features/negocios/types";
import type { ServiceListing, ServicesFilters } from "@/features/services/types";
import type { ProjetosFilters, ProjectListing } from "@/features/projetos/types";
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
    const locationScoped = Boolean(
      filters.city ||
        filters.state ||
        filters.neighborhood ||
        filters.locationLabel ||
        nav.city ||
        nav.state ||
        nav.neighborhood,
    );
    if (locationScoped && nav.country && item.country !== nav.country) return false;
    if (locationScoped && filters.country && item.country !== filters.country)
      return false;
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
    if (filters.featuredOnly && !item.premium && !item.featured) return false;
    if (filters.verifiedOnly && !item.verified) return false;
    if (filters.withPhotos && !item.image) return false;
    if (filters.withVirtualTour && !item.virtualTour && !item.videoUrl) return false;
    if (filters.priceReduced && !(item.originalPrice && item.originalPrice > item.price))
      return false;
    if (filters.newThisWeek) {
      const published = item.publishedAt ? new Date(item.publishedAt).getTime() : 0;
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (!item.launch && published < weekAgo) return false;
    }
    if (filters.type && item.type !== filters.type) return false;
    if (filters.transaction && item.transaction !== filters.transaction) return false;
    if (filters.condition && item.condition !== filters.condition) return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.bedrooms && item.bedrooms < Number(filters.bedrooms)) return false;
    if (filters.bathrooms && (item.bathrooms ?? 0) < Number(filters.bathrooms))
      return false;
    if (filters.garage && item.garage < Number(filters.garage)) return false;
    if (filters.pool && !item.pool) return false;
    if (filters.areaMin && item.area < Number(filters.areaMin)) return false;
    if (filters.areaMax && item.area > Number(filters.areaMax)) return false;
    if (filters.financing && !item.financing) return false;
    if (filters.rscCredit && !item.financing) return false;
    return true;
  });
}

const CAR_TYPES = new Set(["car", "suv", "sports", "electric", "hybrid"]);

export function matchesVehicleType(
  type: VehicleListing["type"],
  filter: VeiculosFilters["type"],
) {
  if (!filter) return true;
  if (filter === "car") return CAR_TYPES.has(type);
  return type === filter;
}

export function filterVehicles(
  listings: VehicleListing[],
  filters: VeiculosFilters,
): VehicleListing[] {
  return listings.filter((v) => {
    if (!matchesVehicleType(v.type, filters.type)) return false;
    if (filters.make && !v.make.toLowerCase().includes(filters.make.toLowerCase()))
      return false;
    if (filters.model && !v.model.toLowerCase().includes(filters.model.toLowerCase()))
      return false;
    if (filters.yearMin && v.year < Number(filters.yearMin)) return false;
    if (filters.yearMax && v.year > Number(filters.yearMax)) return false;
    if (filters.priceMin && v.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && v.price > Number(filters.priceMax)) return false;
    if (filters.mileageMin && v.mileage < Number(filters.mileageMin)) return false;
    if (filters.mileageMax && v.mileage > Number(filters.mileageMax)) return false;
    if (filters.fuel && v.fuel !== filters.fuel) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    if (filters.color && !v.color.toLowerCase().includes(filters.color.toLowerCase()))
      return false;
    if (filters.engine && !v.engine.toLowerCase().includes(filters.engine.toLowerCase()))
      return false;
    if (filters.drive && v.drive !== filters.drive) return false;
    if (filters.financing && !v.financing) return false;
    if (filters.verifiedOnly && !v.verified) return false;
    if (filters.withPhotos && !v.image) return false;
    if (filters.lowMileage && v.mileage > 30000) return false;
    if (filters.priceReduced && !(v.originalPrice && v.originalPrice > v.price))
      return false;
    if (filters.newThisWeek) {
      const published = v.publishedAt ? new Date(v.publishedAt).getTime() : 0;
      if (published < Date.now() - 7 * 24 * 60 * 60 * 1000) return false;
    }
    if (filters.country && v.country !== filters.country) return false;
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

export function filterProjects(
  listings: ProjectListing[],
  filters: ProjetosFilters,
): ProjectListing[] {
  return listings.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.deliveryFrom && item.deliveryYear < Number(filters.deliveryFrom))
      return false;
    if (filters.deliveryTo && item.deliveryYear > Number(filters.deliveryTo))
      return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.verifiedOnly && !item.verified) return false;
    if (filters.paymentPlan && !item.paymentPlan) return false;
    if (filters.highRoi && !item.highRoi) return false;
    if (filters.luxury && !item.luxury) return false;
    if (filters.sustainable && !item.sustainable) return false;
    if (filters.withAmenities && !item.amenities) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.state && item.state !== filters.state) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack =
        `${item.title} ${item.developer} ${item.city} ${item.unitType}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

const SERVICE_CYCLE_TYPES: Record<string, ServiceListing["type"][]> = {
  buy: ["agents", "appraisal", "photography", "staging", "legal"],
  finance: ["financing", "insurance"],
  inspect: ["inspection"],
  renovate: ["architecture", "interior", "renovation", "construction", "landscaping"],
  manage: ["management", "cleaning", "security", "maintenance"],
  sell: ["agents", "photography", "staging", "moving"],
};

export function filterServices(
  listings: ServiceListing[],
  filters: ServicesFilters,
): ServiceListing[] {
  return listings.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (
      !filters.type &&
      filters.cycle &&
      !SERVICE_CYCLE_TYPES[filters.cycle]?.includes(item.type)
    ) {
      return false;
    }
    if (filters.priceMin && (item.price ?? Infinity) < Number(filters.priceMin))
      return false;
    if (filters.priceMax && (item.price ?? 0) > Number(filters.priceMax)) return false;
    if (filters.verifiedOnly && !item.verified) return false;
    if (filters.availableToday && !item.availableToday) return false;
    if (filters.availableWeek && !item.availableWeek) return false;
    if (filters.online && !item.online) return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.state && item.state !== filters.state) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack =
        `${item.title} ${item.provider} ${item.city} ${item.type} ${item.description}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortServices(
  listings: ServiceListing[],
  sort: ServicesFilters["sort"],
) {
  const list = [...listings];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => (a.price ?? 1e12) - (b.price ?? 1e12));
    case "newest":
      return list.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime(),
      );
    default:
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  }
}

export function filterBusinesses(
  listings: BusinessListing[],
  filters: NegociosFilters,
): BusinessListing[] {
  return listings.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.priceMin && item.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && item.price > Number(filters.priceMax)) return false;
    if (filters.revenueMin && item.revenue < Number(filters.revenueMin)) return false;
    if (filters.revenueMax && item.revenue > Number(filters.revenueMax)) return false;
    if (filters.verifiedOnly && !item.verified) return false;
    if (filters.profitable && !item.profitable) return false;
    if (filters.withEquipment && !item.equipment) return false;
    if (filters.franchise && !item.franchise) return false;
    if (filters.sellerFinancing && !item.sellerFinancing) return false;
    if (filters.priceReduced && !(item.originalPrice && item.originalPrice > item.price))
      return false;
    if (filters.country && item.country !== filters.country) return false;
    if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.state && item.state !== filters.state) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack =
        `${item.title} ${item.broker} ${item.city} ${item.type}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortBusinesses(
  listings: BusinessListing[],
  sort: NegociosFilters["sort"],
) {
  const list = [...listings];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "revenue_desc":
      return list.sort((a, b) => b.revenue - a.revenue);
    default:
      return list.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime(),
      );
  }
}

export function sortProjects(
  listings: ProjectListing[],
  sort: ProjetosFilters["sort"],
) {
  const list = [...listings];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "delivery_asc":
      return list.sort((a, b) => a.deliveryYear - b.deliveryYear);
    default:
      return list.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime(),
      );
  }
}

export function sortVehicles(
  listings: VehicleListing[],
  sort: VeiculosFilters["sort"],
) {
  const list = [...listings];
  switch (sort) {
    case "price_asc":
      return list.sort((a, b) => a.price - b.price);
    case "price_desc":
      return list.sort((a, b) => b.price - a.price);
    case "mileage_asc":
      return list.sort((a, b) => a.mileage - b.mileage);
    default:
      return list.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime(),
      );
  }
}
