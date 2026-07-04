import type { ListingCategory } from "@/lib/leads/types";

export type FinancingRequestStatus =
  | "pending"
  | "in_analysis"
  | "approved"
  | "rejected";

export type FinancingRequest = {
  id: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  listingId?: string;
  listingTitle?: string;
  listingCategory?: ListingCategory;
  propertyValue: number;
  downPaymentPct: number;
  downPaymentAmount: number;
  termMonths: number;
  interestRate: number;
  estimatedInstallment: number;
  currency: string;
  status: FinancingRequestStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateFinancingRequestInput = {
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  listingId?: string;
  listingTitle?: string;
  listingCategory?: ListingCategory;
  propertyValue: number;
  downPaymentPct: number;
  downPaymentAmount: number;
  termMonths: number;
  interestRate: number;
  estimatedInstallment: number;
  currency?: string;
  notes?: string;
};

export type UpdateFinancingRequestStatusInput = {
  id: string;
  status: FinancingRequestStatus;
};

export const FINANCING_REQUEST_STATUSES: FinancingRequestStatus[] = [
  "pending",
  "in_analysis",
  "approved",
  "rejected",
];
