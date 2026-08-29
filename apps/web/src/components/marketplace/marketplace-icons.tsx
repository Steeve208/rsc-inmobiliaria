import Image from "next/image";

type IconProps = {
  className?: string;
  priority?: boolean;
};

const CATEGORY_IMAGE = {
  apartments: "/images/categories/apartments.webp",
  houses: "/images/categories/houses.webp",
  land: "/images/categories/land.webp",
  commercial: "/images/categories/commercial.webp",
  rentals: "/images/categories/rentals.webp",
  cars: "/images/categories/cars.webp",
  motorcycles: "/images/categories/motorcycles.webp",
  trucks: "/images/categories/trucks.webp",
  projects: "/images/categories/projects.webp",
  businesses: "/images/categories/businesses.webp",
  services: "/images/categories/services.webp",
  more: "/images/categories/more.webp",
  luxury: "/images/categories/luxury.webp",
  properties: "/images/categories/properties.webp",
} as const;

function Glyph({
  src,
  className,
  priority = false,
}: {
  src: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={128}
      height={128}
      className={className}
      aria-hidden
      draggable={false}
      priority={priority}
      unoptimized
    />
  );
}

export function IconProperties({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.properties} className={className} priority={priority} />;
}

export function IconLuxury({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.luxury} className={className} priority={priority} />;
}

export function IconRentals({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.rentals} className={className} priority={priority} />;
}

export function IconCars({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.cars} className={className} priority={priority} />;
}

export function IconProjects({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.projects} className={className} priority={priority} />;
}

export function IconCommercial({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.commercial} className={className} priority={priority} />;
}

export function IconLand({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.land} className={className} priority={priority} />;
}

export function IconApartments({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.apartments} className={className} priority={priority} />;
}

export function IconHouses({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.houses} className={className} priority={priority} />;
}

export function IconMotorcycles({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.motorcycles} className={className} priority={priority} />;
}

export function IconTrucks({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.trucks} className={className} priority={priority} />;
}

export function IconBusinesses({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.businesses} className={className} priority={priority} />;
}

export function IconServices({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.services} className={className} priority={priority} />;
}

export function IconMore({ className, priority }: IconProps) {
  return <Glyph src={CATEGORY_IMAGE.more} className={className} priority={priority} />;
}

export const QUICK_PICK_ICONS = {
  propertiesUnder: IconProperties,
  luxury: IconLuxury,
  rentals: IconRentals,
  carsUnder: IconCars,
  projects: IconProjects,
  commercial: IconCommercial,
  land: IconLand,
} as const;

export const QUICK_PICK_TONES = {
  propertiesUnder: "bg-[#FFF7ED]",
  luxury: "bg-[#F5F3FF]",
  rentals: "bg-[#ECFDF5]",
  carsUnder: "bg-[#EFF6FF]",
  projects: "bg-[#FFFBEB]",
  commercial: "bg-[#F0FDFA]",
  land: "bg-[#F0FDF4]",
} as const;

export const CATEGORY_ICONS = {
  apartments: IconApartments,
  houses: IconHouses,
  land: IconLand,
  commercial: IconCommercial,
  rentals: IconRentals,
  cars: IconCars,
  motorcycles: IconMotorcycles,
  trucks: IconTrucks,
  projects: IconProjects,
  businesses: IconBusinesses,
  services: IconServices,
  more: IconMore,
} as const;

const DEFAULT_QUICK_PICK_TONE = "bg-[#F4F7FA]";

export function quickPickIcon(id: string) {
  return QUICK_PICK_ICONS[id as keyof typeof QUICK_PICK_ICONS] ?? IconMore;
}

export function quickPickTone(id: string) {
  return QUICK_PICK_TONES[id as keyof typeof QUICK_PICK_TONES] ?? DEFAULT_QUICK_PICK_TONE;
}

export function categoryIcon(id: string) {
  return CATEGORY_ICONS[id as keyof typeof CATEGORY_ICONS] ?? IconMore;
}
