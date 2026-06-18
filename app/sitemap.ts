import type { MetadataRoute } from "next";
import { serviceSlugs } from "@/lib/data/services";
import { locales, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// ── Type & Lookup Tables ────────────────────────────────────────────

type PageType = "home" | "services" | "service" | "about" | "contact" | "legal";

const PRIORITY: Record<PageType, number> = {
  home: 1.0,
  services: 0.9,
  service: 0.8,
  about: 0.8,
  contact: 0.7,
  legal: 0.5,
};

const CHANGEFREQ: Record<PageType, "weekly" | "monthly" | "yearly"> = {
  home: "weekly",
  services: "weekly",
  service: "monthly",
  about: "monthly",
  contact: "monthly",
  legal: "yearly",
};

// ── Helpers ─────────────────────────────────────────────────────────

/** Build a full absolute URL for a given locale + path (always trailing `/`). */
function buildLocaleUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

/** Assemble a single sitemap <url> entry. */
function buildEntry(
  url: string,
  localeVersions: Record<string, string>,
  pageType: PageType,
  lastmod: Date,
): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: lastmod,
    changeFrequency: CHANGEFREQ[pageType],
    priority: PRIORITY[pageType],
    alternates: { languages: localeVersions },
  };
}

// ── Generators ──────────────────────────────────────────────────────

interface StaticRoute {
  path: string;
  type: PageType;
}

function generateStaticEntries(lastmod: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  const routes: StaticRoute[] = [
    { path: "/", type: "home" },
    { path: "/services/", type: "services" },
    { path: "/about/", type: "about" },
    { path: "/contact/", type: "contact" },
    { path: "/terms/", type: "legal" },
    { path: "/privacy/", type: "legal" },
  ];

  for (const route of routes) {
    for (const locale of locales) {
      const url = buildLocaleUrl(locale, route.path);
      const localeVersions: Record<string, string> = {};
      for (const l of locales) {
        localeVersions[l] = buildLocaleUrl(l, route.path);
      }
      entries.push(buildEntry(url, localeVersions, route.type, lastmod));
    }
  }

  return entries;
}

function generateServiceEntries(lastmod: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const slug of serviceSlugs) {
    for (const locale of locales) {
      const path = `/services/${slug}/`;
      const url = buildLocaleUrl(locale, path);
      const localeVersions: Record<string, string> = {};
      for (const l of locales) {
        localeVersions[l] = buildLocaleUrl(l, path);
      }
      entries.push(buildEntry(url, localeVersions, "service", lastmod));
    }
  }

  return entries;
}

// ── Default Export ──────────────────────────────────────────────────

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date();
  return [...generateStaticEntries(lastmod), ...generateServiceEntries(lastmod)];
}
