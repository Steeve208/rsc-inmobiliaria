import { parsePhotonFeature } from "./parse-osm";
import type { ResolvedLocation } from "./types";
import type { MarketConfig } from "@/lib/markets/types";

export async function photonSearch(
  query: string,
  market?: MarketConfig,
): Promise<ResolvedLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const bbox = market?.geocodeBbox?.join(",") ?? "-180,-90,180,90";
  const params = new URLSearchParams({
    q: trimmed,
    lang: market?.geocodeLang ?? "en",
    limit: "8",
    bbox,
  });

  try {
    const res = await fetch(`https://photon.komoot.io/api/?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { features?: unknown[] };
    return (data.features ?? []).map((feature) =>
      parsePhotonFeature(feature as Parameters<typeof parsePhotonFeature>[0]),
    );
  } catch {
    return [];
  }
}
