import type { ImoveisFilters } from "@/features/imoveis/types";
import type { VeiculosFilters } from "@/features/veiculos/types";

const PROPERTY_KEYWORDS: Record<string, Partial<ImoveisFilters>> = {
  moderna: { type: "house" },
  casa: { type: "house" },
  apartamento: { type: "apartment" },
  terreno: { type: "land" },
  lago: { query: "lago" },
  piscina: { pool: true },
};

const VEHICLE_KEYWORDS: Record<string, Partial<VeiculosFilters>> = {
  suv: { type: "suv" },
  carro: { type: "car" },
  car: { type: "car" },
  moto: { type: "motorcycle" },
  caminhão: { type: "truck" },
  caminhao: { type: "truck" },
  elétrico: { type: "electric" },
  eletrico: { type: "electric" },
};

function parsePriceHints<T extends { priceMax?: string; query?: string }>(
  query: string,
  result: T,
) {
  const lower = query.toLowerCase();
  const priceMatch = lower.match(/r?\$?\s*([\d.]+)/);

  if (priceMatch) {
    const num = Number(priceMatch[1].replace(/\./g, ""));
    if (num > 0) result.priceMax = String(num);
  }

  if (lower.includes("menos de") || lower.includes("até") || lower.includes("ate")) {
    const match = lower.match(/(?:menos de|até|ate)\s*r?\$?\s*([\d.]+)/);
    if (match) result.priceMax = String(Number(match[1].replace(/\./g, "")));
  }
}

export function parsePropertyAiQuery(query: string): Partial<ImoveisFilters> {
  const lower = query.toLowerCase();
  const result: Partial<ImoveisFilters> = { query };

  parsePriceHints(query, result);

  for (const [keyword, filters] of Object.entries(PROPERTY_KEYWORDS)) {
    if (lower.includes(keyword)) Object.assign(result, filters);
  }

  return result;
}

export function parseVehicleAiQuery(query: string): Partial<VeiculosFilters> {
  const lower = query.toLowerCase();
  const result: Partial<VeiculosFilters> = { query };

  parsePriceHints(query, result);

  for (const [keyword, filters] of Object.entries(VEHICLE_KEYWORDS)) {
    if (lower.includes(keyword)) Object.assign(result, filters);
  }

  return result;
}
