"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

type MapboxMapProps = {
  className?: string;
};

export function MapboxMap({ className }: MapboxMapProps) {
  const t = useTranslations("map");
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-3.7038, 40.4168],
      zoom: 2.2,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    const markers: [number, number][] = [
      [-74.006, 40.7128],
      [-0.1276, 51.5072],
      [2.3522, 48.8566],
      [-46.6333, -23.5505],
      [139.6917, 35.6895],
    ];

    markers.forEach(([lng, lat]) => {
      new mapboxgl.Marker({ color: "#171717" })
        .setLngLat([lng, lat])
        .addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  if (!token) {
    return (
      <div
        className={`flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center ${className ?? ""}`}
      >
        <MapPin className="size-8 text-muted-foreground" />
        <p className="max-w-sm text-sm text-muted-foreground">{t("noToken")}</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`min-h-[360px] overflow-hidden rounded-xl border border-border ${className ?? ""}`}
    />
  );
}
