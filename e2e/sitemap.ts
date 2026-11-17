import sitemap from "../app/sitemap";
import { SITE_URL } from "../lib/site";

export type SitePage = {
  /** Path on the server under test, e.g. `/en/about/`. */
  path: string;
  /** Absolute production URL the page must declare as canonical. */
  url: string;
  locale: "en" | "es";
  /** hreflang codes the page must declare (from the sitemap alternates). */
  hreflangs: string[];
};

/**
 * Every public page, from the same function that serves /sitemap.xml.
 * Sitewide specs generate one test per entry, so new pages, posts and
 * landings are covered without editing tests.
 */
export const SITE_PAGES: SitePage[] = sitemap().map((entry) => {
  const path = entry.url.slice(SITE_URL.length) || "/";
  return {
    path,
    url: entry.url,
    locale: path.startsWith("/es/") ? "es" : "en",
    hreflangs: Object.keys(entry.alternates?.languages ?? {}),
  };
});
