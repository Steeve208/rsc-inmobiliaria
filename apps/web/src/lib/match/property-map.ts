import type { PropertyDetail, PropertyListing } from "@/features/imoveis/types";
import type { PropertyFacts } from "@/lib/ai/providers/types";
import type { MatchResultCard } from "./types";

export function toMatchPropertyCard(property: PropertyListing): MatchResultCard["property"] {
  return {
    id: property.id,
    title: property.title,
    price: property.price,
    currency: property.currency,
    city: property.city,
    neighborhood: property.neighborhood,
    state: property.state,
    country: property.country,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms ?? 0,
    area: property.area,
    image: property.image,
    transaction: property.transaction,
    type: property.type,
    garage: property.garage,
    company: property.company,
  };
}

export function toPropertyFacts(
  property: PropertyListing | PropertyDetail,
): PropertyFacts {
  const detail = property as PropertyDetail;
  return {
    title: property.title,
    price: property.price,
    currency: property.currency,
    city: property.city,
    neighborhood: property.neighborhood,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms ?? 0,
    area: property.area,
    type: property.type,
    garage: property.garage,
    pool: property.pool,
    condoFee: detail.condoFee,
    iptu: detail.iptu,
    description: detail.description,
    transaction: property.transaction,
  };
}

export function estimateAffordability(property: PropertyDetail | PropertyListing) {
  const detail = property as PropertyDetail;
  const price = property.price;
  const downPct = 20;
  const downPayment = Math.round(price * (downPct / 100));
  const termMonths = 360;
  const monthlyRate = 0.89 / 100;
  const principal = price - downPayment;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  const financing =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * factor) / (factor - 1);
  const condo = detail.condoFee ?? 0;
  const iptuMonthly = detail.iptu ? detail.iptu / 12 : 0;
  return {
    price,
    currency: property.currency,
    downPayment,
    downPct,
    financing: Math.round(financing),
    condoFee: condo,
    iptuMonthly: Math.round(iptuMonthly),
    monthlyCost: Math.round(financing + condo + iptuMonthly),
  };
}
