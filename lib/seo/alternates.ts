import { SITE_URL, locales } from "@/lib/site";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * hreflang alternates for a locale-agnostic path (e.g. `/services/`):
 * one entry per locale plus `x-default` pointing at the default locale.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  );
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${path}`;
  return languages;
}
