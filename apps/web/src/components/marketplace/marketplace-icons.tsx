type IconProps = { className?: string };

function Svg({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconProperties({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6" y="20" width="36" height="22" rx="3" fill="#F59E0B" />
      <path d="M8 22 24 8l16 14" fill="#FBBF24" />
      <rect x="20" y="28" width="8" height="14" rx="1" fill="#FFF7ED" />
      <rect x="11" y="26" width="6" height="6" rx="1" fill="#FED7AA" />
      <rect x="31" y="26" width="6" height="6" rx="1" fill="#FED7AA" />
    </Svg>
  );
}

export function IconLuxury({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M24 6 30 18h12L32 26l4 14-12-8-12 8 4-14L6 18h12L24 6Z"
        fill="#A855F7"
      />
      <path d="M24 14 27.5 22H36l-7 5 2.5 8L24 30l-7.5 5 2.5-8-7-5h8.5L24 14Z" fill="#E9D5FF" />
    </Svg>
  );
}

export function IconRentals({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="18" cy="18" r="9" stroke="#10B981" strokeWidth="5" />
      <path d="M24 24 40 40" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
      <circle cx="18" cy="18" r="4" fill="#A7F3D0" />
    </Svg>
  );
}

export function IconCars({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6" y="20" width="36" height="12" rx="4" fill="#3B82F6" />
      <path d="M12 20 16 12h16l4 8" fill="#60A5FA" />
      <circle cx="14" cy="32" r="5" fill="#1E3A8A" />
      <circle cx="34" cy="32" r="5" fill="#1E3A8A" />
      <circle cx="14" cy="32" r="2" fill="#BFDBFE" />
      <circle cx="34" cy="32" r="2" fill="#BFDBFE" />
    </Svg>
  );
}

export function IconProjects({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="22" y="8" width="6" height="32" rx="1" fill="#F59E0B" />
      <path d="M10 18h28l-4 10H14L10 18Z" fill="#FBBF24" />
      <rect x="8" y="36" width="32" height="6" rx="1" fill="#D97706" />
      <circle cx="25" cy="12" r="3" fill="#FDE68A" />
    </Svg>
  );
}

export function IconCommercial({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="8" y="10" width="32" height="30" rx="2" fill="#0D9488" />
      <rect x="12" y="14" width="6" height="6" rx="1" fill="#99F6E4" />
      <rect x="21" y="14" width="6" height="6" rx="1" fill="#5EEAD4" />
      <rect x="30" y="14" width="6" height="6" rx="1" fill="#99F6E4" />
      <rect x="12" y="23" width="6" height="6" rx="1" fill="#5EEAD4" />
      <rect x="21" y="23" width="6" height="6" rx="1" fill="#99F6E4" />
      <rect x="30" y="23" width="6" height="6" rx="1" fill="#5EEAD4" />
      <rect x="20" y="32" width="8" height="8" fill="#CCFBF1" />
    </Svg>
  );
}

export function IconLand({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 36c8-10 12-10 20-4 8-8 12-8 20 4v6H4v-6Z" fill="#22C55E" />
      <circle cx="34" cy="14" r="7" fill="#FBBF24" />
      <path d="M14 30c0-8 4-12 8-12 0 6-2 10-8 12Z" fill="#16A34A" />
    </Svg>
  );
}

export function IconApartments({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="10" y="6" width="28" height="36" rx="2" fill="#2563EB" />
      <rect x="14" y="10" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="22" y="10" width="6" height="6" rx="1" fill="#93C5FD" />
      <rect x="30" y="10" width="4" height="6" rx="1" fill="#BFDBFE" />
      <rect x="14" y="19" width="6" height="6" rx="1" fill="#93C5FD" />
      <rect x="22" y="19" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="30" y="19" width="4" height="6" rx="1" fill="#93C5FD" />
      <rect x="14" y="28" width="6" height="6" rx="1" fill="#BFDBFE" />
      <rect x="22" y="28" width="6" height="6" rx="1" fill="#93C5FD" />
      <rect x="20" y="36" width="8" height="6" fill="#DBEAFE" />
    </Svg>
  );
}

export function IconHouses({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M8 22 24 8l16 14v18H8V22Z" fill="#F97316" />
      <path d="M8 22 24 8l16 14" fill="#FB923C" />
      <rect x="20" y="26" width="8" height="14" fill="#FFEDD5" />
      <rect x="12" y="26" width="6" height="6" rx="1" fill="#FED7AA" />
      <rect x="30" y="26" width="6" height="6" rx="1" fill="#FED7AA" />
    </Svg>
  );
}

export function IconMotorcycles({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="14" cy="34" r="8" stroke="#EF4444" strokeWidth="4" />
      <circle cx="36" cy="34" r="8" stroke="#EF4444" strokeWidth="4" />
      <path d="M14 34 24 18h10l4 16" stroke="#B91C1C" strokeWidth="4" strokeLinejoin="round" />
      <path d="M24 18h8" stroke="#F87171" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export function IconTrucks({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4" y="16" width="24" height="16" rx="2" fill="#F97316" />
      <path d="M28 22h10l4 10H28V22Z" fill="#FB923C" />
      <circle cx="14" cy="34" r="5" fill="#7C2D12" />
      <circle cx="36" cy="34" r="5" fill="#7C2D12" />
      <rect x="8" y="20" width="8" height="6" rx="1" fill="#FFEDD5" />
    </Svg>
  );
}

export function IconBusinesses({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="8" y="18" width="32" height="22" rx="3" fill="#1E9B8C" />
      <path d="M16 18v-4a8 8 0 0 1 16 0v4" stroke="#B45309" strokeWidth="4" />
      <rect x="20" y="26" width="8" height="6" rx="1" fill="#FEF3C7" />
    </Svg>
  );
}

export function IconServices({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        d="M16 8c8 0 12 6 12 12 0 2-4 4-4 4l12 12-6 6-12-12s-2 4-4 4C8 34 2 28 2 20 2 12 8 8 16 8Z"
        fill="#14B8A6"
      />
      <circle cx="16" cy="18" r="4" fill="#99F6E4" />
    </Svg>
  );
}

export function IconMore({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="24" r="5" fill="#94A3B8" />
      <circle cx="24" cy="24" r="5" fill="#64748B" />
      <circle cx="36" cy="24" r="5" fill="#94A3B8" />
    </Svg>
  );
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
