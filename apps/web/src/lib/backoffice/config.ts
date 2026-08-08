/** Marketplace listings API + company portal (same host in production). */
const PRODUCTION_BACKOFFICE_URL = "https://portal.reeskova.com";
/** Public company login (custom domain). */
const PRODUCTION_PORTAL_LOGIN_URL = "https://portal.reeskova.com";

export function getBackofficeBaseUrl(): string | null {
  const configured =
    process.env.NEXT_PUBLIC_BACKOFFICE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";

  if (configured) return configured.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    // Prefer the live portal catalog in local market when env is unset.
    return PRODUCTION_BACKOFFICE_URL;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_BACKOFFICE_URL;
  }

  return null;
}

export function isBackofficeConfigured(): boolean {
  return Boolean(getBackofficeBaseUrl());
}

export function isBackofficeExplicitlyConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_BACKOFFICE_URL?.trim() ||
      process.env.NEXT_PUBLIC_API_URL?.trim(),
  );
}

/** Company portal login — always the public portal host when configured. */
export function getBackofficeLoginUrl(locale = "es"): string {
  const portalBase =
    process.env.NEXT_PUBLIC_BACKOFFICE_PORTAL_URL?.trim() ||
    PRODUCTION_PORTAL_LOGIN_URL;
  const base = portalBase.replace(/\/$/, "");
  const lang = locale.trim() || "es";
  return `${base}/${lang}/auth/login`;
}

export function getBackofficeRegistrationUrl(): string | null {
  const base = getBackofficeBaseUrl();
  if (!base) return null;
  return `${base}/api/marketplace/v1/registration-requests`;
}
