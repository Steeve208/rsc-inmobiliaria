import { parseNominatimResult } from "@/lib/geocoding/parse-osm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return Response.json({ error: "missing_coords" }, { status: 400 });
  }

  const params = new URLSearchParams({
    lat,
    lon: lng,
    format: "json",
    addressdetails: "1",
    "accept-language": "pt",
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
