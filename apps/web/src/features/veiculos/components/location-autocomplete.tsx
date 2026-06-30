"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ResolvedLocation } from "@/lib/geocoding/types";

type Props = {
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  onPlaceResolved: (location: ResolvedLocation) => void;
  onLocationCleared: () => void;
  onEnter?: () => void;
  className?: string;
};

export function LocationAutocomplete({
  value,
  placeholder,
  onValueChange,
  onPlaceResolved,
  onLocationCleared,
  onEnter,
  className,
}: Props) {
  const t = useTranslations("imoveis.location");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ResolvedLocation[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query)}`);
      const data = (await res.json()) as ResolvedLocation[];
      setSuggestions(data);
      setOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleInputChange = (text: string) => {
    onValueChange(text);
    onLocationCleared();
    setGpsError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 350);
  };

  const selectSuggestion = (location: ResolvedLocation) => {
    onValueChange(location.label);
    onPlaceResolved(location);
    setSuggestions([]);
    setOpen(false);
    setGpsError(null);
  };

  const handleGps = () => {
    if (!navigator.geolocation) {
      setGpsError(t("gpsUnsupported"));
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
          );

          if (!res.ok) {
            setGpsError(t("gpsFailed"));
            return;
          }

          const location = (await res.json()) as ResolvedLocation;
          onValueChange(location.label);
          onPlaceResolved(location);
          setOpen(false);
        } catch {
          setGpsError(t("gpsFailed"));
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        setGpsError(t("gpsDenied"));
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  return (
    <div ref={wrapRef} className={cn("relative min-w-0 flex-1", className)}>
      <div className="flex h-11 items-center gap-2 rounded-xl bg-white/[0.04] px-3 ring-1 ring-white/10 transition-shadow focus-within:ring-[#22c55e]/40">
        <MapPin className="size-4 shrink-0 text-[#86efac]" strokeWidth={1.75} />
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setOpen(false);
              onEnter?.();
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
        />
        {(searchLoading || gpsLoading) && (
          <Loader2 className="size-4 shrink-0 animate-spin text-white/40" />
        )}
        <button
          type="button"
          onClick={handleGps}
          disabled={gpsLoading}
          title={t("useGps")}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#86efac] transition-colors hover:bg-white/10 disabled:opacity-50"
          aria-label={t("useGps")}
        >
          <Navigation className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-xl bg-[#0a1428]/95 py-1 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {suggestions.map((item) => (
            <li key={`${item.lat}-${item.lng}-${item.label}`}>
              <button
                type="button"
                onClick={() => selectSuggestion(item)}
                className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm text-white/85 transition-colors hover:bg-white/[0.06]"
              >
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#86efac]" />
                <span className="line-clamp-2">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {gpsError && (
        <p className="absolute -bottom-5 left-0 text-[11px] text-red-400">{gpsError}</p>
      )}
    </div>
  );
}
