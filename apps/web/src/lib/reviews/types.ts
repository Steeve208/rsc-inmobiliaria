export type PlatformReview = {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  displayName: string;
  locationLabel: string | null;
  avatarUrl: string | null;
  status: "published" | "hidden";
  createdAt: string;
};

export type PublicPlatformReview = {
  id: string;
  rating: number;
  comment: string;
  displayName: string;
  locationLabel: string | null;
  avatarUrl: string | null;
  createdAt: string;
};
