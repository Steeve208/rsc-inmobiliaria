const CODE_PREFIX = "COD";
const CODE_DIGITS = 5;
const KIND_BLOCK = 10_000;

export type ListingCodeKind =
  | "property"
  | "vehicle"
  | "project"
  | "business"
  | "service";

const KIND_OFFSET: Record<ListingCodeKind, number> = {
  property: 0,
  vehicle: KIND_BLOCK,
  project: KIND_BLOCK * 2,
  business: KIND_BLOCK * 3,
  service: KIND_BLOCK * 4,
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function pad(digits: string) {
  const trimmed = digits.slice(-CODE_DIGITS);
  return trimmed.padStart(CODE_DIGITS, "0");
}

function hashIndex(id: string) {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % KIND_BLOCK;
}

function localIndex(id: string, explicitDigits: string, kind?: ListingCodeKind) {
  if (explicitDigits) {
    const parsed = Number(explicitDigits.slice(-4));
    if (Number.isFinite(parsed)) return parsed % KIND_BLOCK;
  }

  const short = id.trim().match(/^(?:pj|p|v|b|s)(\d{1,4})$/i);
  if (short?.[1]) return Number(short[1]) % KIND_BLOCK;

  return hashIndex(`${kind ?? ""}:${id}`);
}

export function listingCodeValue(
  id: string,
  explicit?: string | null,
  kind?: ListingCodeKind,
) {
  const fromExplicit = digitsOnly(explicit ?? "");
  if (!kind && fromExplicit) return pad(fromExplicit);

  const offset = kind ? KIND_OFFSET[kind] : 0;
  return pad(String(offset + localIndex(id, fromExplicit, kind)));
}

export function listingCodeKindFrom(
  value?: string | null,
): ListingCodeKind | undefined {
  switch (value) {
    case "property":
    case "properties":
      return "property";
    case "vehicle":
    case "vehicles":
      return "vehicle";
    case "project":
    case "projects":
    case "launches":
      return "project";
    case "business":
    case "businesses":
      return "business";
    case "service":
    case "services":
      return "service";
    default:
      return undefined;
  }
}

export function formatListingCode(
  id: string,
  explicit?: string | null,
  kind?: ListingCodeKind,
) {
  return `${CODE_PREFIX}-${listingCodeValue(id, explicit, kind)}`;
}

export function isListingCodeQuery(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return false;
  if (/^cod[\s-]*/i.test(trimmed)) {
    return digitsOnly(trimmed).length > 0;
  }
  const compact = trimmed.replace(/\s/g, "");
  const digits = digitsOnly(compact);
  return /^\d+$/.test(compact) && digits.length >= 3 && digits.length <= 8;
}

export function matchesListingCode(
  item: { id: string; code?: string | null },
  query: string,
  kind?: ListingCodeKind,
) {
  const digits = digitsOnly(query);
  if (!digits) return false;
  return listingCodeValue(item.id, item.code, kind) === pad(digits);
}
