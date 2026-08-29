import type { SearchRequirements } from "@/lib/match/types";

export const EXTRACT_INTENT_SYSTEM = `You extract structured real-estate search requirements from a conversation.
Return JSON only. Do not invent cities, prices, or features the user did not mention.
If a value is unknown, omit it. "two" in context of housing means 2 bedrooms.
purpose must be one of: buy, rent, invest, unknown.
propertyType must be one of: apartment, house, land, commercial.
preferences.type must be one of: near_public_transport, parking, balcony, pool, quiet_neighborhood, near_schools, rental_potential, more_space, lower_price, furnished, pets.
budget.period is "monthly" only for rent language (per month / mensal / aluguel). Purchase prices use "total".
Normalize numbers: 500k / 500 mil = 500000.`;

export function extractIntentUserPrompt(input: {
  messages: Array<{ role: string; content: string }>;
  current: SearchRequirements;
  locale: string;
}) {
  return JSON.stringify({
    locale: input.locale,
    currentRequirements: input.current,
    conversation: input.messages.slice(-12),
    schema: {
      purpose: "buy|rent|invest|unknown",
      propertyType: "apartment|house|land|commercial",
      location: { city: "", state: "", neighborhood: "", country: "" },
      bedrooms: { min: 0 },
      bathrooms: { min: 0 },
      budget: { min: 0, max: 0, currency: "BRL", period: "total|monthly" },
      area: { min: 0 },
      preferences: [{ type: "near_public_transport", importance: "high" }],
    },
  });
}

export const GROUNDED_RULES = `You may only use the facts provided. Never invent prices, scores, distances, fees, or amenities.
If a fact is missing, say you do not have enough information to determine that.
Do not mention the model or provider. Speak as REESKOVA.`;
