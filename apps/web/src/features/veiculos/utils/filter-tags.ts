import type { VeiculosFilters } from "../types";
import { brazilStates } from "../mock-data";

type Tag = {
  id: string;
  label: string;
  clear: Partial<VeiculosFilters>;
};

type Labels = Record<string, string>;

export function buildFilterTags(filters: VeiculosFilters, labels: Labels): Tag[] {
  const tags: Tag[] = [];

  const typeLabels: Record<string, string> = {
    car: labels.car ?? "Car",
    suv: labels.suv ?? "SUV",
    sports: labels.sports ?? "Sports",
    van: labels.van ?? "Van",
    truck: labels.truck ?? "Truck",
    motorcycle: labels.motorcycle ?? "Motorcycle",
    machinery: labels.machinery ?? "Machinery",
    electric: labels.electric ?? "Electric",
    hybrid: labels.hybrid ?? "Hybrid",
  };

  if (filters.type)
    tags.push({
      id: "type",
      label: typeLabels[filters.type] ?? filters.type,
      clear: { type: "" },
    });
  if (filters.make)
    tags.push({ id: "make", label: filters.make, clear: { make: "" } });
  if (filters.model)
    tags.push({ id: "model", label: filters.model, clear: { model: "" } });
  if (filters.locationLabel) {
    tags.push({
      id: "location",
      label: filters.locationLabel,
      clear: { locationLabel: "", lat: null, lng: null },
    });
  } else if (filters.city) {
    tags.push({ id: "city", label: filters.city, clear: { city: "" } });
  }
  if (filters.state) {
    const stateName =
      brazilStates.find((s) => s.id === filters.state)?.name ?? filters.state;
    tags.push({ id: "state", label: stateName, clear: { state: "" } });
  }
  if (filters.yearMin)
    tags.push({
      id: "year-min",
      label: `${labels.yearFrom ?? "From"} ${filters.yearMin}`,
      clear: { yearMin: "" },
    });
  if (filters.yearMax)
    tags.push({
      id: "year-max",
      label: `${labels.yearTo ?? "To"} ${filters.yearMax}`,
      clear: { yearMax: "" },
    });
  if (filters.priceMin)
    tags.push({
      id: "price-min",
      label: `${labels.priceFrom ?? "From"} R$ ${filters.priceMin}`,
      clear: { priceMin: "" },
    });
  if (filters.priceMax)
    tags.push({
      id: "price-max",
      label: `${labels.priceUpTo ?? "Up to"} R$ ${filters.priceMax}`,
      clear: { priceMax: "" },
    });
  if (filters.mileageMax)
    tags.push({
      id: "mileage",
      label: `${labels.mileageUpTo ?? "Up to"} ${filters.mileageMax} km`,
      clear: { mileageMax: "" },
    });
  if (filters.fuel)
    tags.push({ id: "fuel", label: filters.fuel, clear: { fuel: "" } });
  if (filters.transmission)
    tags.push({
      id: "transmission",
      label: filters.transmission,
      clear: { transmission: "" },
    });
  if (filters.color)
    tags.push({ id: "color", label: filters.color, clear: { color: "" } });
  if (filters.financing)
    tags.push({
      id: "financing",
      label: labels.financing ?? "Financing",
      clear: { financing: false },
    });

  return tags;
}

export function countActiveFilters(filters: VeiculosFilters): number {
  return buildFilterTags(filters, {}).length;
}
