import { z } from "zod";

export const createFinancingRequestSchema = z.object({
  buyerId: z.string().min(1),
  buyerName: z.string().trim().min(2).max(120).optional(),
  buyerEmail: z.string().trim().email().optional(),
  buyerPhone: z.string().trim().min(8).max(30).optional(),
  companyId: z.string().trim().min(1).optional(),
  listingId: z.string().trim().min(1).optional(),
  listingTitle: z.string().trim().min(1).max(300).optional(),
  listingCategory: z.enum(["properties", "vehicles"]).optional(),
  propertyValue: z.number().positive(),
  downPaymentPct: z.number().min(0).max(100),
  downPaymentAmount: z.number().min(0),
  termMonths: z.number().int().min(1).max(480),
  interestRate: z.number().min(0).max(100),
  estimatedInstallment: z.number().min(0),
  currency: z.string().trim().min(3).max(3).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const updateFinancingRequestStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "in_analysis", "approved", "rejected"]),
});
