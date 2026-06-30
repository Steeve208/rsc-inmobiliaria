export type ListingCategory = "properties" | "vehicles";

export type ListingContactContext = {
  listingId: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  companyId: string;
  companyName: string;
  whatsappNumber: string;
  agentName?: string;
};

export type VisitStatus = "pending" | "confirmed" | "cancelled";

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
