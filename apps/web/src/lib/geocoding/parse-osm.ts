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
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: NominatimAddress;
}): ResolvedLocation | null {
  if (!data.lat || !data.lon || !data.address) return null;

  const addr = data.address;
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.county ||
    "";
  const neighborhood =
    addr.suburb || addr.neighbourhood || addr.quarter || "";
  const state = normalizeState(addr.state ?? "");
  const country = normalizeCountry(addr.country_code ?? "", addr.country ?? "");

  return {
    label: data.display_name ?? city,
    city,
    state,
    neighborhood,
    country,
    lat: Number(data.lat),
    lng: Number(data.lon),
  };
}

type PhotonFeature = {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    district?: string;
    locality?: string;
    street?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

export function parsePhotonFeature(feature: PhotonFeature): ResolvedLocation {
  const { properties: p, geometry } = feature;
  const [lng, lat] = geometry.coordinates;

  const city = p.city || p.locality || p.name || "";
  const neighborhood = p.district || "";
  const state = normalizeState(p.state ?? "");
  const country = normalizeCountry(p.countrycode ?? "", p.country ?? "");

  const parts = [p.name, city, state, country].filter(Boolean);
  const label = [...new Set(parts)].join(", ");

  return {
    label: label || city,
    city: city || p.name || "",
    state,
    neighborhood,
    country,
    lat,
    lng,
  };
}
