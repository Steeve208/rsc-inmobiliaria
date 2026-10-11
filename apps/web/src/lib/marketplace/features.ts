/**
 * Public catalog modules. Cars, motorcycles, trucks and services stay in the
 * codebase; flip these back on when those verticals should appear on the site.
 */
export const PUBLIC_MODULES = {
  vehicles: false,
  services: false,
} as const;

/** Sample catalogs stay off. The site uses live inventory in every environment. */
export const SHOW_MARKETPLACE_MOCKS = false;

const DISABLED_IDS = new Set<string>([
  ...(PUBLIC_MODULES.vehicles
    ? []
    : ["vehicles", "vehicle", "cars", "carsUnder", "motorcycles", "trucks"]),
  ...(PUBLIC_MODULES.services ? [] : ["services", "service"]),
]);

export function isPublicListingKind(kind: string) {
  if (kind === "vehicle" && !PUBLIC_MODULES.vehicles) return false;
  if (kind === "service" && !PUBLIC_MODULES.services) return false;
  return true;
}

export function isPublicCatalogEntry(entry: {
  id?: string;
  href?: string;
  labelKey?: string;
}) {
  const id = entry.id ?? entry.labelKey ?? "";
  if (id && DISABLED_IDS.has(id)) return false;

  const href = entry.href ?? "";
  if (
    !PUBLIC_MODULES.vehicles &&
    (href === "/veiculos" ||
      href.startsWith("/veiculos?") ||
      href.startsWith("/veiculos/"))
  ) {
    return false;
  }
  if (
    !PUBLIC_MODULES.services &&
    (href === "/services" ||
      href.startsWith("/services?") ||
      href.startsWith("/services/"))
  ) {
    return false;
  }
  return true;
}
