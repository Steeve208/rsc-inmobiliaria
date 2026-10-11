import { isPublicCatalogEntry } from "@/lib/marketplace/features";

export const HERO_IMAGE = "/images/hero-night.jpg";

export type MarketplaceSearchCategory =
  | "all"
  | "properties"
  | "vehicles"
  | "projects"
  | "businesses"
  | "services";

const HEADER_SEARCH_CATEGORIES_ALL: MarketplaceSearchCategory[] = [
  "all",
  "properties",
  "vehicles",
  "projects",
  "businesses",
  "services",
];

export const HEADER_SEARCH_CATEGORIES = HEADER_SEARCH_CATEGORIES_ALL.filter(
  (id) => isPublicCatalogEntry({ id }),
);

const HERO_SEARCH_TABS_ALL = [
  "properties",
  "vehicles",
  "projects",
  "businesses",
  "services",
] as const;

export const HERO_SEARCH_TABS = HERO_SEARCH_TABS_ALL.filter((id) =>
  isPublicCatalogEntry({ id }),
);

export type HeroSearchTab = (typeof HERO_SEARCH_TABS_ALL)[number];

const SECONDARY_NAV_ALL = [
  { href: "/", labelKey: "home" as const, icon: "home" as const },
  { href: "/imoveis", labelKey: "properties" as const, icon: "properties" as const },
  { href: "/veiculos", labelKey: "vehicles" as const, icon: "vehicles" as const },
  { href: "/negocios", labelKey: "businesses" as const, icon: "businesses" as const },
  { href: "/services", labelKey: "services" as const, icon: "services" as const },
  { href: "/imoveis?featured=1", labelKey: "deals" as const, icon: "deals" as const },
  { href: "/corredores", labelKey: "brokers" as const, icon: "brokers" as const },
] as const;

export const SECONDARY_NAV = SECONDARY_NAV_ALL.filter((item) =>
  isPublicCatalogEntry(item),
);

export type QuickPickId =
  | "propertiesUnder"
  | "luxury"
  | "rentals"
  | "beach"
  | "projects"
  | "commercial"
  | "land";

const QUICK_PICKS_ALL: Array<{
  id: QuickPickId;
  href: string;
  image: string;
}> = [
  {
    id: "propertiesUnder",
    href: "/imoveis?priceMax=500000",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "luxury",
    href: "/imoveis?featured=1",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "rentals",
    href: "/imoveis?transaction=rent",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "beach",
    href: "/imoveis?q=beach",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "projects",
    href: "/projetos",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "commercial",
    href: "/imoveis?type=commercial",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "land",
    href: "/imoveis?type=land",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=240&q=80",
  },
];

export const QUICK_PICKS = QUICK_PICKS_ALL.filter((item) =>
  isPublicCatalogEntry(item),
);

const PROMO_PANELS_ALL = [
  {
    id: "premium",
    href: "/imoveis?featured=1",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
    ctaKey: "explore" as const,
    graphic: null,
  },
  {
    id: "projects",
    href: "/projetos",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
    ctaKey: "explore" as const,
    graphic: null,
  },
  {
    id: "rentals",
    href: "/imoveis?transaction=rent",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    ctaKey: "explore" as const,
    graphic: null,
  },
  {
    id: "hot",
    href: "/imoveis?featured=1",
    image: null,
    ctaKey: "deals" as const,
    graphic: "tags" as const,
  },
] as const;

export const PROMO_PANELS = PROMO_PANELS_ALL.filter((item) =>
  isPublicCatalogEntry(item),
);

const CATEGORY_SHORTCUTS_ALL = [
  { id: "apartments", href: "/imoveis?type=apartment" },
  { id: "houses", href: "/imoveis?type=house" },
  { id: "land", href: "/imoveis?type=land" },
  { id: "commercial", href: "/imoveis?type=commercial" },
  { id: "rentals", href: "/imoveis?transaction=rent" },
  { id: "luxury", href: "/imoveis?featured=1" },
  { id: "penthouses", href: "/imoveis?type=apartment&featured=1" },
  { id: "beach", href: "/imoveis?q=beach" },
  { id: "studios", href: "/imoveis?type=apartment&bedrooms=1" },
  { id: "projects", href: "/projetos" },
  { id: "businesses", href: "/negocios" },
  { id: "services", href: "/services" },
  { id: "more", href: "/imoveis" },
] as const;

export const CATEGORY_SHORTCUTS = CATEGORY_SHORTCUTS_ALL.filter((item) =>
  isPublicCatalogEntry(item),
);

export const POPULAR_SEARCHES = [
  { label: "Miami", href: "/imoveis?city=Miami&locationLabel=Miami" },
  { label: "São Paulo", href: "/imoveis?city=S%C3%A3o%20Paulo&locationLabel=S%C3%A3o%20Paulo" },
  { label: "Lisbon", href: "/imoveis?city=Lisbon&locationLabel=Lisbon" },
  { label: "Dubai", href: "/imoveis?city=Dubai&locationLabel=Dubai" },
  { label: "New York", href: "/imoveis?city=New%20York&locationLabel=New%20York" },
  { label: "Orlando", href: "/imoveis?city=Orlando&locationLabel=Orlando" },
] as const;

const LIST_ACTIONS_ALL = [
  { id: "property", href: "/empresa/cadastro" },
  { id: "vehicle", href: "/empresa/cadastro" },
  { id: "project", href: "/empresa/cadastro" },
  { id: "business", href: "/empresa/cadastro" },
  { id: "service", href: "/services" },
] as const;

export const LIST_ACTIONS = LIST_ACTIONS_ALL.filter((item) =>
  isPublicCatalogEntry(item),
);

export const TRUST_ITEMS = [
  "verified",
  "secure",
  "global",
  "connect",
  "search",
] as const;

/** Static chrome used when the portal has not published a home (or a slot is empty). */
export function getCatalogHomeEditorial() {
  return {
    hero: {
      imageUrl: HERO_IMAGE,
      popularSearches: POPULAR_SEARCHES.map((item) => ({ ...item })),
    },
    quickPicks: QUICK_PICKS.map(({ id, href }) => ({ id, href })),
    promoPanels: PROMO_PANELS.map((panel) => ({
      id: panel.id,
      href: panel.href,
      imageUrl: panel.image,
      graphic: panel.graphic,
    })),
    categoryShortcuts: CATEGORY_SHORTCUTS.map(({ id, href }) => ({ id, href })),
  };
}
