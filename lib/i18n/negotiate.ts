import { routing } from "./routing";

/**
 * Pick the best supported locale from an `Accept-Language` header.
 * Matches on the base language (`es-DO` → `es`), honours q-values,
 * and falls back to the default locale.
 */
export function negotiateLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return routing.defaultLocale;

  const supported: readonly string[] = routing.locales;

  const match = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { lang: tag.trim().toLowerCase().split("-")[0], q, index };
    })
    .filter((entry) => entry.lang && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
    .find((entry) => supported.includes(entry.lang));

  return match ? match.lang : routing.defaultLocale;
}
