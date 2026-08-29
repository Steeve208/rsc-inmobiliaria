export const COMPANY_ACCOUNT_TYPES = [
  "real_estate",
  "project",
  "automotive",
] as const;

export type CompanyAccountType = (typeof COMPANY_ACCOUNT_TYPES)[number];

const BUILDER_ALIASES = new Set([
  "project",
  "projects",
  "builder",
  "developer",
  "constructora",
  "construtora",
  "desenvolvedora",
]);

const DEALERSHIP_ALIASES = new Set([
  "automotive",
  "dealership",
  "concesionaria",
  "concessionaria",
]);

export function normalizeCompanyCategory(value: string | null | undefined): CompanyAccountType {
  const kind = String(value ?? "")
    .trim()
    .toLowerCase();
  if (BUILDER_ALIASES.has(kind)) return "project";
  if (DEALERSHIP_ALIASES.has(kind)) return "automotive";
  return "real_estate";
}

export function isCompanyAccountType(value: string): value is CompanyAccountType {
  return (COMPANY_ACCOUNT_TYPES as readonly string[]).includes(value);
}
