export function getBackofficeBaseUrl(): string | null {
  const base =
    process.env.NEXT_PUBLIC_BACKOFFICE_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";

  return base ? base.replace(/\/$/, "") : null;
}

export function isBackofficeConfigured(): boolean {
  return Boolean(getBackofficeBaseUrl());
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
