export type ResolvedLocation = {
  label: string;
  city: string;
  state: string;
  neighborhood: string;
  country: string;
  lat: number;
  lng: number;
};

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
