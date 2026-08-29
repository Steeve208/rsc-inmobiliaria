import { haversineKm } from "@/lib/geocoding/geo-utils";
import type { PropertyListing } from "@/features/imoveis/types";
import {
  DEFAULT_MATCH_WEIGHTS,
  type DimensionRating,
  type DimensionScore,
  type MatchBreakdown,
  type MatchDimensionKey,
  type PreferenceItem,
  type RankedMatch,
  type SearchRequirements,
} from "./types";
import type { MatchScoringWeights } from "@/lib/db/schema";

const TOP_MATCH_LIMIT = 24;
const MIN_DISPLAY_SCORE = 55;

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function ratingFor(score: number, unknown = false): DimensionRating {
  if (unknown) return "unknown";
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 50) return "fair";
  return "weak";
}

function normalizeWeights(raw?: MatchScoringWeights | null): MatchScoringWeights {
  const source = raw ?? DEFAULT_MATCH_WEIGHTS;
  const total =
    source.budget +
    source.location +
    source.propertyType +
    source.bedrooms +
    source.size +
    source.preferences;
  if (total <= 0) return { ...DEFAULT_MATCH_WEIGHTS };
  if (total === 100) return source;
  const scale = 100 / total;
  return {
    budget: source.budget * scale,
    location: source.location * scale,
    propertyType: source.propertyType * scale,
    bedrooms: source.bedrooms * scale,
    size: source.size * scale,
    preferences: source.preferences * scale,
  };
}

function cityMatch(a?: string, b?: string) {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase() ||
    a.toLowerCase().includes(b.toLowerCase()) ||
    b.toLowerCase().includes(a.toLowerCase());
}

function mapPropertyType(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("apart")) return "apartment";
  if (lower.includes("house") || lower.includes("casa")) return "house";
  if (lower.includes("land") || lower.includes("terreno")) return "land";
  if (lower.includes("commercial") || lower.includes("comercial")) return "commercial";
  return lower;
}

export function passesHardFilters(
  property: PropertyListing,
  requirements: SearchRequirements,
): boolean {
  const { purpose, propertyType, location, bedrooms, bathrooms, garage, budget } =
    requirements;

  if (purpose === "buy" && property.transaction && property.transaction !== "buy") {
    return false;
  }
  if (purpose === "rent" && property.transaction && property.transaction !== "rent") {
    return false;
  }
  if (purpose === "invest" && property.transaction === "rent") {
    return false;
  }

  if (propertyType && mapPropertyType(property.type) !== propertyType) {
    return false;
  }

  if (bedrooms?.min != null && property.bedrooms < bedrooms.min) {
    return false;
  }
  if (bathrooms?.min != null && (property.bathrooms ?? 0) < bathrooms.min) {
    return false;
  }
  if (garage?.min != null && property.garage < garage.min) {
    return false;
  }

  const hardBudget =
    budget?.max != null &&
    (budget.period !== "monthly" || purpose === "rent" || property.transaction === "rent");
  if (hardBudget && property.price > (budget?.max ?? Number.POSITIVE_INFINITY)) {
    return false;
  }

  if (location?.lat != null && location.lng != null && property.lat && property.lng) {
    const radius = location.radiusKm ?? 40;
    if (haversineKm(location.lat, location.lng, property.lat, property.lng) > radius) {
      return false;
    }
  } else if (location?.city && !cityMatch(property.city, location.city)) {
    return false;
  } else if (
    !location?.city &&
    location?.state &&
    property.state &&
    property.state.toLowerCase() !== location.state.toLowerCase()
  ) {
    return false;
  }

  if (
    location?.neighborhood &&
    property.neighborhood &&
    !cityMatch(property.neighborhood, location.neighborhood)
  ) {
    return false;
  }

  return true;
}

function scoreBudget(property: PropertyListing, requirements: SearchRequirements) {
  const budget = requirements.budget;
  if (budget?.max == null && budget?.min == null) {
    return { score: 70, unknown: true, detail: "No budget was specified." };
  }
  const max = budget.max;
  const min = budget.min ?? 0;
  const price = property.price;
  if (max != null && price > max) {
    const over = (price - max) / max;
    return {
      score: clamp(70 - over * 140),
      unknown: false,
      detail: "Above the stated budget.",
    };
  }
  if (max != null && price <= max) {
    const headroom = (max - price) / max;
    return {
      score: clamp(88 + headroom * 20),
      unknown: false,
      detail: "Within your stated budget.",
    };
  }
  if (price >= min) {
    return { score: 85, unknown: false, detail: "Meets the minimum budget range." };
  }
  return { score: 60, unknown: false, detail: "Below the preferred budget range." };
}

function scoreLocation(property: PropertyListing, requirements: SearchRequirements) {
  const location = requirements.location;
  if (!location?.city && !location?.neighborhood && location?.lat == null) {
    return { score: 70, unknown: true, detail: "No preferred location was specified." };
  }
  if (location.lat != null && location.lng != null && property.lat && property.lng) {
    const distance = haversineKm(location.lat, location.lng, property.lat, property.lng);
    const radius = location.radiusKm ?? 40;
    if (distance <= 3) {
      return { score: 100, unknown: false, detail: "Located in your preferred area." };
    }
    if (distance <= radius * 0.4) {
      return { score: 95, unknown: false, detail: "Located in your preferred area." };
    }
    if (distance <= radius) {
      return { score: clamp(90 - (distance / radius) * 20), unknown: false, detail: "Nearby your preferred area." };
    }
    return { score: 40, unknown: false, detail: "Outside the preferred radius." };
  }
  if (location.neighborhood && cityMatch(property.neighborhood, location.neighborhood)) {
    return { score: 100, unknown: false, detail: "Located in your preferred neighborhood." };
  }
  if (location.city && cityMatch(property.city, location.city)) {
    return { score: 92, unknown: false, detail: "Located in your preferred city." };
  }
  return { score: 35, unknown: false, detail: "Outside your preferred location." };
}

function scorePropertyType(property: PropertyListing, requirements: SearchRequirements) {
  if (!requirements.propertyType) {
    return { score: 70, unknown: true, detail: "No property type was specified." };
  }
  if (mapPropertyType(property.type) === requirements.propertyType) {
    return { score: 100, unknown: false, detail: "Matches the requested property type." };
  }
  return { score: 20, unknown: false, detail: "Different property type." };
}

function scoreBedrooms(property: PropertyListing, requirements: SearchRequirements) {
  const min = requirements.bedrooms?.min;
  if (min == null) {
    return { score: 70, unknown: true, detail: "No bedroom requirement was specified." };
  }
  if (property.bedrooms >= min + 1) {
    return { score: 100, unknown: false, detail: `Exceeds the ${min}+ bedroom requirement.` };
  }
  if (property.bedrooms >= min) {
    return { score: 100, unknown: false, detail: `Matches your requirement for ${min}+ bedrooms.` };
  }
  return {
    score: clamp(40 - (min - property.bedrooms) * 20),
    unknown: false,
    detail: "Fewer bedrooms than requested.",
  };
}

function scoreSize(property: PropertyListing, requirements: SearchRequirements) {
  const min = requirements.area?.min;
  if (min == null) {
    if (property.area > 0) {
      return { score: 75, unknown: true, detail: "No preferred size was specified." };
    }
    return { score: 70, unknown: true, detail: "Size was not specified." };
  }
  if (property.area <= 0) {
    return { score: 50, unknown: true, detail: "Property size is not available." };
  }
  if (property.area >= min) {
    const extra = (property.area - min) / min;
    return {
      score: clamp(90 + extra * 10),
      unknown: false,
      detail: "Meets the preferred size.",
    };
  }
  const gap = (min - property.area) / min;
  return {
    score: clamp(80 - gap * 80),
    unknown: false,
    detail: "Slightly below your preferred size.",
  };
}

function preferenceHit(property: PropertyListing, item: PreferenceItem): number | null {
  switch (item.type) {
    case "parking":
      return property.garage > 0 ? 100 : 20;
    case "pool":
      return property.pool ? 100 : 25;
    case "more_space":
      return property.area >= 90 ? 90 : property.area >= 60 ? 70 : 45;
    case "lower_price":
      return 70;
    case "rental_potential":
      return property.financing || property.type === "apartment" ? 75 : 55;
    case "near_public_transport":
    case "balcony":
    case "quiet_neighborhood":
    case "near_schools":
    case "furnished":
    case "pets":
      return null;
    default:
      return null;
  }
}

function scorePreferences(property: PropertyListing, requirements: SearchRequirements) {
  const prefs = requirements.preferences;
  if (prefs.length === 0) {
    return { score: 70, unknown: true, detail: "No lifestyle preferences were specified." };
  }
  const weights: Record<string, number> = { high: 3, medium: 2, low: 1 };
  let weighted = 0;
  let total = 0;
  let known = 0;
  for (const pref of prefs) {
    const hit = preferenceHit(property, pref);
    const w = weights[pref.importance] ?? 2;
    total += w;
    if (hit == null) {
      weighted += 50 * w;
    } else {
      weighted += hit * w;
      known += 1;
    }
  }
  const score = total === 0 ? 70 : weighted / total;
  return {
    score: clamp(score),
    unknown: known === 0,
    detail:
      known === 0
        ? "Not enough listing data to score some preferences."
        : "Matches several of your stated preferences.",
  };
}

const DIMENSION_LABELS: Record<MatchDimensionKey, string> = {
  budget: "Budget",
  location: "Location",
  propertyType: "Property type",
  bedrooms: "Bedrooms",
  size: "Size",
  preferences: "Preferences",
};

function dimension(
  key: MatchDimensionKey,
  weight: number,
  result: { score: number; unknown: boolean; detail: string },
): DimensionScore {
  return {
    key,
    score: result.score,
    weight,
    rating: ratingFor(result.score, result.unknown),
    label: DIMENSION_LABELS[key],
    detail: result.detail,
  };
}

export function scoreProperty(
  property: PropertyListing,
  requirements: SearchRequirements,
  weightsInput?: MatchScoringWeights | null,
): RankedMatch {
  const weights = normalizeWeights(weightsInput);
  const dimensions: DimensionScore[] = [
    dimension("budget", weights.budget, scoreBudget(property, requirements)),
    dimension("location", weights.location, scoreLocation(property, requirements)),
    dimension("propertyType", weights.propertyType, scorePropertyType(property, requirements)),
    dimension("bedrooms", weights.bedrooms, scoreBedrooms(property, requirements)),
    dimension("size", weights.size, scoreSize(property, requirements)),
    dimension("preferences", weights.preferences, scorePreferences(property, requirements)),
  ];

  const totalScore = clamp(
    dimensions.reduce((sum, item) => sum + (item.score * item.weight) / 100, 0),
  );

  const considered = dimensions.filter((item) => item.rating !== "unknown");
  const matched = considered.filter((item) => item.score >= 75);
  const strongest = [...considered]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.key);

  const breakdown: MatchBreakdown = {
    dimensions,
    totalScore,
    matchedCount: matched.length,
    consideredCount: considered.length || dimensions.length,
    strongest,
  };

  const reasons = dimensions
    .filter((item) => item.score >= 75 && item.rating !== "unknown")
    .slice(0, 4)
    .map((item) => item.detail);

  return {
    propertyId: property.id,
    totalScore,
    opportunityScore: null,
    breakdown,
    reasons,
  };
}

export function rankMatches(
  listings: PropertyListing[],
  requirements: SearchRequirements,
  weights?: MatchScoringWeights | null,
): RankedMatch[] {
  const eligible = listings.filter((item) => passesHardFilters(item, requirements));
  const scored = eligible.map((item) => scoreProperty(item, requirements, weights));
  scored.sort((a, b) => b.totalScore - a.totalScore);
  return scored.filter((item) => item.totalScore >= MIN_DISPLAY_SCORE).slice(0, TOP_MATCH_LIMIT);
}

export function buildInsight(breakdown: MatchBreakdown): string {
  const strongest = breakdown.strongest
    .map((key) => DIMENSION_LABELS[key]?.toLowerCase())
    .filter(Boolean);
  const advantages =
    strongest.length > 0
      ? `Its strongest advantages are ${formatList(strongest)}.`
      : "Review the breakdown below to see how it compares.";
  return `This property matches ${breakdown.matchedCount} of your ${breakdown.consideredCount} main requirements. ${advantages}`;
}

function formatList(items: string[]) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
