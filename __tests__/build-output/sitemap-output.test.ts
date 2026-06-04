import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SITEMAP_PATH = resolve(process.cwd(), "out", "sitemap.xml");
const SITE_URL = "https://shinetechdata.com";

const VALID_CHANGEFREQ = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

const EXPECTED_SERVICE_SLUGS = [
  "data-analysis",
  "business-intelligence",
  "machine-learning",
  "data-auditing",
  "digital-transformation",
  "process-automation",
] as const;

const EXPECTED_LOCALES = ["en", "es"] as const;

function parseSitemap(xml: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error(`XML parse error: ${parseError.textContent}`);
  }
  return doc;
}

describe("out/sitemap.xml — build output verification", () => {
  let doc: Document;
  let urlElements: Element[];

  beforeAll(() => {
    const xml = readFileSync(SITEMAP_PATH, "utf-8");
    doc = parseSitemap(xml);
    urlElements = Array.from(doc.querySelectorAll("url"));
  });

  it("parses as valid XML without parser errors", () => {
    const parseError = doc.querySelector("parsererror");
    expect(parseError).toBeNull();
  });

  it("has exactly 24 <url> entries (12 static routes + 12 service detail)", () => {
    expect(urlElements.length).toBe(24);
  });

  it("each entry has <loc> with absolute SITE_URL", () => {
    for (let i = 0; i < urlElements.length; i++) {
      const loc = urlElements[i].querySelector("loc");
      expect(
        loc,
        `entry ${i + 1}: missing <loc>`
      ).not.toBeNull();
      expect(
        loc!.textContent,
        `entry ${i + 1}: invalid URL`
      ).toMatch(/^https:\/\/shinetechdata\.com\//);
    }
  });

  it("each entry has <xhtml:link rel=\"alternate\" hreflang=\"en\">", () => {
    for (let i = 0; i < urlElements.length; i++) {
      const enLink = urlElements[i].querySelector(
        'link[rel="alternate"][hreflang="en"]'
      );
      expect(
        enLink,
        `entry ${i + 1}: missing hreflang="en"`
      ).not.toBeNull();
      expect(
        enLink!.getAttribute("href"),
        `entry ${i + 1}: en href not absolute`
      ).toMatch(/^https:\/\/shinetechdata\.com\/en/);
    }
  });

  it("each entry has <xhtml:link rel=\"alternate\" hreflang=\"es\">", () => {
    for (let i = 0; i < urlElements.length; i++) {
      const esLink = urlElements[i].querySelector(
        'link[rel="alternate"][hreflang="es"]'
      );
      expect(
        esLink,
        `entry ${i + 1}: missing hreflang="es"`
      ).not.toBeNull();
      expect(
        esLink!.getAttribute("href"),
        `entry ${i + 1}: es href not absolute`
      ).toMatch(/^https:\/\/shinetechdata\.com\/es/);
    }
  });

  it("each entry has valid ISO date <lastmod>", () => {
    for (let i = 0; i < urlElements.length; i++) {
      const lastmod = urlElements[i].querySelector("lastmod");
      expect(
        lastmod,
        `entry ${i + 1}: missing <lastmod>`
      ).not.toBeNull();
      const dateStr = lastmod!.textContent!;
      const date = new Date(dateStr);
      expect(
        date.getTime(),
        `entry ${i + 1}: invalid date "${dateStr}"`
      ).not.toBeNaN();
    }
  });

  it("each entry has valid <changefreq>", () => {
    for (let i = 0; i < urlElements.length; i++) {
      const changefreq = urlElements[i].querySelector("changefreq");
      expect(
        changefreq,
        `entry ${i + 1}: missing <changefreq>`
      ).not.toBeNull();
      expect(
        VALID_CHANGEFREQ,
        `entry ${i + 1}: invalid changefreq "${changefreq!.textContent}"`
      ).toContain(changefreq!.textContent as never);
    }
  });

  it("each entry has <priority> between 0.0 and 1.0", () => {
    for (let i = 0; i < urlElements.length; i++) {
      const priority = urlElements[i].querySelector("priority");
      expect(
        priority,
        `entry ${i + 1}: missing <priority>`
      ).not.toBeNull();
      const value = Number.parseFloat(priority!.textContent!);
      expect(
        value,
        `entry ${i + 1}: priority ${value} < 0`
      ).toBeGreaterThanOrEqual(0);
      expect(
        value,
        `entry ${i + 1}: priority ${value} > 1`
      ).toBeLessThanOrEqual(1);
    }
  });

  it("includes all service detail routes per locale", () => {
    for (const locale of EXPECTED_LOCALES) {
      for (const slug of EXPECTED_SERVICE_SLUGS) {
        const path = `${SITE_URL}/${locale}/services/${slug}/`;
        const found = urlElements.find(
          (el) => el.querySelector("loc")?.textContent === path
        );
        expect(found, `Missing sitemap entry: ${path}`).toBeDefined();
      }
    }
  });

  it("has home page entries for both locales", () => {
    const homeEn = urlElements.find(
      (el) => el.querySelector("loc")?.textContent === `${SITE_URL}/en`
    );
    const homeEs = urlElements.find(
      (el) => el.querySelector("loc")?.textContent === `${SITE_URL}/es`
    );
    expect(homeEn, "Missing /en sitemap entry").toBeDefined();
    expect(homeEs, "Missing /es sitemap entry").toBeDefined();
  });
});

// Graceful skip if build output missing
if (!existsSync(SITEMAP_PATH)) {
  console.warn("out/sitemap.xml not found — skipping build output verification");
  describe.skip("out/sitemap.xml — build output verification", () => {});
}
