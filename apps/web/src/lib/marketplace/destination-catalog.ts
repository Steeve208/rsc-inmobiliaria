import type { PropertyListing } from "@/features/imoveis/types";
import {
  regionForCountry,
  type DestinationRegion,
} from "@/lib/marketplace/destination-regions";

export type DestinationCity = {
  key: string;
  city: string;
  country: string;
  region: DestinationRegion | "other";
  count: number;
  image: string;
  href: string;
};

export type DestinationCountry = {
  key: string;
  country: string;
  region: DestinationRegion | "other";
  count: number;
  image: string;
  href: string;
};

export type DestinationCatalog = {
  hero: { image: string; city: string; country: string } | null;
  cities: DestinationCity[];
  countries: DestinationCountry[];
};

function placeLabel(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 3 && word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function catalogHref(params: Record<string, string>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `/imoveis?${query}` : "/imoveis";
}

export function buildDestinationCatalog(properties: PropertyListing[]): DestinationCatalog {
  const cities = new Map<
    string,
    { city: string; country: string; count: number; image: string }
  >();
  const countries = new Map<
    string,
    { country: string; count: number; image: string }
  >();

  for (const item of properties) {
    const countryRaw = item.country?.trim() ?? "";
    const cityRaw = item.city?.trim() ?? "";
    const image = item.image?.trim() ?? "";
    if (!countryRaw && !cityRaw) continue;

    if (countryRaw) {
      const key = countryRaw.toLowerCase();
      const current = countries.get(key);
      if (current) {
        current.count += 1;
        if (!current.image && image) current.image = image;
      } else {
        countries.set(key, { country: countryRaw, count: 1, image });
      }
    }

    if (cityRaw) {
      const key = `${cityRaw.toLowerCase()}|${countryRaw.toLowerCase()}`;
      const current = cities.get(key);
      if (current) {
        current.count += 1;
        if (!current.image && image) current.image = image;
      } else {
        cities.set(key, {
          city: cityRaw,
          country: countryRaw,
          count: 1,
          image,
        });
      }
    }
  }

  const cityList: DestinationCity[] = [...cities.entries()]
    .map(([key, item]) => ({
      key,
      city: placeLabel(item.city),
      country: item.country ? placeLabel(item.country) : "",
      region: item.country ? regionForCountry(item.country) : "other",
      count: item.count,
      image: item.image,
      href: catalogHref({
        city: item.city,
        country: item.country,
        locationLabel: item.city,
      }),
    }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));

  const countryList: DestinationCountry[] = [...countries.values()]
    .map((item) => ({
      key: item.country.toLowerCase(),
      country: placeLabel(item.country),
      region: regionForCountry(item.country),
      count: item.count,
      image: item.image,
      href: catalogHref({
        country: item.country,
        locationLabel: item.country,
      }),
    }))
    .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));

  const lead = cityList[0] ?? null;

  return {
    hero: lead
      ? { image: lead.image, city: lead.city, country: lead.country }
      : null,
    cities: cityList,
    countries: countryList,
  };
}
