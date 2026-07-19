/** Client-safe Mapbox public token (`pk.`). */
export function getMapboxToken(): string | undefined {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  return token || undefined;
}

export function hasMapboxToken(): boolean {
  return Boolean(getMapboxToken());
}

export function isValidMapCoord(lng: number, lat: number): boolean {
  return (
    Number.isFinite(lng) &&
    Number.isFinite(lat) &&
    !(lng === 0 && lat === 0) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}
