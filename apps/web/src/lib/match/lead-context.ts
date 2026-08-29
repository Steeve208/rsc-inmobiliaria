import type { SearchRequirements } from "./types";

export function formatQualifiedInquiry(input: {
  listingTitle: string;
  matchScore: number;
  requirements: SearchRequirements | string[];
}) {
  const summary = Array.isArray(input.requirements)
    ? input.requirements
    : [
        input.requirements.propertyType,
        input.requirements.bedrooms?.min != null
          ? `${input.requirements.bedrooms.min}+ bedrooms`
          : null,
        input.requirements.budget?.max != null
          ? `budget ≤ ${input.requirements.budget.currency} ${input.requirements.budget.max.toLocaleString()}`
          : null,
        input.requirements.location?.city,
      ].filter(Boolean);

  return [
    "NEW QUALIFIED INQUIRY",
    "",
    `Property: ${input.listingTitle}`,
    `Match: ${input.matchScore}%`,
    "",
    "User requirements:",
    ...summary.map((line) => `- ${line}`),
  ].join("\n");
}

export function formatWhatsAppMatchMessage(input: {
  listingTitle: string;
  matchScore?: number;
  summary?: string[];
}) {
  const lines = [`Hi! I'm interested in ${input.listingTitle}.`];
  if (input.matchScore != null) {
    lines.push(`REESKOVA MATCH: ${input.matchScore}%.`);
  }
  if (input.summary && input.summary.length > 0) {
    lines.push(`Looking for: ${input.summary.join(", ")}.`);
  }
  return lines.join(" ");
}
