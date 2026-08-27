export const BROKER_SPECIALTIES = [
  "residential",
  "luxury",
  "commercial",
  "investment",
  "newDevelopments",
  "rentals",
] as const;

export type BrokerSpecialty = (typeof BROKER_SPECIALTIES)[number];

export type BrokerProfile = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  coverImage: string;
  creci: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  verified: boolean;
  country: string;
  state: string;
  city: string;
  languages: string[];
  specialties: BrokerSpecialty[];
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  reviewsCount: number;
  listingsCount: number;
  yearsActive: number;
  soldCount: number;
};
