"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ResolvedLocation } from "@/lib/geocoding/types";

type Theme = "dark" | "light";

type Props = {
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
  onPlaceResolved: (location: ResolvedLocation) => void;
  onLocationCleared: () => void;
  onEnter?: () => void;
  className?: string;
  theme?: Theme;
};

const themeClasses: Record<
  Theme,
  {
    field: string;
    input: string;
    icon: string;
    gpsButton: string;
    dropdown: string;
    suggestion: string;
    error: string;
  }
> = {
  dark: {
    field:
      "bg-white/[0.04] ring-1 ring-white/10 transition-shadow focus-within:ring-[#1d4ed8]/40",
    input: "text-white placeholder:text-white/35",
    icon: "text-[#60a5fa]",
    gpsButton: "text-[#60a5fa] hover:bg-white/10",
    dropdown:
      "bg-[#0a1428]/95 py-1 shadow-2xl shadow-black/40 backdrop-blur-xl",
    suggestion: "text-white/85 hover:bg-white/[0.06]",
    error: "text-red-400",
  },
  light: {
    field: "border-0 bg-transparent",
    input: "text-gray-800 placeholder:text-gray-400",
    icon: "text-gray-400",
    gpsButton: "text-[#D4A62A] hover:bg-gray-100",
    dropdown: "border border-gray-200 bg-white py-1 shadow-lg",
    suggestion: "text-gray-800 hover:bg-gray-50",
    error: "text-red-600",
  },
};

async function reverseGeocode(lat: number, lng: number): Promise<ResolvedLocation | null> {
  const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
  if (!res.ok) return null;
  return res.json() as Promise<ResolvedLocation>;
}

export function LocationAutocomplete({
  value,
  placeholder,
  onValueChange,
  onPlaceResolved,
  onLocationCleared,
  onEnter,
  className,
  theme = "dark",
}: Props) {
  const t = useTranslations("imoveis.location");
  const styles = themeClasses[theme];
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

  const applyResolvedLocation = useCallback(
    (location: ResolvedLocation) => {
      onValueChange(location.label);
      onPlaceResolved(location);
      setSuggestions([]);
      setOpen(false);
      setGpsError(null);
    },
    [onPlaceResolved, onValueChange],
  );

  const handleInputChange = (text: string) => {
    onValueChange(text);
    onLocationCleared();
    setGpsError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 350);
  };

  const selectSuggestion = (location: ResolvedLocation) => {
    applyResolvedLocation(location);
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
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 5000) {
          setGpsError(t("gpsLowAccuracy"));
        }

        try {
          const location = await reverseGeocode(latitude, longitude);
          if (location) {
            applyResolvedLocation({
              ...location,
              lat: latitude,
              lng: longitude,
            });
          } else {
            setGpsError(t("gpsFailed"));
          }
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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

  return (
    <div ref={wrapRef} className={cn("relative min-w-0 flex-1", className)}>
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-xl px-3",
          theme === "light" && "h-auto min-h-[44px] rounded-lg",
          styles.field,
        )}
      >
        <MapPin className={cn("size-4 shrink-0", styles.icon)} strokeWidth={1.75} />
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
          className={cn(
            "w-full min-w-0 bg-transparent text-sm outline-none",
            styles.input,
          )}
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
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-50",
            styles.gpsButton,
          )}
          aria-label={t("useGps")}
        >
          <Navigation className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul
          className={cn(
            "absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-xl",
            styles.dropdown,
          )}
        >
          {suggestions.map((item) => (
            <li key={`${item.lat}-${item.lng}-${item.label}`}>
              <button
                type="button"
                onClick={() => selectSuggestion(item)}
                className={cn(
                  "flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                  styles.suggestion,
                )}
              >
                <MapPin className={cn("mt-0.5 size-3.5 shrink-0", styles.icon)} />
                <span className="line-clamp-2">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {gpsError && (
        <p className={cn("absolute -bottom-5 left-0 text-[11px]", styles.error)}>
          {gpsError}
        </p>
      )}
    </div>
  );
}
