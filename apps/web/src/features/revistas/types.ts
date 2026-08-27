export const MAGAZINE_CATEGORIES = [
  "market",
  "luxury",
  "investment",
  "architecture",
  "lifestyle",
] as const;

export type MagazineCategory = (typeof MAGAZINE_CATEGORIES)[number];
export type MagazineStatus = "draft" | "published";

export type MagazineIssue = {
  id: string;
  slug: string;
  title: string;
  issueLabel: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category: MagazineCategory;
  author: string;
  pdfUrl: string;
  status: MagazineStatus;
  publishedAt: string;
};

export type MagazineInput = {
  id?: string;
  slug?: string;
  title: string;
  issueLabel: string;
  excerpt: string;
  body: string;
  coverImage: string;
  category?: string;
  author?: string;
  pdfUrl?: string;
  status?: string;
  publishedAt?: string;
};
