import type { ImoveisFilters } from "../types";
import { brazilStates } from "../mock-data";
import { clearLocationFilters } from "@/lib/geocoding/types";

type Tag = {
  id: string;
  label: string;
  clear: Partial<ImoveisFilters>;
};

type Labels = {
  buy: string;
  rent: string;
  new: string;
  used: string;
  house: string;
  apartment: string;
  land: string;
  pool: string;
  pets: string;
  financing: string;
  rscCredit: string;
  garage: string;
  bedrooms: string;
  priceUpTo: string;
  priceFrom: string;
  areaFrom: string;
  areaTo: string;
  city: string;
  state: string;
};

export function buildFilterTags(
  filters: ImoveisFilters,
  labels: Labels,
): Tag[] {
  const tags: Tag[] = [];

  if (filters.transaction === "buy")
    tags.push({ id: "tx-buy", label: labels.buy, clear: { transaction: "" } });
  if (filters.transaction === "rent")
    tags.push({ id: "tx-rent", label: labels.rent, clear: { transaction: "" } });
  if (filters.condition === "new")
    tags.push({ id: "cond-new", label: labels.new, clear: { condition: "" } });
  if (filters.condition === "used")
    tags.push({ id: "cond-used", label: labels.used, clear: { condition: "" } });
  if (filters.type === "house")
    tags.push({ id: "type-house", label: labels.house, clear: { type: "" } });
  if (filters.type === "apartment")
    tags.push({ id: "type-apartment", label: labels.apartment, clear: { type: "" } });
  if (filters.type === "land")
    tags.push({ id: "type-land", label: labels.land, clear: { type: "" } });
  if (filters.locationLabel) {
    tags.push({
      id: "location",
      label: filters.locationLabel,
      clear: clearLocationFilters(),
    });
  } else if (filters.city) {
    tags.push({ id: "city", label: filters.city, clear: { city: "" } });
  }
  if (filters.state) {
    const stateName =
      brazilStates.find((s) => s.id === filters.state)?.name ?? filters.state;
    tags.push({ id: "state", label: stateName, clear: { state: "" } });
  }
  if (filters.priceMin)
    tags.push({
      id: "price-min",
      label: `${labels.priceFrom} R$ ${filters.priceMin}`,
      clear: { priceMin: "" },
    });
  if (filters.priceMax)
    tags.push({
      id: "price-max",
      label: `${labels.priceUpTo} R$ ${filters.priceMax}`,
      clear: { priceMax: "" },
    });
  if (filters.bedrooms)
    tags.push({
      id: "bedrooms",
      label: `${filters.bedrooms}+ ${labels.bedrooms}`,
      clear: { bedrooms: "" },
    });
  if (filters.garage)
    tags.push({ id: "garage", label: labels.garage, clear: { garage: "" } });
  if (filters.pool)
    tags.push({ id: "pool", label: labels.pool, clear: { pool: false } });
  if (filters.pets)
    tags.push({ id: "pets", label: labels.pets, clear: { pets: false } });
  if (filters.financing)
    tags.push({ id: "financing", label: labels.financing, clear: { financing: false } });
  if (filters.rscCredit)
    tags.push({ id: "rscCredit", label: labels.rscCredit, clear: { rscCredit: false } });
  if (filters.areaMin)
    tags.push({
      id: "area-min",
      label: `${labels.areaFrom} ${filters.areaMin} m²`,
      clear: { areaMin: "" },
    });
  if (filters.areaMax)
    tags.push({
      id: "area-max",
      label: `${labels.areaTo} ${filters.areaMax} m²`,
      clear: { areaMax: "" },
    });

  return tags;
}

export function countActiveFilters(filters: ImoveisFilters): number {
  return buildFilterTags(filters, {
    buy: "",
    rent: "",
    new: "",
    used: "",
    house: "",
    apartment: "",
    land: "",
    pool: "",
    pets: "",
    financing: "",
    rscCredit: "",
    garage: "",
    bedrooms: "",
    priceUpTo: "",
    priceFrom: "",
    areaFrom: "",
    areaTo: "",
    city: "",
    state: "",
  }).length;
}
