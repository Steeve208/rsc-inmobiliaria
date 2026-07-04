import type { PropertyListing } from "@/features/imoveis/types";
import type { VehicleListing } from "@/features/veiculos/types";
import type { SavedSearchVertical } from "./types";

export type AlertEmailLocale = "pt" | "en" | "es";

type EmailCopy = {
  subject: (searchLabel: string, count: number) => string;
  greeting: (name: string) => string;
  intro: (searchLabel: string, count: number) => string;
  viewListing: string;
  viewAll: string;
  footer: string;
  priceLabel: string;
};

const propertyCopy: Record<AlertEmailLocale, EmailCopy> = {
  pt: {
    subject: (label, count) =>
      count === 1
        ? `Novo imóvel para "${label}" | RSC Market`
        : `${count} novos imóveis para "${label}" | RSC Market`,
    greeting: (name) => `Olá${name ? `, ${name}` : ""}!`,
    intro: (label, count) =>
      count === 1
        ? `Encontramos 1 novo imóvel compatível com sua busca salva "${label}":`
        : `Encontramos ${count} novos imóveis compatíveis com sua busca salva "${label}":`,
    viewListing: "Ver imóvel",
    viewAll: "Ver todos os resultados",
    footer: "Você recebeu este e-mail porque ativou alertas no RSC Market.",
    priceLabel: "Preço",
  },
  en: {
    subject: (label, count) =>
      count === 1
        ? `New property for "${label}" | RSC Market`
        : `${count} new properties for "${label}" | RSC Market`,
    greeting: (name) => `Hello${name ? `, ${name}` : ""}!`,
    intro: (label, count) =>
      count === 1
        ? `We found 1 new property matching your saved search "${label}":`
        : `We found ${count} new properties matching your saved search "${label}":`,
    viewListing: "View property",
    viewAll: "View all results",
    footer: "You received this email because you enabled alerts on RSC Market.",
    priceLabel: "Price",
  },
  es: {
    subject: (label, count) =>
      count === 1
        ? `Nuevo inmueble para "${label}" | RSC Market`
        : `${count} nuevos inmuebles para "${label}" | RSC Market`,
    greeting: (name) => `Hola${name ? `, ${name}` : ""}!`,
    intro: (label, count) =>
      count === 1
        ? `Encontramos 1 inmueble nuevo compatible con tu búsqueda guardada "${label}":`
        : `Encontramos ${count} inmuebles nuevos compatibles con tu búsqueda guardada "${label}":`,
    viewListing: "Ver inmueble",
    viewAll: "Ver todos los resultados",
    footer: "Recibiste este correo porque activaste alertas en RSC Market.",
    priceLabel: "Precio",
  },
};

const vehicleCopy: Record<AlertEmailLocale, EmailCopy> = {
  pt: {
    subject: (label, count) =>
      count === 1
        ? `Novo veículo para "${label}" | RSC Market`
        : `${count} novos veículos para "${label}" | RSC Market`,
    greeting: (name) => `Olá${name ? `, ${name}` : ""}!`,
    intro: (label, count) =>
      count === 1
        ? `Encontramos 1 novo veículo compatível com sua busca salva "${label}":`
        : `Encontramos ${count} novos veículos compatíveis com sua busca salva "${label}":`,
    viewListing: "Ver veículo",
    viewAll: "Ver todos os resultados",
    footer: "Você recebeu este e-mail porque ativou alertas no RSC Market.",
    priceLabel: "Preço",
  },
  en: {
    subject: (label, count) =>
      count === 1
        ? `New vehicle for "${label}" | RSC Market`
        : `${count} new vehicles for "${label}" | RSC Market`,
    greeting: (name) => `Hello${name ? `, ${name}` : ""}!`,
    intro: (label, count) =>
      count === 1
        ? `We found 1 new vehicle matching your saved search "${label}":`
        : `We found ${count} new vehicles matching your saved search "${label}":`,
    viewListing: "View vehicle",
    viewAll: "View all results",
    footer: "You received this email because you enabled alerts on RSC Market.",
    priceLabel: "Price",
  },
  es: {
    subject: (label, count) =>
      count === 1
        ? `Nuevo vehículo para "${label}" | RSC Market`
        : `${count} nuevos vehículos para "${label}" | RSC Market`,
    greeting: (name) => `Hola${name ? `, ${name}` : ""}!`,
    intro: (label, count) =>
      count === 1
        ? `Encontramos 1 vehículo nuevo compatible con tu búsqueda guardada "${label}":`
        : `Encontramos ${count} vehículos nuevos compatibles con tu búsqueda guardada "${label}":`,
    viewListing: "Ver vehículo",
    viewAll: "Ver todos los resultados",
    footer: "Recibiste este correo porque activaste alertas en RSC Market.",
    priceLabel: "Precio",
  },
};

export function resolveAlertEmailLocale(value: string | undefined): AlertEmailLocale {
  if (value === "en" || value === "es" || value === "pt") return value;
  return "pt";
}

export function getAlertEmailCopy(
  locale: string | undefined,
  vertical: SavedSearchVertical,
) {
  const resolved = resolveAlertEmailLocale(locale);
  return vertical === "vehicle" ? vehicleCopy[resolved] : propertyCopy[resolved];
}

export function formatAlertPrice(
  listing: PropertyListing | VehicleListing,
  locale: AlertEmailLocale,
) {
  const intlLocale =
    locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: listing.currency || "BRL",
    maximumFractionDigits: 0,
  }).format(listing.price);
}

function getAppUrl() {
  return (
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export function buildListingUrl(
  listingId: string,
  locale: AlertEmailLocale,
  vertical: SavedSearchVertical,
) {
  const segment = vertical === "vehicle" ? "veiculos" : "imoveis";
  return `${getAppUrl()}/${locale}/${segment}/${listingId}`;
}

export function buildSearchResultsUrl(
  searchQuery: string,
  locale: AlertEmailLocale,
  vertical: SavedSearchVertical,
) {
  const segment = vertical === "vehicle" ? "veiculos" : "imoveis";
  const qs = searchQuery ? `?${searchQuery}` : "";
  return `${getAppUrl()}/${locale}/${segment}${qs}`;
}

export function buildAlertEmailHtml(input: {
  locale: AlertEmailLocale;
  userName: string;
  searchLabel: string;
  vertical: SavedSearchVertical;
  listings: Array<PropertyListing | VehicleListing>;
  searchQuery: string;
}) {
  const t = getAlertEmailCopy(input.locale, input.vertical);
  const count = input.listings.length;
  const items = input.listings
    .slice(0, 10)
    .map((listing) => {
      const href = buildListingUrl(listing.id, input.locale, input.vertical);
      const price = formatAlertPrice(listing, input.locale);
      return `
        <li style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0 0 4px;font-weight:600;color:#111827;">${listing.title}</p>
          <p style="margin:0 0 8px;color:#6b7280;font-size:14px;">${listing.city}${listing.state ? `, ${listing.state}` : ""} · ${t.priceLabel}: ${price}</p>
          <a href="${href}" style="color:#1d4ed8;font-size:14px;text-decoration:none;">${t.viewListing} →</a>
        </li>
      `;
    })
    .join("");

  const viewAllHref = buildSearchResultsUrl(
    input.searchQuery,
    input.locale,
    input.vertical,
  );

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111827;">
      <p style="font-size:16px;">${t.greeting(input.userName)}</p>
      <p style="font-size:15px;line-height:1.5;">${t.intro(input.searchLabel, count)}</p>
      <ul style="list-style:none;padding:0;margin:24px 0;">${items}</ul>
      <p style="margin-top:24px;">
        <a href="${viewAllHref}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
          ${t.viewAll}
        </a>
      </p>
      <p style="margin-top:32px;font-size:12px;color:#9ca3af;">${t.footer}</p>
    </div>
  `.trim();
}

export function buildAlertEmailSubject(
  locale: string | undefined,
  searchLabel: string,
  count: number,
  vertical: SavedSearchVertical = "property",
) {
  return getAlertEmailCopy(locale, vertical).subject(searchLabel, count);
}
