import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env/production-config";

type ListingSeoInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
};

function absoluteUrl(path: string) {
  const base = getAppUrl().replace(/\/$/, "");
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildListingMetadata(input: ListingSeoInput): Metadata {
  const canonicalPath = `/${input.locale}${input.path}`;
  const url = absoluteUrl(canonicalPath);
  const image = input.image?.trim() ? absoluteUrl(input.image) : undefined;
  const description =
    input.description.trim().slice(0, 160) || input.title;

  return {
    title: input.title,
    description,
    alternates: {
      canonical: input.path,
      languages: {
        en: `/en${input.path}`,
        es: `/es${input.path}`,
        pt: `/pt${input.path}`,
      },
    },
    openGraph: {
      title: input.title,
      description,
      url,
      type: input.type ?? "website",
      locale: input.locale,
      ...(image
        ? {
            images: [{ url: image, alt: input.title }],
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: input.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
