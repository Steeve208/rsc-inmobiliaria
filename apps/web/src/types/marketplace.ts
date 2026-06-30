export type ListingCategory =
  | "property"
  | "vehicle"
  | "electronics"
  | "fashion"
  | "services"
  | "other";

export type ListingStatus = "draft" | "active" | "sold" | "archived";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: ListingCategory;
  status: ListingStatus;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "user" | "admin";
}
