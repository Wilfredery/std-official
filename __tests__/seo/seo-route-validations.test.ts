import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const OUT_DIR = resolve(process.cwd(), "out");
const SITE_URL = "https://shinetechdata.com";

interface RouteTestCase {
  path: string;
  description: string;
  expectedCanonical: string;
  expectedPriority: number;
  is404: boolean;
  isRoot: boolean;
}

const ROUTE_TESTS: RouteTestCase[] = [
  {
    path: resolve(OUT_DIR, "en", "index.html"),
    description: "English home page",
    expectedCanonical: `${SITE_URL}/en/`,
    expectedPriority: 1.0,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(OUT_DIR, "en", "about", "index.html"),
    description: "English about page",
    expectedCanonical: `${SITE_URL}/en/about/`,
    expectedPriority: 0.8,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(OUT_DIR, "en", "services", "index.html"),
    description: "English services listing",
    expectedCanonical: `${SITE_URL}/en/services/`,
    expectedPriority: 0.8,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(OUT_DIR, "en", "contact", "index.html"),
    description: "English contact page",
    expectedCanonical: `${SITE_URL}/en/contact/`,
    expectedPriority: 0.8,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(
      OUT_DIR,
      "en",
      "services",
      "data-analysis",
      "index.html"
    ),
    description: "Service detail page (data-analysis)",
    expectedCanonical: `${SITE_URL}/en/services/data-analysis/`,
    expectedPriority: 0.7,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(OUT_DIR, "en", "privacy", "index.html"),
    description: "English privacy page",
    expectedCanonical: `${SITE_URL}/en/privacy/`,
    expectedPriority: 0.5,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(OUT_DIR, "en", "terms", "index.html"),
    description: "English terms page",
    expectedCanonical: `${SITE_URL}/en/terms/`,
    expectedPriority: 0.5,
    is404: false,
    isRoot: false,
  },
  {
    path: resolve(OUT_DIR, "404.html"),
    description: "404 page",
    expectedCanonical: "",
    expectedPriority: 0,
    is404: true,
    isRoot: false,
  },
];

function parseHtml(filePath: string): Document {
  const html = readFileSync(filePath, "utf-8");
  const dom = new JSDOM(html);
  return dom.window.document;
}

function getCanonical(doc: Document): string | null {
  const link = doc.querySelector('link[rel="canonical"]');
  return link?.getAttribute("href") ?? null;
}

function getMetaContent(doc: Document, name: string): string | null {
  const meta = doc.querySelector(`meta[name="${name}"]`);
  return meta?.getAttribute("content") ?? null;
}

function getHreflangLinks(
  doc: Document
): Array<{ hreflang: string; href: string }> {
  const links = doc.querySelectorAll('link[rel="alternate"][hreflang]');
  return Array.from(links).map((link) => ({
    hreflang: link.getAttribute("hreflang")!,
    href: link.getAttribute("href")!,
  }));
}

function parseSitemapPriority(xml: string, targetUrl: string): number | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const urlElements = doc.querySelectorAll("url");
  for (const urlEl of Array.from(urlElements)) {
    const loc = urlEl.querySelector("loc")?.textContent;
    if (loc === targetUrl) {
      const priority = urlEl.querySelector("priority")?.textContent;
      return priority ? Number.parseFloat(priority) : null;
    }
  }
  return null;
}

describe("SEO route validations — trailing slashes", () => {
  for (const route of ROUTE_TESTS) {
    it(`${route.description}: canonical URL ends with trailing slash`, () => {
      if (route.is404) return; // 404 has no canonical

      const doc = parseHtml(route.path);
      const canonical = getCanonical(doc);
      expect(canonical).not.toBeNull();
      // All non-root canonical URLs should end with /
      if (!route.isRoot) {
        expect(canonical!.endsWith("/")).toBe(true);
      }
    });
  }
});

describe("SEO route validations — hreflang", () => {
  for (const route of ROUTE_TESTS) {
    it(`${route.description}: has both hreflang="en" and hreflang="es"`, () => {
      if (route.is404) return; // 404 has no hreflang

      const doc = parseHtml(route.path);
      const hreflangs = getHreflangLinks(doc);

      const enLinks = hreflangs.filter((hl) => hl.hreflang === "en");
      const esLinks = hreflangs.filter((hl) => hl.hreflang === "es");

      expect(enLinks.length).toBeGreaterThan(0);
      expect(esLinks.length).toBeGreaterThan(0);

      // URLs should be absolute
      for (const link of enLinks) {
        expect(link.href).toMatch(/^https:\/\/shinetechdata\.com\/en/);
      }
      for (const link of esLinks) {
        expect(link.href).toMatch(/^https:\/\/shinetechdata\.com\/es/);
      }
    });
  }
});

describe("SEO route validations — noindex rules", () => {
  it("404 page has noindex", () => {
    const doc = parseHtml(resolve(OUT_DIR, "404.html"));
    const robots = getMetaContent(doc, "robots");
    expect(robots).toBe("noindex");
  });

  it("public pages (home) do NOT have noindex", () => {
    const doc = parseHtml(resolve(OUT_DIR, "en", "index.html"));
    const robots = getMetaContent(doc, "robots");
    expect(robots).toBeNull();
  });

  it("public pages (about) do NOT have noindex", () => {
    const doc = parseHtml(resolve(OUT_DIR, "en", "about", "index.html"));
    const robots = getMetaContent(doc, "robots");
    expect(robots).toBeNull();
  });

  it("public pages (services listing) do NOT have noindex", () => {
    const doc = parseHtml(resolve(OUT_DIR, "en", "services", "index.html"));
    const robots = getMetaContent(doc, "robots");
    expect(robots).toBeNull();
  });

  it("public pages (contact) do NOT have noindex", () => {
    const doc = parseHtml(resolve(OUT_DIR, "en", "contact", "index.html"));
    const robots = getMetaContent(doc, "robots");
    expect(robots).toBeNull();
  });

  it("public pages (service detail) do NOT have noindex", () => {
    const doc = parseHtml(
      resolve(OUT_DIR, "en", "services", "data-analysis", "index.html")
    );
    const robots = getMetaContent(doc, "robots");
    expect(robots).toBeNull();
  });
});

describe("SEO route validations — sitemap priority consistency", () => {
  let sitemapXml: string;

  beforeAll(() => {
    sitemapXml = readFileSync(resolve(OUT_DIR, "sitemap.xml"), "utf-8");
  });

  it(`home page (en) has priority 1.0`, () => {
    const priority = parseSitemapPriority(sitemapXml, `${SITE_URL}/en`);
    expect(priority).toBe(1.0);
  });

  it(`about page has priority 0.8`, () => {
    const priority = parseSitemapPriority(
      sitemapXml,
      `${SITE_URL}/en/about/`
    );
    expect(priority).toBe(0.8);
  });

  it(`services listing has priority 0.8`, () => {
    const priority = parseSitemapPriority(
      sitemapXml,
      `${SITE_URL}/en/services/`
    );
    expect(priority).toBe(0.8);
  });

  it(`contact page has priority 0.8`, () => {
    const priority = parseSitemapPriority(
      sitemapXml,
      `${SITE_URL}/en/contact/`
    );
    expect(priority).toBe(0.8);
  });

  it(`service detail page has priority 0.7`, () => {
    const priority = parseSitemapPriority(
      sitemapXml,
      `${SITE_URL}/en/services/data-analysis/`
    );
    expect(priority).toBe(0.7);
  });

  it(`privacy page has priority 0.5`, () => {
    const priority = parseSitemapPriority(
      sitemapXml,
      `${SITE_URL}/en/privacy/`
    );
    expect(priority).toBe(0.5);
  });

  it(`terms page has priority 0.5`, () => {
    const priority = parseSitemapPriority(
      sitemapXml,
      `${SITE_URL}/en/terms/`
    );
    expect(priority).toBe(0.5);
  });
});

// Graceful skip if build output missing
if (!existsSync(OUT_DIR)) {
  console.warn("out/ directory not found — skipping SEO route validations");
  describe.skip("SEO route validations", () => {});
}
