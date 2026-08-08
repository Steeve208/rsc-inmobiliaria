import Image, { type ImageProps } from "next/image";

/**
 * Listing photos always serve the original file. next/image re-encoding
 * (WebP/AVIF) softens detail, so we skip the optimizer for every variant.
 */
const SIZES_BY_VARIANT = {
  hero: "(max-width:1280px) 100vw, 1920px",
  card: "(max-width:768px) 100vw, 50vw",
  thumb: "160px",
} as const;

export type ListingImageVariant = keyof typeof SIZES_BY_VARIANT;

type Props = Omit<ImageProps, "quality"> & {
  variant?: ListingImageVariant;
  /** Kept for API compatibility; ignored because originals are always served. */
  quality?: number;
};

export function ListingImage({
  variant = "card",
  quality: _quality,
  sizes,
  unoptimized,
  ...props
}: Props) {
  return (
    <Image
      {...props}
      sizes={sizes ?? SIZES_BY_VARIANT[variant]}
      unoptimized={unoptimized ?? true}
    />
  );
}
