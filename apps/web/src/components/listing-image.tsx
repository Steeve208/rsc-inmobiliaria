import Image, { type ImageProps } from "next/image";

/**
 * Listing photos go through next/image optimization.
 * Default quality (75) looks soft on property/vehicle galleries —
 * use higher quality for marketplace media.
 */
const QUALITY_BY_VARIANT = {
  hero: 95,
  card: 90,
  thumb: 80,
} as const;

const SIZES_BY_VARIANT = {
  hero: "(max-width:1280px) 100vw, 1400px",
  card: "(max-width:768px) 100vw, 33vw",
  thumb: "120px",
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
  ...props
}: Props) {
  return (
    <Image
      {...props}
      quality={quality ?? QUALITY_BY_VARIANT[variant]}
      sizes={sizes ?? SIZES_BY_VARIANT[variant]}
    />
  );
}
