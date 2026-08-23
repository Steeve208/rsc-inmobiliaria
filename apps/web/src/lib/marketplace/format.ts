export function formatMarketplacePrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency || "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("pt-BR")}`;
  }
}

export function formatMileage(mileage: number, locale: string) {
  return `${new Intl.NumberFormat(locale).format(mileage)} km`;
}

export function listingLocation(parts: Array<string | null | undefined>) {
  return parts.filter((part) => Boolean(part?.trim())).join(", ");
}

export function formatCompactMoney(price: number, currency: string) {
  const symbol =
    currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "BRL" ? "R$" : "";
  if (price >= 1_000_000) {
    const value = price / 1_000_000;
    const digits = value >= 10 ? 0 : 1;
    return `${symbol}${value.toFixed(digits).replace(/\.0$/, "")}M`;
  }
  if (price >= 1_000) {
    return `${symbol}${Math.round(price / 1_000)}K`;
  }
  return `${symbol}${price}`;
}
