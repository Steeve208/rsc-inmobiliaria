import { ResidenceHero } from "@/components/marketplace/residence-hero";
import { destinationImage } from "@/lib/marketplace/destination-images";
import { ResidenceHomeBody } from "@/components/marketplace/residence-home-body";
import { MarketplaceFooter } from "@/components/marketplace/marketplace-footer";
import type { MarketplaceHomeData, MarketplaceListing } from "@/lib/marketplace/types";

type Props = {
  data: MarketplaceHomeData;
  showJournal?: boolean;
};

function uniqueProperties(items: MarketplaceListing[]) {
  const seen = new Set<string>();
  const out: MarketplaceListing[] = [];
  for (const item of items) {
    if (item.kind !== "property") continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

export function MarketplaceHome({ data, showJournal = false }: Props) {
  const properties = uniqueProperties([
    ...data.featuredProperties,
    ...data.newListings,
    ...data.deals,
    ...(data.featuredCity?.items ?? []),
  ]);

  return (
    <div className="bg-[#f6f3ee] pb-16 text-[#1c1917] md:pb-0">
      <ResidenceHero slides={heroSlides(properties)} showJournal={showJournal} />
      <ResidenceHomeBody
        properties={properties}
        destinations={destinationsFrom(properties)}
      />
      <MarketplaceFooter />
    </div>
  );
}

function heroSlides(items: MarketplaceListing[]) {
  return [...items].sort((a, b) => b.price - a.price).slice(0, 8);
}

function destinationsFrom(items: MarketplaceListing[]) {
  const groups = new Map<string, MarketplaceListing[]>();
  for (const item of items) {
    const name = countryName(item);
    if (!name) continue;
    const list = groups.get(name) ?? [];
    list.push(item);
    groups.set(name, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5)
    .map(([name, list]) => {
      const priced = list.filter((item) => item.price > 0);
      const cheapest = priced.sort((a, b) => a.price - b.price)[0];
      return {
        name: placeLabel(name),
        count: list.length,
        href: `/imoveis?country=${encodeURIComponent(name)}&locationLabel=${encodeURIComponent(name)}`,
        image: destinationImage(name),
        fromPrice: cheapest?.price,
        currency: cheapest?.currency,
      };
    });
}

function placeLabel(name: string) {
  return name
    .split(/\s+/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function countryName(item: MarketplaceListing) {
  const explicit = item.country?.trim();
  if (explicit) return explicit;
  const parts = item.location.split(",").map((part) => part.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? "";
}
