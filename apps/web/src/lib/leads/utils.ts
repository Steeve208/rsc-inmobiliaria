import type { CompanyLeadConfig } from "./types";

export const DEFAULT_COMPANY_CONFIGS: Record<string, CompanyLeadConfig> = {
  "rsc-imoveis": {
    companyId: "rsc-imoveis",
    companyName: "RSC Imóveis",
    whatsappNumber: "5554999887766",
  },
  "premium-estate": {
    companyId: "premium-estate",
    companyName: "Premium Estate",
    whatsappNumber: "5554999112233",
  },
  "construtora-sul": {
    companyId: "construtora-sul",
    companyName: "Construtora Sul",
    whatsappNumber: "5554999445566",
  },
};

export function slugifyCompanyId(companyName: string) {
  return companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getDefaultCompanyConfig(companyId: string) {
  return DEFAULT_COMPANY_CONFIGS[companyId];
}
