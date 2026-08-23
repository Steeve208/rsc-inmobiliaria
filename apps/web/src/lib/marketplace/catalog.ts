export const HERO_IMAGE = "/images/hero-night.jpg";

export type MarketplaceSearchCategory =
  | "all"
  | "properties"
  | "vehicles"
  | "projects"
  | "businesses"
  | "services";

export const HEADER_SEARCH_CATEGORIES: MarketplaceSearchCategory[] = [
  "all",
  "properties",
  "vehicles",
  "projects",
  "businesses",
  "services",
];

export const HERO_SEARCH_TABS = [
  "properties",
  "vehicles",
  "projects",
  "businesses",
  "services",
] as const;

export type HeroSearchTab = (typeof HERO_SEARCH_TABS)[number];

export const SECONDARY_NAV = [
  { href: "/imoveis", labelKey: "properties" as const, icon: "properties" as const },
  { href: "/veiculos", labelKey: "vehicles" as const, icon: "vehicles" as const },
  { href: "/projetos", labelKey: "projects" as const, icon: "projects" as const },
  { href: "/negocios", labelKey: "businesses" as const, icon: "businesses" as const },
  { href: "/services", labelKey: "services" as const, icon: "services" as const },
  { href: "/imoveis?featured=1", labelKey: "deals" as const, icon: "deals" as const },
  { href: "/imoveis", labelKey: "newListings" as const, icon: "newListings" as const },
  { href: "/imoveis?featured=1", labelKey: "premium" as const, icon: "premium" as const },
] as const;

export type QuickPickId =
  | "propertiesUnder"
  | "luxury"
  | "rentals"
  | "carsUnder"
  | "projects"
  | "commercial"
  | "land";

export const QUICK_PICKS: Array<{
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
    id: "carsUnder",
    href: "/veiculos?priceMax=150000",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=240&q=80",
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

export const PROMO_PANELS = [
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
    id: "vehicles",
    href: "/veiculos",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
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

export const CATEGORY_SHORTCUTS = [
  { id: "apartments", href: "/imoveis?type=apartment" },
  { id: "houses", href: "/imoveis?type=house" },
  { id: "land", href: "/imoveis?type=land" },
  { id: "commercial", href: "/imoveis?type=commercial" },
  { id: "rentals", href: "/imoveis?transaction=rent" },
  { id: "cars", href: "/veiculos?type=car" },
  { id: "motorcycles", href: "/veiculos?type=motorcycle" },
  { id: "trucks", href: "/veiculos?type=truck" },
  { id: "projects", href: "/projetos" },
  { id: "businesses", href: "/negocios" },
  { id: "services", href: "/services" },
  { id: "more", href: "/imoveis" },
] as const;

export const POPULAR_SEARCHES = [
  { label: "São Paulo", href: "/imoveis?city=S%C3%A3o%20Paulo&locationLabel=S%C3%A3o%20Paulo" },
  { label: "Rio de Janeiro", href: "/imoveis?city=Rio%20de%20Janeiro&locationLabel=Rio%20de%20Janeiro" },
  { label: "Miami", href: "/imoveis?city=Miami&locationLabel=Miami" },
  { label: "Lisbon", href: "/imoveis?city=Lisbon&locationLabel=Lisbon" },
  { label: "Dubai", href: "/imoveis?city=Dubai&locationLabel=Dubai" },
] as const;

export const LIST_ACTIONS = [
  { id: "property", href: "/empresa/cadastro" },
  { id: "vehicle", href: "/empresa/cadastro" },
  { id: "project", href: "/empresa/cadastro" },
  { id: "business", href: "/empresa/cadastro" },
  { id: "service", href: "/services" },
] as const;

export const TRUST_ITEMS = [
  "verified",
  "secure",
  "global",
  "connect",
  "search",
] as const;
