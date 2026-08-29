import type { SearchPurpose, SearchRequirements } from "./types";
import { emptyRequirements, searchRequirementsSchema } from "./schemas";
import { photonSearch } from "@/lib/geocoding/photon-search";
import type { MarketConfig } from "@/lib/markets/types";

function mergeArrayUnique<T extends { type: string }>(current: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of current) map.set(item.type, item);
  for (const item of incoming) map.set(item.type, item);
  return [...map.values()];
}

export function mergeRequirements(
  current: SearchRequirements,
  patch: Partial<SearchRequirements>,
): SearchRequirements {
  return {
    purpose: patch.purpose ?? current.purpose,
    propertyType: patch.propertyType ?? current.propertyType,
    location: patch.location
      ? { ...current.location, ...patch.location }
      : current.location,
    bedrooms: patch.bedrooms
      ? { ...current.bedrooms, ...patch.bedrooms }
      : current.bedrooms,
    bathrooms: patch.bathrooms
      ? { ...current.bathrooms, ...patch.bathrooms }
      : current.bathrooms,
    garage: patch.garage ? { ...current.garage, ...patch.garage } : current.garage,
    budget: patch.budget ? { ...current.budget, ...patch.budget } : current.budget,
    area: patch.area ? { ...current.area, ...patch.area } : current.area,
    mustHave: patch.mustHave
      ? mergeArrayUnique(current.mustHave, patch.mustHave)
      : current.mustHave,
    preferences: patch.preferences
      ? mergeArrayUnique(current.preferences, patch.preferences)
      : current.preferences,
    rawIntent: patch.rawIntent ?? current.rawIntent,
  };
}

function rebuildMustHaves(requirements: SearchRequirements): SearchRequirements {
  const mustHave = [...requirements.mustHave];
  const ensure = (type: string, value?: string | number | boolean) => {
    const existing = mustHave.findIndex((item) => item.type === type);
    if (existing >= 0) mustHave[existing] = { type, value };
    else mustHave.push({ type, value });
  };

  if (requirements.purpose !== "unknown") ensure("purpose", requirements.purpose);
  if (requirements.propertyType) ensure("propertyType", requirements.propertyType);
  if (requirements.location?.city) ensure("city", requirements.location.city);
  if (requirements.bedrooms?.min != null) ensure("bedrooms", requirements.bedrooms.min);
  if (requirements.budget?.max != null) ensure("budgetMax", requirements.budget.max);

  return { ...requirements, mustHave };
}

export async function validateAndNormalizeRequirements(
  input: unknown,
  options?: { market?: MarketConfig; geocode?: boolean },
): Promise<SearchRequirements> {
  const parsed = searchRequirementsSchema.safeParse(input);
  const base = parsed.success
    ? (parsed.data as SearchRequirements)
    : emptyRequirements();

  const currency = options?.market?.currency.code ?? base.budget?.currency ?? "BRL";
  let location = base.location;

  if (
    options?.geocode !== false &&
    location?.city &&
    (location.lat == null || location.lng == null)
  ) {
    const query = [location.neighborhood, location.city, location.state]
      .filter(Boolean)
      .join(", ");
    const resolved = await photonSearch(query, options?.market);
    const first = resolved[0];
    if (first) {
      location = {
        ...location,
        city: location.city || first.city,
        state: location.state || first.state,
        neighborhood: location.neighborhood || first.neighborhood,
        country: location.country || first.country,
        lat: first.lat,
        lng: first.lng,
        label: location.label || first.label,
        radiusKm: location.radiusKm ?? 40,
      };
    }
  }

  if (base.budget?.max != null && base.budget.max > 0 && base.budget.max < 500) {
    base.budget.max *= 1000;
  }

  return rebuildMustHaves({
    ...base,
    location,
    budget: base.budget
      ? { ...base.budget, currency: base.budget.currency || currency }
      : base.budget,
  });
}

export function applyPurposeHint(
  requirements: SearchRequirements,
  hint?: SearchPurpose,
): SearchRequirements {
  if (!hint || hint === "unknown") return requirements;
  if (requirements.purpose !== "unknown") return requirements;
  return { ...requirements, purpose: hint };
}

export function applyOptionAnswer(
  requirements: SearchRequirements,
  field: string,
  optionId: string,
): SearchRequirements {
  switch (field) {
    case "purpose":
      if (optionId === "buy" || optionId === "rent" || optionId === "invest") {
        return { ...requirements, purpose: optionId };
      }
      return requirements;
    case "propertyType":
      if (
        optionId === "apartment" ||
        optionId === "house" ||
        optionId === "land" ||
        optionId === "commercial"
      ) {
        return { ...requirements, propertyType: optionId };
      }
      return requirements;
    case "bedrooms": {
      const min = Number(optionId);
      if (Number.isFinite(min) && min >= 0) {
        return { ...requirements, bedrooms: { ...requirements.bedrooms, min } };
      }
      return requirements;
    }
    case "budget": {
      const max = Number(optionId);
      if (Number.isFinite(max) && max > 0) {
        return {
          ...requirements,
          budget: {
            ...requirements.budget,
            max,
            currency: requirements.budget?.currency ?? "BRL",
          },
        };
      }
      return requirements;
    }
    default:
      return requirements;
  }
}
