import { describe, it, expect } from "vitest";

// Import the default export from sitemap.ts — this file does NOT exist yet (RED phase)
import sitemap from "@/app/sitemap";

// Expected slugs from the actual codebase (lib/data/services.ts)
const EXPECTED_SERVICE_SLUGS = [
  "data-analysis",
  "business-intelligence",
  "machine-learning",
  "data-auditing",
  "digital-transformation",
  "process-automation",
] as const;

const EXPECTED_STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/contact",
  "/privacy",
  "/terms",
] as const;

const EXPECTED_LOCALES = ["en", "es"] as const;

describe("sitemap.ts — CRAWL-2", () => {
  let entries: ReturnType<typeof sitemap>;

  // Call sitemap() once and reuse; it's a pure function
  beforeAll(() => {
    entries = sitemap();
  });

  it("returns an array with at least 24 entries (12 static + 12 service detail)", () => {
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThanOrEqual(24);
  });

  it("each entry has url, lastModified, changeFrequency, and priority", () => {
    for (const entry of entries) {
      expect(entry.url).toBeDefined();
      expect(typeof entry.url).toBe("string");
      expect(entry.url).toMatch(/^https:\/\/shinetechdata\.com\//);

      expect(entry.lastModified).toBeDefined();
      expect(entry.lastModified).toBeInstanceOf(Date);

      expect(entry.changeFrequency).toBeDefined();
      expect([
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
      ]).toContain(entry.changeFrequency);

      expect(entry.priority).toBeDefined();
      expect(typeof entry.priority).toBe("number");
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    }
  });

  it("includes alternates for all entries with both language variants", () => {
    for (const entry of entries) {
      expect(entry.alternates).toBeDefined();
      expect(entry.alternates!.languages).toBeDefined();

      const languages = entry.alternates!.languages!;
      expect(languages).toHaveProperty("en");
      expect(languages).toHaveProperty("es");

      // Both URLs must be absolute
      expect(languages["en"]).toMatch(/^https:\/\/shinetechdata\.com\/en/);
      expect(languages["es"]).toMatch(/^https:\/\/shinetechdata\.com\/es/);
    }
  });

  it("includes all 6 static routes per locale", () => {
    for (const locale of EXPECTED_LOCALES) {
      for (const route of EXPECTED_STATIC_ROUTES) {
        const path = route === "" ? `/${locale}` : `/${locale}${route}/`;
        const expectedUrl = `https://shinetechdata.com${path}`;

        const found = entries.find((e) => e.url === expectedUrl);
        expect(
          found,
          `Missing static route: ${expectedUrl}`
        ).toBeDefined();
      }
    }
  });

  it("includes all 6 service detail routes per locale", () => {
    for (const locale of EXPECTED_LOCALES) {
      for (const slug of EXPECTED_SERVICE_SLUGS) {
        const path = `/${locale}/services/${slug}/`;
        const expectedUrl = `https://shinetechdata.com${path}`;

        const found = entries.find((e) => e.url === expectedUrl);
        expect(
          found,
          `Missing service detail route: ${expectedUrl}`
        ).toBeDefined();
      }
    }
  });

  it("assigns higher priority (1.0) to home page and lower (0.5) to legal pages", () => {
    const homeEn = entries.find(
      (e) => e.url === "https://shinetechdata.com/en"
    );
    const homeEs = entries.find(
      (e) => e.url === "https://shinetechdata.com/es"
    );
    const privacyEn = entries.find(
      (e) => e.url === "https://shinetechdata.com/en/privacy/"
    );
    const termsEn = entries.find(
      (e) => e.url === "https://shinetechdata.com/en/terms/"
    );

    expect(homeEn!.priority).toBe(1.0);
    expect(homeEs!.priority).toBe(1.0);
    expect(privacyEn!.priority).toBe(0.5);
    expect(termsEn!.priority).toBe(0.5);
  });

  it("uses appropriate changeFrequency (weekly for main pages, monthly for legal)", () => {
    const aboutEn = entries.find(
      (e) => e.url === "https://shinetechdata.com/en/about/"
    );
    const privacyEn = entries.find(
      (e) => e.url === "https://shinetechdata.com/en/privacy/"
    );

    expect(aboutEn!.changeFrequency).toBe("weekly");
    expect(privacyEn!.changeFrequency).toBe("monthly");
  });
});
