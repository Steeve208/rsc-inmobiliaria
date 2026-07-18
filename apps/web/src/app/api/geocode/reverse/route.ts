import { cookies } from "next/headers";
import {
  parseNominatimResult,
  parsePhotonFeature,
} from "@/lib/geocoding/parse-osm";
import { getMarketOrDefault, isMarketId } from "@/lib/markets/config";
import { MARKET_COOKIE } from "@/lib/markets/constants";
import { enforceRateLimit } from "@/lib/security/rate-limit";

async function reverseWithPhoton(lat: number, lng: number) {
  const res = await fetch(
    `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`,
    { cache: "no-store" },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as { features?: unknown[] };
  const feature = data.features?.[0];
  if (!feature) return null;

  return parsePhotonFeature(
    feature as Parameters<typeof parsePhotonFeature>[0],
    { lat, lng },
  );
}

async function reverseWithNominatim(
  lat: number,
  lng: number,
  acceptLanguage: string,
) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "json",
    addressdetails: "1",
    zoom: "16",
    "accept-language": acceptLanguage,
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    {
      headers: {
        "User-Agent": "RSC-Market/1.0 (imoveis geolocation)",
      },
      cache: "no-store",
    },
  );

  if (!res.ok) return null;

  const data = await res.json();
  return parseNominatimResult(data, { lat, lng });
}

export async function GET(request: Request) {
  const limited = enforceRateLimit(request, "geocode-reverse", 60, 60_000);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return Response.json({ error: "missing_coords" }, { status: 400 });
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return Response.json({ error: "invalid_coords" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const marketCookie = cookieStore.get(MARKET_COOKIE)?.value;
  const market = getMarketOrDefault(isMarketId(marketCookie) ? marketCookie : null);

  try {
    const location =
      (await reverseWithPhoton(latitude, longitude)) ??
      (await reverseWithNominatim(latitude, longitude, market.geocodeLang));

    if (!location) {
      return Response.json({ error: "no_result" }, { status: 404 });
    }

    return Response.json(location);
  } catch {
    return Response.json({ error: "geocode_failed" }, { status: 502 });
  }
}
