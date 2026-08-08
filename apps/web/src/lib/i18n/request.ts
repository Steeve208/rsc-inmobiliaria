import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

function isObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Deep-merge so new locales can fall back to English for untranslated leaves. */
function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    if (isObject(current) && isObject(value)) {
      result[key] = deepMerge(current, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const en = (await import(`../../../messages/en.json`)).default as Messages;
  if (locale === "en") {
    return { locale, messages: en };
  }

  const localized = (await import(`../../../messages/${locale}.json`))
    .default as Messages;

  return {
    locale,
    messages: deepMerge(en, localized),
  };
});
