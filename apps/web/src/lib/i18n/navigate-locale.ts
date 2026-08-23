import { getPathname } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/markets/types";

/**
 * Hard-navigate to the same path in another locale.
 * Soft `router.replace(..., { locale })` can leave the URL on the old prefix.
 */
export function navigateToLocale(pathname: string, locale: Locale) {
  const href = getPathname({
    href: pathname || "/",
    locale,
    forcePrefix: true,
  });
  const search =
    typeof window !== "undefined" ? window.location.search : "";
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  window.location.assign(`${href}${search}${hash}`);
}
