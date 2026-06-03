import type { MetadataRoute } from "next";
import { SITE_URL, locales } from "@/lib/site";
import { serviceSlugs } from "@/lib/data/services";

export const dynamic = "force-static";

const STATIC_ROUTES = ["", "/about", "/services", "/contact", "/privacy", "/terms"] as const;

interface RouteConfig {
  route: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}

function getRouteConfig(route: string): RouteConfig {
  if (route === "") return { route, priority: 1.0, changeFrequency: "weekly" };
  if (route === "/privacy" || route === "/terms")
    return { route, priority: 0.5, changeFrequency: "monthly" };
  if (route === "/about" || route === "/services" || route === "/contact")
    return { route, priority: 0.8, changeFrequency: "weekly" };
  // For any other route (shouldn't happen for static routes, but safe fallback)
  return { route, priority: 0.5, changeFrequency: "weekly" };
}

function buildUrl(locale: string, path: string): string {
  return path === "" 
    ? `${SITE_URL}/${locale}` 
    : `${SITE_URL}/${locale}${path}`;
}

function buildAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [l, buildUrl(l, path)])
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static routes × 2 locales
  for (const route of STATIC_ROUTES) {
    const config = getRouteConfig(route);
    // Non-root routes get trailing slash
    const path = route === "" ? "" : `${route}/`;
    for (const locale of locales) {
      entries.push({
        url: buildUrl(locale, path),
        lastModified: now,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
        alternates: {
          languages: buildAlternates(path),
        },
      });
    }
  }

  // Service detail routes × 2 locales
  for (const slug of serviceSlugs) {
    const path = `/services/${slug}/`;
    for (const locale of locales) {
      entries.push({
        url: buildUrl(locale, path),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: {
          languages: buildAlternates(path),
        },
      });
    }
  }

  return entries;
}
