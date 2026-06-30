import { z } from "zod";

export const companyTypes = ["real_estate", "dealership", "builder"] as const;

export const companyRegistrationSchema = z.object({
  company: z.string().trim().min(2).max(120),
  cnpj: z.string().trim().min(3).max(40),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30),
  type: z.enum(companyTypes).optional(),
  marketId: z.string().trim().min(2).max(4).optional(),
});

export type CompanyRegistrationValues = z.infer<typeof companyRegistrationSchema>;
