import { cookies } from "next/headers";
import { parseNominatimResult } from "@/lib/geocoding/parse-osm";
import { getMarketOrDefault, isMarketId } from "@/lib/markets/config";
import { MARKET_COOKIE } from "@/lib/markets/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return Response.json({ error: "missing_coords" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const marketCookie = cookieStore.get(MARKET_COOKIE)?.value;
  const market = getMarketOrDefault(isMarketId(marketCookie) ? marketCookie : null);

  const params = new URLSearchParams({
    lat,
    lon: lng,
    format: "json",
    addressdetails: "1",
    "accept-language": market.geocodeLang,
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "User-Agent": "RSC-Market/1.0 (imoveis geolocation)",
        },
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) {
      return Response.json({ error: "geocode_failed" }, { status: 502 });
    }

    const data = await res.json();
    const location = parseNominatimResult(data);

    if (!location) {
      return Response.json({ error: "no_result" }, { status: 404 });
    }

    return Response.json(location);
  } catch {
    return Response.json({ error: "geocode_failed" }, { status: 502 });
  }
}
