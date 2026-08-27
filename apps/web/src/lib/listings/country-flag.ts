import { marketList } from "@/lib/markets/config";

const ALIASES: Record<string, string> = {
  brazil: "br",
  brasil: "br",
  usa: "us",
  "united states": "us",
  "united states of america": "us",
  "estados unidos": "us",
  eeuu: "us",
  spain: "es",
  espana: "es",
  mexico: "mx",
  portugal: "pt",
  uae: "ae",
  "united arab emirates": "ae",
  "emiratos arabes unidos": "ae",
  uk: "gb",
  "united kingdom": "gb",
  "reino unido": "gb",
  england: "gb",
  france: "fr",
  francia: "fr",
  germany: "de",
  alemania: "de",
  italy: "it",
  italia: "it",
  switzerland: "ch",
  suiza: "ch",
  netherlands: "nl",
  holanda: "nl",
  "paises bajos": "nl",
  colombia: "co",
  chile: "cl",
  peru: "pe",
  uruguay: "uy",
  ecuador: "ec",
  venezuela: "ve",
  bolivia: "bo",
  paraguay: "py",
  canada: "ca",
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

for (const market of marketList) {
  lookup.set(fold(market.countryCode), market.countryCode);
  lookup.set(fold(market.id), market.countryCode);
  lookup.set(fold(market.countryName), market.countryCode);
}

for (const [alias, iso] of Object.entries(ALIASES)) {
  lookup.set(fold(alias), iso);
}

export function countryFlag(value?: string | null) {
  if (!value?.trim()) return "";
  const trimmed = value.trim();
  if (/^[a-z]{2}$/i.test(trimmed)) return isoToFlag(trimmed);

  const direct = lookup.get(fold(trimmed));
  if (direct) return isoToFlag(direct);

  const parts = trimmed.split(/[,·|]/).map((part) => part.trim()).filter(Boolean);
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index];
    if (!part || part === trimmed) continue;
    const fromPart = countryFlag(part);
    if (fromPart) return fromPart;
  }

  return "";
}
