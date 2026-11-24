import { describe, it, expect, vi } from "vitest";

// Freeze time for deterministic lastModified across all tests.
// `vi.hoisted` runs BEFORE module imports, so this is effective
// for `new Date()` calls inside the sitemap module.
vi.hoisted(() => vi.setSystemTime(new Date("2026-06-17")));

// This import WILL fail because app/sitemap.ts does not exist yet — that IS the RED.
import sitemap from "@/app/sitemap";
import { PAGES_UPDATED_AT, SITE_URL } from "@/lib/site";
import { blogPosts } from "@/lib/data/blog";
import { landings } from "@/lib/data/landings";

const isLanding = (url: string) =>
  landings.some((l) => url.endsWith(`/${l.locale}/${l.slug}/`));

describe("sitemap.ts", () => {
  it("generates exactly 26 + blog post + landing <url> entries (REQ-2)", () => {
    const entries = sitemap();

    // 7 static routes (incl. /blog/) × 2 locales = 14
    // 6 service slugs × 2 locales = 12
    // N blog posts × 2 locales
    // M single-locale landings × 1 locale
    expect(entries).toHaveLength(26 + blogPosts.length * 2 + landings.length);
  });

  it("every URL ends with a trailing slash (REQ-2.3)", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0); // prove we have entries
    for (const entry of entries) {
      expect(entry.url).toMatch(/\/$/);
    }
  });

  it("every bilingual entry has hreflang alternates: en + es + x-default (REQ-3)", () => {
    const entries = sitemap().filter((e) => !isLanding(e.url));

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const langs = entry.alternates?.languages;
      expect(langs).toBeDefined();
      const keys = Object.keys(langs!);
      expect(keys).toHaveLength(3);
      expect(keys).toContain("en");
      expect(keys).toContain("es");
      const isHome = /\/(en|es)\/$/.test(entry.url);
      expect(langs!["x-default"]).toBe(isHome ? `${SITE_URL}/` : langs!["en"]);
    }
  });

  it("hreflang alternates include self-reference (REQ-3.2)", () => {
    const entries = sitemap();

    const esEntries = entries.filter((e) => e.url.includes("/es/"));
    expect(esEntries.length).toBeGreaterThan(0);

    for (const entry of esEntries) {
      const langs = entry.alternates?.languages;
      expect(langs?.["es"]).toBe(entry.url); // self-reference
    }
  });

  it("home page entries have priority 1.0 (REQ-4.1)", () => {
    const entries = sitemap();

    // Home pages: URL ends with locale only (e.g., /en/, /es/)
    const homeEntries = entries.filter(
      (e) =>
        (e.url.endsWith("/en/") || e.url.endsWith("/es/"))
    );
    expect(homeEntries).toHaveLength(2);
    for (const entry of homeEntries) {
      expect(entry.priority).toBe(1.0);
    }
  });

  it("legal pages (terms, privacy) have priority 0.5 (REQ-4.2)", () => {
    const entries = sitemap();

    const legalEntries = entries.filter(
      (e) => e.url.includes("/terms/") || e.url.includes("/privacy/")
    );
    expect(legalEntries.length).toBeGreaterThanOrEqual(2);
    for (const entry of legalEntries) {
      expect(entry.priority).toBe(0.5);
    }
  });

  it("service detail and about pages have priority 0.8 (REQ-4.3)", () => {
    const entries = sitemap();

    // Service-detail: url contains /services/{slug}/
    const serviceDetailEntries = entries.filter(
      (e) => /\/services\/[^/]+\/$/.test(e.url)
    );
    expect(serviceDetailEntries.length).toBeGreaterThan(0);
    for (const entry of serviceDetailEntries) {
      expect(entry.priority).toBe(0.8);
    }

    // About: url contains /about/
    const aboutEntries = entries.filter((e) => e.url.includes("/about/"));
    expect(aboutEntries.length).toBeGreaterThan(0);
    for (const entry of aboutEntries) {
      expect(entry.priority).toBe(0.8);
    }
  });

  it("lastModified never uses the build time", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.lastModified).toBeDefined();
      expect(String(entry.lastModified)).not.toBe("2026-06-17");
    }
  });

  it("blog posts use their own updatedAt/publishedAt as lastModified", () => {
    const entries = sitemap();

    for (const post of blogPosts) {
      const postEntries = entries.filter((e) => e.url.includes(`/blog/${post.slug}/`));
      expect(postEntries).toHaveLength(2);
      for (const entry of postEntries) {
        expect(entry.lastModified).toBe(post.updatedAt ?? post.publishedAt);
      }
    }
  });

  it("static and service pages use PAGES_UPDATED_AT as lastModified", () => {
    const entries = sitemap();

    const pageEntries = entries.filter(
      (e) => !/\/blog\/[^/]+\/$/.test(e.url) && !isLanding(e.url),
    );
    expect(pageEntries.length).toBe(26);
    for (const entry of pageEntries) {
      expect(entry.lastModified).toBe(PAGES_UPDATED_AT);
    }
  });

  it("includes entries for all 6 service slugs from real data", () => {
    const entries = sitemap();

    const slugs = [
      "data-analysis",
      "business-intelligence",
      "machine-learning",
      "data-auditing",
      "digital-transformation",
      "process-automation",
    ];

    for (const slug of slugs) {
      const matching = entries.filter((e) =>
        e.url.includes(`/services/${slug}/`)
      );
      // Each slug should appear in both locales = 2 entries
      expect(matching).toHaveLength(2);
    }
  });

  it("includes static routes: home, services-list, about, contact, terms, privacy", () => {
    const entries = sitemap();

    // Home: URL ends with /{locale}/ (e.g., .../en/, .../es/)
    const homeEntries = entries.filter(
      (e) => e.url.endsWith("/en/") || e.url.endsWith("/es/")
    );
    expect(homeEntries).toHaveLength(2);

    // Other static routes: URL ends with /services/ but NOT /services/{slug}/
    const staticRouteSuffixes = [
      "/services/",
      "/about/",
      "/contact/",
      "/terms/",
      "/privacy/",
    ];
    for (const suffix of staticRouteSuffixes) {
      const matching = entries.filter((e) => e.url.endsWith(suffix));
      // Each static route appears in both locales = 2 entries
      expect(matching).toHaveLength(2);
    }
  });

  it("assigns correct changeFrequency per page type (REQ-5)", () => {
    const entries = sitemap();

    const byUrl = (suffix: string) =>
      entries.filter((e) => e.url.endsWith(suffix));

    // Home → weekly
    for (const entry of byUrl("/en/").concat(byUrl("/es/"))) {
      expect(entry.changeFrequency).toBe("weekly");
    }

    // Services list → weekly
    for (const entry of byUrl("/services/")) {
      expect(entry.changeFrequency).toBe("weekly");
    }

    // About → monthly
    for (const entry of byUrl("/about/")) {
      expect(entry.changeFrequency).toBe("monthly");
    }

    // Contact → monthly
    for (const entry of byUrl("/contact/")) {
      expect(entry.changeFrequency).toBe("monthly");
    }

    // Legal → yearly
    for (const entry of byUrl("/terms/").concat(byUrl("/privacy/"))) {
      expect(entry.changeFrequency).toBe("yearly");
    }

    // Service detail → monthly
    const serviceDetailEntries = entries.filter(
      (e) => /\/services\/[^/]+\/$/.test(e.url)
    );
    expect(serviceDetailEntries.length).toBeGreaterThan(0);
    for (const entry of serviceDetailEntries) {
      expect(entry.changeFrequency).toBe("monthly");
    }
  });

  describe("single-locale landings", () => {
    it("lists exactly one URL per landing, in its own locale", () => {
      const entries = sitemap();

      for (const landing of landings) {
        const matching = entries.filter((e) => e.url.includes(landing.slug));
        expect(matching).toHaveLength(1);
        expect(matching[0].url).toBe(`${SITE_URL}/${landing.locale}/${landing.slug}/`);
      }
      expect(landings.map((l) => l.slug)).toEqual([
        "consultoria-de-datos-republica-dominicana",
        "consultor-power-bi-republica-dominicana",
        "business-intelligence-for-local-government",
      ]);
    });

    it("has only a self-referencing alternate in its locale (no x-default)", () => {
      const entries = sitemap().filter((e) => isLanding(e.url));

      expect(entries).toHaveLength(landings.length);
      for (const landing of landings) {
        const entry = entries.find((e) => e.url.endsWith(`/${landing.slug}/`))!;
        expect(entry.alternates?.languages).toEqual({ [landing.locale]: entry.url });
      }
    });

    it("uses priority 0.8, monthly and each landing's lastmod", () => {
      const entries = sitemap().filter((e) => isLanding(e.url));

      for (const landing of landings) {
        const entry = entries.find((e) => e.url.endsWith(`/${landing.slug}/`))!;
        expect(entry.priority).toBe(0.8);
        expect(entry.changeFrequency).toBe("monthly");
        expect(entry.lastModified).toBe(landing.updatedAt);
        expect(entry.url).toMatch(/\/$/);
      }
    });
  });
});
