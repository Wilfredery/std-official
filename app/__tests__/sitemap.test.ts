import { describe, it, expect, vi } from "vitest";

// Freeze time for deterministic lastModified across all tests.
// `vi.hoisted` runs BEFORE module imports, so this is effective
// for `new Date()` calls inside the sitemap module.
vi.hoisted(() => vi.setSystemTime(new Date("2026-06-17")));

// This import WILL fail because app/sitemap.ts does not exist yet — that IS the RED.
import sitemap from "@/app/sitemap";

describe("sitemap.ts", () => {
  it("generates exactly 24 <url> entries (REQ-2)", () => {
    const entries = sitemap();

    // 6 static routes × 2 locales = 12
    // 6 service slugs × 2 locales = 12
    // Total: 24
    expect(entries).toHaveLength(24);
  });

  it("every URL ends with a trailing slash (REQ-2.3)", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0); // prove we have entries
    for (const entry of entries) {
      expect(entry.url).toMatch(/\/$/);
    }
  });

  it("every entry has exactly 2 hreflang alternates: en + es (REQ-3)", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const langs = entry.alternates?.languages;
      expect(langs).toBeDefined();
      const keys = Object.keys(langs!);
      expect(keys).toHaveLength(2);
      expect(keys).toContain("en");
      expect(keys).toContain("es");
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

  it("all entries have lastModified set to the mocked build date", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0);
    const expectedDate = new Date("2026-06-17");
    for (const entry of entries) {
      expect(entry.lastModified).toBeDefined();
      // lastModified may be Date or string — normalize
      const asDate = entry.lastModified instanceof Date
        ? entry.lastModified
        : new Date(entry.lastModified as string);
      expect(asDate.toISOString().slice(0, 10)).toBe(
        expectedDate.toISOString().slice(0, 10)
      );
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
});
