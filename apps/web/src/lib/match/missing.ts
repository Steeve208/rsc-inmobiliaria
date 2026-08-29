import type { FollowUpQuestion, MatchMissingField, SearchRequirements } from "./types";

export function detectMissingFields(requirements: SearchRequirements): MatchMissingField[] {
  const missing: MatchMissingField[] = [];
  if (!requirements.location?.city && !requirements.location?.neighborhood) {
    missing.push("location");
  }
  if (requirements.purpose === "unknown") missing.push("purpose");
  if (requirements.budget?.max == null && requirements.budget?.min == null) {
    missing.push("budget");
  }
  if (requirements.bedrooms?.min == null) missing.push("bedrooms");
  if (!requirements.propertyType) missing.push("propertyType");
  return missing;
}

export function isReadyToMatch(requirements: SearchRequirements) {
  const hasLocation = Boolean(
    requirements.location?.city ||
      requirements.location?.neighborhood ||
      (requirements.location?.lat != null && requirements.location?.lng != null),
  );
  const hasConstraint = Boolean(
    requirements.propertyType ||
      requirements.bedrooms?.min != null ||
      requirements.budget?.max != null ||
      requirements.purpose !== "unknown",
  );
  return hasLocation && hasConstraint;
}

export function followUpForField(
  field: MatchMissingField,
  locale: string,
): FollowUpQuestion {
  const copy = copyFor(locale);
  return copy[field];
}

function copyFor(locale: string): Record<MatchMissingField, FollowUpQuestion> {
  if (locale.startsWith("pt")) {
    return {
      purpose: {
        field: "purpose",
        question: "Você quer comprar, alugar ou investir?",
        options: [
          { id: "buy", label: "Comprar" },
          { id: "rent", label: "Alugar" },
          { id: "invest", label: "Investir" },
        ],
      },
      location: {
        field: "location",
        question: "Em qual cidade ou bairro você quer morar?",
      },
      budget: {
        field: "budget",
        question: "Qual é o teto que você consegue considerar?",
        options: [
          { id: "300000", label: "Até R$300 mil" },
          { id: "500000", label: "Até R$500 mil" },
          { id: "800000", label: "Até R$800 mil" },
          { id: "1200000", label: "Até R$1,2 milhão" },
        ],
      },
      bedrooms: {
        field: "bedrooms",
        question: "Quantos quartos você precisa no mínimo?",
        options: [
          { id: "1", label: "1+" },
          { id: "2", label: "2+" },
          { id: "3", label: "3+" },
          { id: "4", label: "4+" },
        ],
      },
      propertyType: {
        field: "propertyType",
        question: "Que tipo de imóvel você procura?",
        options: [
          { id: "apartment", label: "Apartamento" },
          { id: "house", label: "Casa" },
          { id: "land", label: "Terreno" },
          { id: "commercial", label: "Comercial" },
        ],
      },
    };
  }

  if (locale.startsWith("es")) {
    return {
      purpose: {
        field: "purpose",
        question: "¿Quieres comprar, alquilar o invertir?",
        options: [
          { id: "buy", label: "Comprar" },
          { id: "rent", label: "Alquilar" },
          { id: "invest", label: "Invertir" },
        ],
      },
      location: {
        field: "location",
        question: "¿En qué ciudad o barrio te gustaría buscar?",
      },
      budget: {
        field: "budget",
        question: "¿Cuál es el presupuesto máximo que puedes considerar?",
        options: [
          { id: "300000", label: "Hasta 300 mil" },
          { id: "500000", label: "Hasta 500 mil" },
          { id: "800000", label: "Hasta 800 mil" },
          { id: "1200000", label: "Hasta 1,2 millones" },
        ],
      },
      bedrooms: {
        field: "bedrooms",
        question: "¿Cuántos dormitorios necesitas como mínimo?",
        options: [
          { id: "1", label: "1+" },
          { id: "2", label: "2+" },
          { id: "3", label: "3+" },
          { id: "4", label: "4+" },
        ],
      },
      propertyType: {
        field: "propertyType",
        question: "¿Qué tipo de propiedad buscas?",
        options: [
          { id: "apartment", label: "Apartamento" },
          { id: "house", label: "Casa" },
          { id: "land", label: "Terreno" },
          { id: "commercial", label: "Comercial" },
        ],
      },
    };
  }

  return {
    purpose: {
      field: "purpose",
      question: "Are you looking to buy, rent, or invest?",
      options: [
        { id: "buy", label: "Buy" },
        { id: "rent", label: "Rent" },
        { id: "invest", label: "Invest" },
      ],
    },
    location: {
      field: "location",
      question: "Which city or neighborhood should we focus on?",
    },
    budget: {
      field: "budget",
      question: "What is the most you can consider?",
      options: [
        { id: "300000", label: "Up to 300k" },
        { id: "500000", label: "Up to 500k" },
        { id: "800000", label: "Up to 800k" },
        { id: "1200000", label: "Up to 1.2M" },
      ],
    },
    bedrooms: {
      field: "bedrooms",
      question: "How many bedrooms do you need at a minimum?",
      options: [
        { id: "1", label: "1+" },
        { id: "2", label: "2+" },
        { id: "3", label: "3+" },
        { id: "4", label: "4+" },
      ],
    },
    propertyType: {
      field: "propertyType",
      question: "What type of property are you looking for?",
      options: [
        { id: "apartment", label: "Apartment" },
        { id: "house", label: "House" },
        { id: "land", label: "Land" },
        { id: "commercial", label: "Commercial" },
      ],
    },
  };
}

export function summarizeRequirements(requirements: SearchRequirements): string[] {
  const items: string[] = [];
  if (requirements.purpose !== "unknown") items.push(requirements.purpose);
  if (requirements.propertyType) items.push(requirements.propertyType);
  if (requirements.location?.city) items.push(requirements.location.city);
  if (requirements.bedrooms?.min != null) items.push(`${requirements.bedrooms.min}+ bedrooms`);
  if (requirements.budget?.max != null) {
    const period = requirements.budget.period === "monthly" ? "/mo" : "";
    items.push(`≤ ${requirements.budget.currency} ${requirements.budget.max.toLocaleString()}${period}`);
  }
  for (const pref of requirements.preferences) {
    items.push(pref.type.replace(/_/g, " "));
  }
  return items;
}
