import { brazilStates } from "@/lib/listings/regions";
import { markets } from "@/lib/markets/config";
import { buildLocationLabel } from "./types";
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

export function parseNominatimResult(
  data: {
    display_name?: string;
    lat?: string;
    lon?: string;
    address?: NominatimAddress;
  },
  coords?: { lat: number; lng: number },
): ResolvedLocation | null {
  if (!data.address) return null;

  const addr = data.address;
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    "";
  const neighborhood =
    addr.suburb || addr.neighbourhood || addr.quarter || "";
  const state = normalizeState(addr.state ?? "");
  const country = normalizeCountry(addr.country_code ?? "", addr.country ?? "");
  const lat = coords?.lat ?? Number(data.lat ?? 0);
  const lng = coords?.lng ?? Number(data.lon ?? 0);

  if (!coords && (!data.lat || !data.lon)) return null;

  return {
    label: buildLocationLabel({ neighborhood, city, state, country }),
    city,
    state,
    neighborhood,
    country,
    lat,
    lng,
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

export function parsePhotonFeature(
  feature: PhotonFeature,
  coords?: { lat: number; lng: number },
): ResolvedLocation {
  const { properties: p, geometry } = feature;
  const [lng, lat] = geometry.coordinates;

  const city = p.city || p.locality || p.name || "";
  const neighborhood = p.district || "";
  const state = normalizeState(p.state ?? "");
  const country = normalizeCountry(p.countrycode ?? "", p.country ?? "");

  return {
    label: buildLocationLabel({ neighborhood, city, state, country }),
    city: city || p.name || "",
    state,
    neighborhood,
    country,
    lat: coords?.lat ?? lat,
    lng: coords?.lng ?? lng,
  };
}
