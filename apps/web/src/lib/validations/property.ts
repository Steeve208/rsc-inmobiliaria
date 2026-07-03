import { z } from "zod";

export const propertyTypeSchema = z.enum(["house", "apartment", "land", "commercial"]);
export const propertyTransactionSchema = z.enum(["buy", "rent"]);

export const createPropertySchema = z.object({
  title: z.string().min(3).max(200),
  type: propertyTypeSchema.default("house"),
  transaction: propertyTransactionSchema.default("buy"),
  price: z.coerce.number().positive(),
  currency: z.string().default("BRL"),
  country: z.string().min(2).default("Brasil"),
  state: z.string().optional(),
  city: z.string().min(2),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  description: z.string().max(5000).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  garage: z.coerce.number().int().min(0).optional(),
  area: z.coerce.number().min(0).optional(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  videoUrl: z.string().max(2000).optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
