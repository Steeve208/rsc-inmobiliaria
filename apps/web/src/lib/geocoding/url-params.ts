import type { ResolvedLocation } from "./types";

export type LocationSearchParams = {
  city: string;
  state: string;
  neighborhood: string;
  country: string;
  locationLabel: string;
  lat: number | null;
  lng: number | null;
  query: string;
  type: string;
};

export function locationToSearchParams(
  location: Partial<ResolvedLocation> & { locationLabel?: string },
  base?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(base);
  const label = location.locationLabel ?? location.label;

  if (location.city) params.set("city", location.city);
  if (location.state) params.set("state", location.state);
  if (location.neighborhood) params.set("neighborhood", location.neighborhood);
  if (location.country) params.set("country", location.country);
  if (label) params.set("locationLabel", label);
  if (location.lat != null) params.set("lat", String(location.lat));
  if (location.lng != null) params.set("lng", String(location.lng));

  return params;
}

export function parseLocationSearchParams(
  searchParams: URLSearchParams,
): LocationSearchParams {
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const city = searchParams.get("city") ?? "";

  return {
    city,
    state: searchParams.get("state") ?? "",
    neighborhood: searchParams.get("neighborhood") ?? "",
    country: searchParams.get("country") ?? "",
    locationLabel: searchParams.get("locationLabel") ?? city,
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
    query: searchParams.get("q") ?? "",
    type: searchParams.get("type") ?? "",
  };
}

export function hasLocationSearchParams(searchParams: URLSearchParams) {
  return Boolean(
    searchParams.get("city") ||
      searchParams.get("lat") ||
      searchParams.get("locationLabel") ||
      searchParams.get("q"),
  );
}
