import { cookies } from "next/headers";
import type { ResolvedLocation } from "@/lib/geocoding/types";
import { photonSearch } from "@/lib/geocoding/photon-search";
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

  try {
    return Response.json(await photonSearch(q, market));
  } catch {
    return Response.json([]);
  }
}
