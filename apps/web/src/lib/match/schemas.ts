import { z } from "zod";
import {
  DEFAULT_REQUIREMENTS,
  IMPORTANCE_LEVELS,
  PREFERENCE_TYPES,
  PROPERTY_TYPES,
  SEARCH_PURPOSES,
  type SearchRequirements,
} from "./types";

const rangeSchema = z
  .object({
    min: z.number().int().min(0).max(50).optional(),
    max: z.number().int().min(0).max(50).optional(),
  })
  .optional();

const areaRangeSchema = z
  .object({
    min: z.number().min(0).max(100_000).optional(),
    max: z.number().min(0).max(100_000).optional(),
  })
  .optional();

export const searchRequirementsSchema = z.object({
  purpose: z.enum(SEARCH_PURPOSES).default("unknown"),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  location: z
    .object({
      city: z.string().trim().max(120).optional(),
      state: z.string().trim().max(80).optional(),
      neighborhood: z.string().trim().max(120).optional(),
      country: z.string().trim().max(80).optional(),
      lat: z.number().min(-90).max(90).nullable().optional(),
      lng: z.number().min(-180).max(180).nullable().optional(),
      radiusKm: z.number().min(1).max(200).optional(),
      label: z.string().trim().max(200).optional(),
    })
    .optional(),
  bedrooms: rangeSchema,
  bathrooms: rangeSchema,
  garage: rangeSchema,
  budget: z
    .object({
      min: z.number().min(0).max(1_000_000_000).optional(),
      max: z.number().min(0).max(1_000_000_000).optional(),
      currency: z.string().trim().min(3).max(3).default("BRL"),
      period: z.enum(["total", "monthly"]).optional(),
    })
    .optional(),
  area: areaRangeSchema,
  mustHave: z
    .array(
      z.object({
        type: z.string().trim().min(1).max(80),
        value: z.union([z.string(), z.number(), z.boolean()]).optional(),
      }),
    )
    .default([]),
  preferences: z
    .array(
      z.object({
        type: z.enum(PREFERENCE_TYPES),
        importance: z.enum(IMPORTANCE_LEVELS).default("medium"),
      }),
    )
    .default([]),
  rawIntent: z.string().trim().max(2000).optional(),
});

export const partialRequirementsSchema = searchRequirementsSchema.partial();

export const createSessionBodySchema = z.object({
  message: z.string().trim().min(2).max(2000),
  purposeHint: z.enum(SEARCH_PURPOSES).optional(),
  locale: z.string().trim().min(2).max(8).optional(),
  source: z.enum(["hero", "header", "match"]).optional(),
  hints: z
    .object({
      propertyType: z.enum(PROPERTY_TYPES).optional(),
      city: z.string().trim().max(120).optional(),
      state: z.string().trim().max(80).optional(),
      neighborhood: z.string().trim().max(120).optional(),
      country: z.string().trim().max(80).optional(),
      locationLabel: z.string().trim().max(200).optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
      priceMin: z.number().min(0).optional(),
      priceMax: z.number().min(0).optional(),
    })
    .optional(),
});

export const sessionMessageBodySchema = z.object({
  message: z.string().trim().min(1).max(2000),
  optionId: z.string().trim().max(80).optional(),
});

export const patchRequirementsBodySchema = z.object({
  requirements: partialRequirementsSchema,
});

export const compareBodySchema = z.object({
  propertyIds: z.array(z.string().min(1)).min(2).max(4),
});

export const askBodySchema = z.object({
  question: z.string().trim().min(3).max(500),
});

export const eventBodySchema = z.object({
  propertyId: z.string().min(1),
  eventType: z.enum([
    "property_view",
    "property_save",
    "property_compare",
    "property_contact",
    "property_hide",
  ]),
});

export function emptyRequirements(): SearchRequirements {
  return {
    ...DEFAULT_REQUIREMENTS,
    mustHave: [],
    preferences: [],
  };
}
