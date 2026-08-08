import Image, { type ImageProps } from "next/image";

/**
 * Listing photos go through next/image by default, which re-encodes
 * (WebP/AVIF) and softens detail. Heroes serve the original file;
 * cards/thumbs stay optimized but at high quality.
 */
const QUALITY_BY_VARIANT = {
  hero: 100,
  card: 95,
  thumb: 90,
} as const;

const SIZES_BY_VARIANT = {
  hero: "(max-width:1280px) 100vw, 1920px",
  card: "(max-width:768px) 100vw, 50vw",
  thumb: "160px",
} as const;

export type ListingImageVariant = keyof typeof QUALITY_BY_VARIANT;

type Props = Omit<ImageProps, "quality"> & {
  variant?: ListingImageVariant;
  quality?: number;
};

export function ListingImage({
  variant = "card",
  quality,
  sizes,
  unoptimized,
  ...props
}: Props) {
  const preserveOriginal = variant === "hero";

  return (
    <Image
      {...props}
      quality={quality ?? QUALITY_BY_VARIANT[variant]}
      sizes={sizes ?? SIZES_BY_VARIANT[variant]}
      unoptimized={unoptimized ?? preserveOriginal}
    />
  );
}
