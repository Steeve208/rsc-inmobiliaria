import { cookies } from "next/headers";
import { parsePhotonFeature } from "@/lib/geocoding/parse-osm";
import type { ResolvedLocation } from "@/lib/geocoding/types";
import { getMarketOrDefault, isMarketId } from "@/lib/markets/config";
import { MARKET_COOKIE } from "@/lib/markets/constants";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  const limited = await enforceRateLimit(request, "geocode-search", 60, 60_000);
  if (limited) return limited;

  const q = new URL(request.url).searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return Response.json([] satisfies ResolvedLocation[]);
  }

  const cookieStore = await cookies();
  const marketCookie = cookieStore.get(MARKET_COOKIE)?.value;
  const market = getMarketOrDefault(isMarketId(marketCookie) ? marketCookie : null);
  const bbox = market.geocodeBbox?.join(",") ?? "-180,-90,180,90";

  const params = new URLSearchParams({
    q,
    lang: market.geocodeLang,
    limit: "8",
    bbox,
  });

  try {
    const res = await fetch(`https://photon.komoot.io/api/?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json([]);
    }

    const data = (await res.json()) as { features?: unknown[] };
    const results = (data.features ?? []).map((feature) =>
      parsePhotonFeature(feature as Parameters<typeof parsePhotonFeature>[0]),
    );

    return Response.json(results);
  } catch {
    return Response.json([]);
  }
}
