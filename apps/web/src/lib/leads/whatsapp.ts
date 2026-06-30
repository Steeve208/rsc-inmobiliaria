export function normalizeWhatsAppNumber(raw: string) {
  return raw.replace(/\D/g, "");
}

export function buildWhatsAppUrl(
  phone: string,
  message: string,
  listingTitle?: string,
) {
  const normalized = normalizeWhatsAppNumber(phone);
  if (!normalized) return null;

  const text = listingTitle
    ? `${message}\n\n${listingTitle}`
    : message;

  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
