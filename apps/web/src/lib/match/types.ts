export const SEARCH_PURPOSES = ["buy", "rent", "invest", "unknown"] as const;
export type SearchPurpose = (typeof SEARCH_PURPOSES)[number];

export const PROPERTY_TYPES = ["apartment", "house", "land", "commercial"] as const;
export type MatchPropertyType = (typeof PROPERTY_TYPES)[number];

export const PREFERENCE_TYPES = [
  "near_public_transport",
  "parking",
  "balcony",
  "pool",
  "quiet_neighborhood",
  "near_schools",
  "rental_potential",
  "more_space",
  "lower_price",
  "furnished",
  "pets",
] as const;
export type PreferenceType = (typeof PREFERENCE_TYPES)[number];

export const IMPORTANCE_LEVELS = ["high", "medium", "low"] as const;
export type PreferenceImportance = (typeof IMPORTANCE_LEVELS)[number];

export type RangeValue = {
  min?: number;
  max?: number;
};

export type LocationRequirement = {
  city?: string;
  state?: string;
  neighborhood?: string;
  country?: string;
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
  label?: string;
};

export type BudgetRequirement = {
  min?: number;
  max?: number;
  currency: string;
  period?: "total" | "monthly";
};

export type PreferenceItem = {
  type: PreferenceType;
  importance: PreferenceImportance;
};

export type MustHaveItem = {
  type: string;
  value?: string | number | boolean;
};

export type SearchRequirements = {
  purpose: SearchPurpose;
  propertyType?: MatchPropertyType;
  location?: LocationRequirement;
  bedrooms?: RangeValue;
  bathrooms?: RangeValue;
  garage?: RangeValue;
  budget?: BudgetRequirement;
  area?: RangeValue;
  mustHave: MustHaveItem[];
  preferences: PreferenceItem[];
  rawIntent?: string;
};

export const DEFAULT_REQUIREMENTS: SearchRequirements = {
  purpose: "unknown",
  mustHave: [],
  preferences: [],
};

export const DEFAULT_MATCH_WEIGHTS = {
  budget: 25,
  location: 25,
  propertyType: 15,
  bedrooms: 15,
  size: 10,
  preferences: 10,
} as const;

export type MatchDimensionKey =
  | "budget"
  | "location"
  | "propertyType"
  | "bedrooms"
  | "size"
  | "preferences";

export type DimensionRating = "excellent" | "good" | "fair" | "weak" | "unknown";

export type DimensionScore = {
  key: MatchDimensionKey;
  score: number;
  weight: number;
  rating: DimensionRating;
  label: string;
  detail: string;
};

export type MatchBreakdown = {
  dimensions: DimensionScore[];
  totalScore: number;
  matchedCount: number;
  consideredCount: number;
  strongest: MatchDimensionKey[];
};

export type RankedMatch = {
  propertyId: string;
  totalScore: number;
  opportunityScore: number | null;
  breakdown: MatchBreakdown;
  reasons: string[];
};

export type ConversationStatus = "gathering" | "matching" | "complete";

export type MatchMissingField =
  | "purpose"
  | "location"
  | "budget"
  | "bedrooms"
  | "propertyType";

export type FollowUpQuestion = {
  field: MatchMissingField;
  question: string;
  options?: Array<{ id: string; label: string }>;
};

export type MatchMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type MatchSessionDto = {
  sessionId: string;
  status: ConversationStatus;
  locale: string;
  requirements: SearchRequirements;
  missing: MatchMissingField[];
  followUp: FollowUpQuestion | null;
  messages: MatchMessage[];
  resultCount: number | null;
  readyToMatch: boolean;
};

export type MatchResultCard = RankedMatch & {
  property: {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    neighborhood: string;
    state: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image: string;
    transaction?: string;
    type: string;
    garage: number;
    company: string;
  };
};

export type MatchExplainDto = {
  propertyId: string;
  totalScore: number;
  opportunityScore: number | null;
  breakdown: MatchBreakdown;
  reasons: string[];
  insight: string;
  property: MatchResultCard["property"];
  requirements: SearchRequirements;
};

export const PROPERTY_EVENT_TYPES = [
  "property_view",
  "property_save",
  "property_compare",
  "property_contact",
  "property_hide",
] as const;
export type PropertyEventType = (typeof PROPERTY_EVENT_TYPES)[number];
