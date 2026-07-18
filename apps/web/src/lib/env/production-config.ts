const LOG_PREFIX = "[production-config]";

export type EnvWarning = {
  variable: string;
  feature: string;
  message: string;
};

function isProductionRuntime() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

function isSet(value: string | undefined) {
  return Boolean(value?.trim());
}

export function getAppUrl() {
  return (
    process.env.BETTER_AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    "http://localhost:3001"
  );
}

export function isResendConfigured() {
  return isSet(process.env.RESEND_API_KEY);
}

export function isAdminReportEmailConfigured() {
  return isResendConfigured() && isSet(process.env.ADMIN_NOTIFY_EMAIL);
}

export function isSupabaseStorageConfigured() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  return isSet(url) && isSet(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isCronConfigured() {
  return isSet(process.env.CRON_SECRET);
}

export function getProductionEnvWarnings(options?: {
  assumeProduction?: boolean;
}): EnvWarning[] {
  const warnings: EnvWarning[] = [];

  const production =
    options?.assumeProduction ??
    (process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL));

  if (!production) {
    return warnings;
  }

  if (!isSet(process.env.DATABASE_URL) && !isSet(process.env.POSTGRES_URL)) {
    warnings.push({
      variable: "DATABASE_URL",
      feature: "database",
      message: "Database connection is not configured. The app cannot persist data.",
    });
  }

  if (!isSet(process.env.BETTER_AUTH_SECRET)) {
    warnings.push({
      variable: "BETTER_AUTH_SECRET",
      feature: "auth",
      message: "Session signing secret is missing. Authentication will fail.",
    });
  }

  if (
    isProductionRuntime() &&
    !process.env.NEXT_PUBLIC_APP_URL?.trim() &&
    !process.env.BETTER_AUTH_URL?.trim() &&
    !process.env.VERCEL_URL?.trim()
  ) {
    warnings.push({
      variable: "NEXT_PUBLIC_APP_URL / BETTER_AUTH_URL",
      feature: "auth",
      message: "Public app URL is not set. OAuth callbacks and email links may break.",
    });
  }

  if (!isResendConfigured()) {
    warnings.push({
      variable: "RESEND_API_KEY",
      feature: "email",
      message:
        "Outbound mail is skipped (logged only): verification, password reset, and saved-search alerts. Email verification will not block sign-in until RESEND_API_KEY is set.",
    });
  } else if (!isSet(process.env.RESEND_FROM_EMAIL)) {
    warnings.push({
      variable: "RESEND_FROM_EMAIL",
      feature: "email",
      message:
        "Using Resend sandbox sender. Set a verified domain sender for production deliverability.",
    });
  }

  if (isResendConfigured() && !isSet(process.env.ADMIN_NOTIFY_EMAIL)) {
    warnings.push({
      variable: "ADMIN_NOTIFY_EMAIL",
      feature: "moderation",
      message:
        "Listing report notifications will not be emailed (reports are still stored).",
    });
  } else if (!isResendConfigured() && isSet(process.env.ADMIN_NOTIFY_EMAIL)) {
    warnings.push({
      variable: "RESEND_API_KEY",
      feature: "moderation",
      message:
        "ADMIN_NOTIFY_EMAIL is set but RESEND_API_KEY is missing; report emails will not send.",
    });
  }

  if (!isSupabaseStorageConfigured()) {
    warnings.push({
      variable: "NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY",
      feature: "listing-media",
      message:
        'Media uploads will use ephemeral local storage. Configure Supabase and create the "listing-media" bucket for production.',
    });
  }

  if (!isCronConfigured()) {
    warnings.push({
      variable: "CRON_SECRET",
      feature: "cron",
      message:
        "Saved-search alert cron is disabled until CRON_SECRET is set and Vercel Cron is configured.",
    });
  }

  if (!isSet(process.env.MARKET_INTERNAL_API_SECRET)) {
    warnings.push({
      variable: "MARKET_INTERNAL_API_SECRET",
      feature: "backoffice-sync",
      message:
        "Backoffice → market company chat replies require MARKET_INTERNAL_API_SECRET (same value in both apps).",
    });
  }

  if (
    !isSet(process.env.NEXT_PUBLIC_BACKOFFICE_URL) &&
    !isSet(process.env.NEXT_PUBLIC_API_URL)
  ) {
    warnings.push({
      variable: "NEXT_PUBLIC_BACKOFFICE_URL",
      feature: "backoffice-api",
      message:
        "Marketplace listings/registration will fall back to the default backoffice URL. Set NEXT_PUBLIC_BACKOFFICE_URL explicitly.",
    });
  }

  if (!isSet(process.env.GOOGLE_CLIENT_ID) || !isSet(process.env.GOOGLE_CLIENT_SECRET)) {
    warnings.push({
      variable: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET",
      feature: "auth",
      message: 'Google sign-in is disabled. Set both variables to enable "Continue with Google".',
    });
  }

  if (!isSet(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)) {
    warnings.push({
      variable: "NEXT_PUBLIC_MAPBOX_TOKEN",
      feature: "maps",
      message: "Interactive maps will show a placeholder until Mapbox is configured.",
    });
  }

  return warnings;
}

let startupWarningsLogged = false;

export function logProductionEnvWarnings(context = "startup") {
  if (startupWarningsLogged && context === "startup") return;

  const warnings = getProductionEnvWarnings();
  if (warnings.length === 0) {
    if (isProductionRuntime()) {
      console.info(`${LOG_PREFIX} All production integrations look configured (${context}).`);
    }
    startupWarningsLogged = true;
    return;
  }

  console.warn(
    `${LOG_PREFIX} ${warnings.length} production configuration warning(s) (${context}):`,
  );
  for (const warning of warnings) {
    console.warn(
      `${LOG_PREFIX} [${warning.feature}] ${warning.variable}: ${warning.message}`,
    );
  }

  startupWarningsLogged = true;
}

export function logMissingEnvOnce(
  key: string,
  feature: string,
  message: string,
) {
  const cacheKey = `${feature}:${key}`;
  const cache = logMissingEnvOnce as typeof logMissingEnvOnce & {
    _logged?: Set<string>;
  };
  if (!cache._logged) cache._logged = new Set();
  if (cache._logged.has(cacheKey)) return;
  cache._logged.add(cacheKey);
  console.warn(`${LOG_PREFIX} [${feature}] ${key}: ${message}`);
}
