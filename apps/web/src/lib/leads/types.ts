export type ListingCategory = "properties" | "vehicles";

export function normalizeListingCategory(
  category: ListingCategory | string,
): ListingCategory {
  if (category === "properties" || category === "vehicles") return category;
  if (category === "property") return "properties";
  if (category === "vehicle") return "vehicles";
  return "properties";
}

export type ListingContactContext = {
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  companyId: string;
  companyName: string;
  whatsappNumber: string;
  agentName?: string;
};

export type VisitStatus = "pending" | "confirmed" | "cancelled" | "reschedule_proposed";

export type ScheduledVisit = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  companyId: string;
  companyName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: VisitStatus;
  companyMessage?: string;
  proposedDate?: string;
  proposedTime?: string;
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  sender: "buyer" | "company";
  text: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  companyId: string;
  companyName: string;
  buyerId: string;
  buyerName: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type CompanyLeadConfig = {
  companyId: string;
  companyName: string;
  whatsappNumber: string;
};

export type LeadsStore = {
  visits: ScheduledVisit[];
  chatThreads: ChatThread[];
  companyConfigs: Record<string, CompanyLeadConfig>;
};

export type CreateVisitInput = {
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  companyId: string;
  companyName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
};

export type OpenChatInput = {
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  companyId: string;
  companyName: string;
  buyerId: string;
  buyerName: string;
  initialMessage?: string;
};

export type SendChatMessageInput = {
  threadId: string;
  sender: "buyer" | "company";
  text: string;
};

export type UpdateVisitInput = {
  visitId: string;
  status?: VisitStatus;
  companyMessage?: string;
  proposedDate?: string;
  proposedTime?: string;
  preferredDate?: string;
  preferredTime?: string;
};

export type ListingVisitAvailability = {
  bookedDates: string[];
  bookedSlots: Array<{ date: string; time: string }>;
  availableDates: string[];
  hasCompanySlots: boolean;
};
