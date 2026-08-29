import { marketList } from "@/lib/markets/config";

const ALIASES: Record<string, string> = {
  brazil: "br",
  brasil: "br",
  usa: "us",
  "u s a": "us",
  "u s": "us",
  "united states": "us",
  "united states of america": "us",
  "estados unidos": "us",
  "estados unidos da america": "us",
  "estados unidos de america": "us",
  eeuu: "us",
  spain: "es",
  espana: "es",
  mexico: "mx",
  portugal: "pt",
  uae: "ae",
  "united arab emirates": "ae",
  "emiratos arabes": "ae",
  "emiratos arabes unidos": "ae",
  "emirados arabes": "ae",
  "emirados arabes unidos": "ae",
  uk: "gb",
  "united kingdom": "gb",
  "reino unido": "gb",
  england: "gb",
  france: "fr",
  francia: "fr",
  germany: "de",
  alemania: "de",
  alemanha: "de",
  italy: "it",
  italia: "it",
  switzerland: "ch",
  suiza: "ch",
  suica: "ch",
  netherlands: "nl",
  holanda: "nl",
  "paises bajos": "nl",
  "paises baixos": "nl",
  colombia: "co",
  chile: "cl",
  peru: "pe",
  uruguay: "uy",
  ecuador: "ec",
  venezuela: "ve",
  bolivia: "bo",
  paraguay: "py",
  canada: "ca",
  argentina: "ar",
  "costa rica": "cr",
  panama: "pa",
  guatemala: "gt",
  "dominican republic": "do",
  "republica dominicana": "do",
  cuba: "cu",
  honduras: "hn",
  "el salvador": "sv",
  nicaragua: "ni",
  jamaica: "jm",
  "puerto rico": "pr",
  "south africa": "za",
  "africa do sul": "za",
  "sudafrica": "za",
  nigeria: "ng",
  kenya: "ke",
  ghana: "gh",
  egypt: "eg",
  egipto: "eg",
  egito: "eg",
  morocco: "ma",
  marruecos: "ma",
  marrocos: "ma",
  angola: "ao",
  mozambique: "mz",
  mocambique: "mz",
  senegal: "sn",
  "saudi arabia": "sa",
  "arabia saudita": "sa",
  "saudi": "sa",
};

function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isoToFlag(iso: string) {
  const code = iso.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(
    ...[...code].map((letter) => 0x1f1e6 - 65 + letter.charCodeAt(0)),
  );
}

const lookup = new Map<string, string>();
const knownIso = new Set<string>();
const nameByIso = new Map<string, string>();

for (const market of marketList) {
  const iso = market.countryCode.toLowerCase();
  knownIso.add(iso);
  lookup.set(fold(market.countryCode), iso);
  lookup.set(fold(market.id), iso);
  lookup.set(fold(market.countryName), iso);
  if (!nameByIso.has(iso)) nameByIso.set(iso, market.countryName);
}

for (const [alias, iso] of Object.entries(ALIASES)) {
  lookup.set(fold(alias), iso);
  knownIso.add(iso);
}

function lookupIso(value: string): string {
  return lookup.get(fold(value)) ?? "";
}

/** ISO-2 country code, or empty when the value cannot be resolved. */
export function resolveCountryCode(value?: string | null): string {
  if (!value?.trim()) return "";
  const trimmed = value.trim();

  if (/^[a-z]{2}$/i.test(trimmed)) {
    const iso = trimmed.toLowerCase();
    return knownIso.has(iso) ? iso : lookupIso(trimmed);
  }

  const direct = lookupIso(trimmed);
  if (direct) return direct;

  const parts = trimmed
    .split(/[,·|/]/)
    .map((part) => part.trim())
    .filter(Boolean);
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index];
    if (!part || part === trimmed) continue;
    const fromPart = resolveCountryCode(part);
    if (fromPart) return fromPart;
  }

  return "";
}

export function countryFlag(value?: string | null) {
  const iso = resolveCountryCode(value);
  return iso ? isoToFlag(iso) : "";
}

export function countryDisplayName(value?: string | null) {
  const iso = resolveCountryCode(value);
  if (iso) return nameByIso.get(iso) ?? value?.trim() ?? "";
  return value?.trim() ?? "";
}

