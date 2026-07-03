export type ResolvedLocation = {
  label: string;
  city: string;
  state: string;
  neighborhood: string;
  country: string;
  lat: number;
  lng: number;
};

export function buildLocationLabel(parts: {
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}) {
  const locality = [parts.neighborhood, parts.city].filter(Boolean).join(", ");
  const region = [parts.state, parts.country].filter(Boolean).join(", ");

  if (locality && region) return `${locality} · ${region}`;
  return locality || region || "";
}

export function resolvedLocationToFilters(location: ResolvedLocation) {
  return {
    city: location.city,
    state: location.state,
    neighborhood: location.neighborhood,
    country: location.country,
    locationLabel: location.label,
    lat: location.lat,
    lng: location.lng,
  };
}

export function clearLocationFilters() {
  return {
    city: "",
    state: "",
    neighborhood: "",
    locationLabel: "",
    lat: null as number | null,
    lng: null as number | null,
  };
}
