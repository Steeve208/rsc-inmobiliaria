const PRODUCTION_BACKOFFICE_URL = "https://reeskco.vercel.app";

export function getBackofficeBaseUrl(): string | null {
  const configured =
    process.env.NEXT_PUBLIC_BACKOFFICE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";

  if (configured) return configured.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    // Local backoffice default; override with NEXT_PUBLIC_BACKOFFICE_URL.
    return "http://localhost:3000";
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

export function getBackofficeLoginUrl(locale = "pt"): string | null {
  const base = getBackofficeBaseUrl();
  if (!base) return null;
  return `${base}/${locale}/auth/login`;
}

export function getBackofficeRegistrationUrl(): string | null {
  const base = getBackofficeBaseUrl();
  if (!base) return null;
  return `${base}/api/marketplace/v1/registration-requests`;
}
