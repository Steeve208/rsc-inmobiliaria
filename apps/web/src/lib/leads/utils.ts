import type { CompanyLeadConfig } from "./types";

export function slugifyCompanyId(companyName: string) {
  return companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getDefaultCompanyConfig(
  _companyId: string,
): CompanyLeadConfig | undefined {
  return undefined;
}
