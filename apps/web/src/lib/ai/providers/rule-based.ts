import type { PreferenceType, SearchPurpose, SearchRequirements } from "@/lib/match/types";
import { emptyRequirements } from "@/lib/match/schemas";
import type {
  AIProvider,
  CompareInput,
  ExplainMatchInput,
  ExtractIntentInput,
  PropertyQuestionInput,
} from "./types";

const TYPE_KEYWORDS: Array<[string, SearchRequirements["propertyType"]]> = [
  ["apartamento", "apartment"],
  ["apartment", "apartment"],
  ["apto", "apartment"],
  ["flat", "apartment"],
  ["casa", "house"],
  ["house", "house"],
  ["home", "house"],
  ["terreno", "land"],
  ["land", "land"],
  ["lote", "land"],
  ["comercial", "commercial"],
  ["commercial", "commercial"],
];

const PURPOSE_KEYWORDS: Array<[string, SearchPurpose]> = [
  ["alugar", "rent"],
  ["aluguel", "rent"],
  ["rent", "rent"],
  ["mensal", "rent"],
  ["investir", "invest"],
  ["investment", "invest"],
  ["rental potential", "invest"],
  ["comprar", "buy"],
  ["buy", "buy"],
  ["purchase", "buy"],
];

const PREFERENCE_KEYWORDS: Array<[string, PreferenceType]> = [
  ["subway", "near_public_transport"],
  ["metro", "near_public_transport"],
  ["metrô", "near_public_transport"],
  ["transport", "near_public_transport"],
  ["parking", "parking"],
  ["garagem", "parking"],
  ["garage", "parking"],
  ["vaga", "parking"],
  ["balcony", "balcony"],
  ["varanda", "balcony"],
  ["sacada", "balcony"],
  ["piscina", "pool"],
  ["pool", "pool"],
  ["quiet", "quiet_neighborhood"],
  ["silencioso", "quiet_neighborhood"],
  ["tranquilo", "quiet_neighborhood"],
  ["school", "near_schools"],
  ["escola", "near_schools"],
  ["escolas", "near_schools"],
  ["rental", "rental_potential"],
  ["furnished", "furnished"],
  ["mobiliado", "furnished"],
  ["pet", "pets"],
];

function parseBudget(text: string): { max: number; period?: "total" | "monthly" } | undefined {
  const lower = text.toLowerCase();
  const monthly = /per month|\/mês|\/mes|mensal|a month|por mês/.test(lower);

  const million = lower.match(/([\d.,]+)\s*(milh[oõ]es|million|mi)\b/);
  if (million) {
    const n = Number(million[1].replace(/\./g, "").replace(",", "."));
    if (n > 0) return { max: n >= 100 ? n * 1000 : n * 1_000_000, period: monthly ? "monthly" : "total" };
  }

  const thousand = lower.match(/(?:r\$\s*)?([\d.,]+)\s*(k|mil)\b/);
  if (thousand) {
    const n = Number(thousand[1].replace(/\./g, "").replace(",", "."));
    if (n > 0) return { max: n * 1000, period: monthly ? "monthly" : "total" };
  }

  const money = lower.match(/r\$\s*([\d.]+)/);
  if (money) {
    const n = Number(money[1].replace(/\./g, ""));
    if (n > 0) return { max: n, period: monthly ? "monthly" : "total" };
  }

  return undefined;
}

function parseBedrooms(text: string): number | undefined {
  const match =
    text.match(/(\d+)\s*(?:bed|quarto|dormit)/i) ||
    text.match(/(?:bedrooms?|quartos?|dormit[oó]rios?)\s*(?:is|are|de|:)?\s*(\d+)/i);
  if (match) return Number(match[1]);
  if (/\btwo\b|\bdois\b|\bdos\b/i.test(text) && /bed|quarto|dorm/i.test(text)) return 2;
  if (/\bthree\b|\btr[eê]s\b/i.test(text) && /bed|quarto|dorm/i.test(text)) return 3;
  return undefined;
}

const CITY_HINTS = [
  "são paulo",
  "sao paulo",
  "rio de janeiro",
  "brasília",
  "brasilia",
  "belo horizonte",
  "curitiba",
  "porto alegre",
  "salvador",
  "fortaleza",
  "recife",
  "campinas",
  "florianópolis",
  "florianopolis",
  "goiânia",
  "goiania",
];

function parseLocation(text: string) {
  const lower = text.toLowerCase();
  for (const city of CITY_HINTS) {
    if (lower.includes(city)) {
      const label = city
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      return { city: label.replace("Sao ", "São ").replace("Brasilia", "Brasília") };
    }
  }
  const inCity = text.match(/\b(?:in|em|en)\s+([A-ZÁÉÍÓÚÂÊÔÃÕÀ][\wÁÉÍÓÚÂÊÔÃÕÀáéíóúâêôãõà'-]*(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÀ][\wÁÉÍÓÚÂÊÔÃÕÀáéíóúâêôãõà'-]*)?)/);
  if (inCity?.[1] && inCity[1].length > 3) {
    return { city: inCity[1] };
  }
  return undefined;
}

export function extractWithRules(text: string): Partial<SearchRequirements> {
  const lower = text.toLowerCase();
  const result: Partial<SearchRequirements> = { rawIntent: text, preferences: [] };

  for (const [keyword, purpose] of PURPOSE_KEYWORDS) {
    if (lower.includes(keyword)) {
      result.purpose = purpose;
      break;
    }
  }
  for (const [keyword, type] of TYPE_KEYWORDS) {
    if (lower.includes(keyword)) {
      result.propertyType = type;
      break;
    }
  }

  const bedrooms = parseBedrooms(text);
  if (bedrooms != null) result.bedrooms = { min: bedrooms };

  const budget = parseBudget(text);
  if (budget) result.budget = { ...budget, currency: "BRL" };

  const location = parseLocation(text);
  if (location) result.location = location;

  const prefs = result.preferences ?? [];
  for (const [keyword, type] of PREFERENCE_KEYWORDS) {
    if (lower.includes(keyword) && !prefs.some((item) => item.type === type)) {
      prefs.push({ type, importance: "high" });
    }
  }
  result.preferences = prefs;

  return result;
}

export const ruleBasedProvider: AIProvider = {
  name: "rule_based",
  async extractIntent(input: ExtractIntentInput) {
    const last = [...input.messages].reverse().find((item) => item.role === "user");
    return extractWithRules(last?.content ?? "");
  },
  async askMissingRequirement(input) {
    return input.question.question;
  },
  async explainMatch(input: ExplainMatchInput) {
    return input.insightFallback;
  },
  async answerPropertyQuestion(input: PropertyQuestionInput) {
    const q = input.question.toLowerCase();
    const { facts } = input;
    if (q.includes("condom") || q.includes("condo")) {
      if (facts.condoFee != null && facts.condoFee > 0) {
        return `The listed condominium fee is ${facts.currency} ${facts.condoFee.toLocaleString()}. I cannot confirm whether other costs are included.`;
      }
      return "I don't have enough information to determine that.";
    }
    if (q.includes("match") || q.includes("%") || q.includes("score")) {
      if (input.breakdown) {
        return `The match score is ${input.breakdown.totalScore}%, calculated from budget, location, type, bedrooms, size and preferences.`;
      }
      return "I don't have enough information to determine that.";
    }
    if (q.includes("disadvantage") || q.includes("weak") || q.includes("downside")) {
      const weak = input.breakdown?.dimensions.filter((item) => item.score < 75) ?? [];
      if (weak.length === 0) return "Based on the available data, there are no clear weak dimensions.";
      return `The weaker dimensions are: ${weak.map((item) => `${item.label} (${item.detail})`).join("; ")}`;
    }
    return "I don't have enough information to determine that.";
  },
  async generateComparison(input: CompareInput) {
    const ranked = [...input.items].sort((a, b) => b.totalScore - a.totalScore);
    const best = ranked[0];
    if (!best) return "I don't have enough information to determine that.";
    return `${best.facts.title} is the strongest overall match at ${best.totalScore}% because of ${best.breakdown.strongest.join(", ")}.`;
  },
};

export { emptyRequirements };
