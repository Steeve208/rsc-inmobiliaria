export const LEGAL_SLUGS = [
  "privacy",
  "terms",
  "cookies",
  "compliance",
  "about",
  "careers",
  "guides",
  "security",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}
