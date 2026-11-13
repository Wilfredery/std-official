import { SITE_URL, locales } from "@/lib/site";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * hreflang alternates for a locale-agnostic path (e.g. `/services/`):
 * one entry per locale plus `x-default`.
 *
 * For the home page `x-default` is the root `/`, which redirects by
 * Accept-Language — Google's recommended pattern for auto-redirecting
 * homepages. Without it Google picks the root as canonical for `/en/`
 * (the root 307-redirects Googlebot there). Other pages have no neutral
 * URL, so `x-default` falls back to the default locale.
 */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  );
  languages["x-default"] =
    path === "/" ? `${SITE_URL}/` : `${SITE_URL}/${defaultLocale}${path}`;
  return languages;
}
