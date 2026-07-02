import { brazilStates } from "@/features/imoveis/mock-data";
import { markets } from "@/lib/markets/config";
import type { ResolvedLocation } from "./types";

function normalizeCountry(code: string, name: string): string {
  const market = Object.values(markets).find(
    (item) => item.countryCode === code.toLowerCase(),
  );
  if (market) return market.countryName;
  return name;
}

function normalizeState(raw: string): string {
  if (!raw) return "";
  const upper = raw.toUpperCase();
  if (upper.length === 2) return upper;
  const match = brazilStates.find(
    (s) =>
      s.name.toLowerCase() === raw.toLowerCase() ||
      s.id === upper,
  );
  return match?.id ?? raw;
}

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  road?: string;
};

export function parseNominatimResult(data: {
  address?: NominatimAddress;
  display_name?: string;
  lat?: string;
  lon?: string;
}): ResolvedLocation {
  const addr = data.address ?? {};
  const city =
    addr.city ??
    addr.town ??
    addr.village ??
    addr.municipality ??
    addr.suburb ??
    "";
  const state = normalizeState(addr.state ?? "");
  const countryCode = (addr.country_code ?? "").toLowerCase();
  const country = normalizeCountry(countryCode, addr.country ?? "");

  return {
    label: data.display_name ?? [city, state, country].filter(Boolean).join(", "),
    city,
    state,
    country,
    countryCode,
    lat: Number(data.lat ?? 0),
    lng: Number(data.lon ?? 0),
  };
}

export function parsePhotonFeature(feature: {
  properties?: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    street?: string;
    district?: string;
  };
  geometry?: { coordinates?: [number, number] };
}): ResolvedLocation {
  const props = feature.properties ?? {};
  const coords = feature.geometry?.coordinates ?? [0, 0];
  const countryCode = (props.countrycode ?? "").toLowerCase();
  const country = normalizeCountry(countryCode, props.country ?? "");
  const city = props.city ?? props.name ?? "";
  const state = normalizeState(props.state ?? "");

  const label = [props.name, city, state, country].filter(Boolean).join(", ");

  return {
    label,
    city,
    state,
    country,
    countryCode,
    lat: coords[1],
    lng: coords[0],
  };
}
