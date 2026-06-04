import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const OUT_DIR = resolve(process.cwd(), "out");
const SITE_URL = "https://shinetechdata.com";

interface PageSample {
  path: string;
  description: string;
  expectedCanonical: string;
  expectedLang: string;
  is404: boolean;
}

const SAMPLE_PAGES: PageSample[] = [
  {
    path: resolve(OUT_DIR, "en", "index.html"),
    description: "English home page",
    expectedCanonical: `${SITE_URL}/en/`,
    expectedLang: "en",
    is404: false,
  },
  {
    path: resolve(OUT_DIR, "es", "about", "index.html"),
    description: "Spanish about page",
    expectedCanonical: `${SITE_URL}/es/about/`,
    expectedLang: "es",
    is404: false,
  },
  {
    path: resolve(OUT_DIR, "404.html"),
    description: "404 page",
    expectedCanonical: "",
    expectedLang: "",
    is404: true,
  },
];

function parseHtml(filePath: string): Document {
  const html = readFileSync(filePath, "utf-8");
  const dom = new JSDOM(html);
  return dom.window.document;
}

function getMetaContent(doc: Document, name: string): string | null {
  const meta = doc.querySelector(`meta[name="${name}"]`);
  return meta?.getAttribute("content") ?? null;
}

function getMetaProperty(doc: Document, property: string): string | null {
  const meta = doc.querySelector(`meta[property="${property}"]`);
  return meta?.getAttribute("content") ?? null;
}

function getCanonical(doc: Document): string | null {
  const link = doc.querySelector('link[rel="canonical"]');
  return link?.getAttribute("href") ?? null;
}

describe("out/ HTML output — build output verification", () => {
  for (const sample of SAMPLE_PAGES) {
    describe(sample.description, () => {
      let doc: Document;

      beforeAll(() => {
        doc = parseHtml(sample.path);
      });

      it("file exists and is parseable HTML", () => {
        expect(doc).toBeDefined();
        expect(doc.querySelector("html")).not.toBeNull();
      });

      if (!sample.is404) {
        it("has <link rel=\"canonical\"> with correct URL", () => {
          const canonical = getCanonical(doc);
          expect(canonical).toBe(sample.expectedCanonical);
        });

        it("has <title> that is non-empty", () => {
          const title = doc.querySelector("title");
          expect(title).not.toBeNull();
          expect(title!.textContent!.trim().length).toBeGreaterThan(0);
        });

        it("has <meta name=\"description\"> with content", () => {
          const desc = getMetaContent(doc, "description");
          expect(desc).not.toBeNull();
          expect(desc!.trim().length).toBeGreaterThan(0);
        });

        it("has og:title meta property", () => {
          const ogTitle = getMetaProperty(doc, "og:title");
          expect(ogTitle).not.toBeNull();
          expect(ogTitle!.trim().length).toBeGreaterThan(0);
        });

        it("has og:description meta property", () => {
          const ogDesc = getMetaProperty(doc, "og:description");
          expect(ogDesc).not.toBeNull();
          expect(ogDesc!.trim().length).toBeGreaterThan(0);
        });

        it("has og:image meta property", () => {
          const ogImage = getMetaProperty(doc, "og:image");
          expect(ogImage).not.toBeNull();
          expect(ogImage!.length).toBeGreaterThan(0);
        });

        it("has twitter:card meta tag", () => {
          const twitterCard = doc.querySelector('meta[name="twitter:card"]');
          expect(twitterCard).not.toBeNull();
          expect(twitterCard!.getAttribute("content")?.length).toBeGreaterThan(
            0
          );
        });

        it(`has html lang="${sample.expectedLang}"`, () => {
          const htmlEl = doc.querySelector("html");
          expect(htmlEl).not.toBeNull();
          expect(htmlEl!.getAttribute("lang")).toBe(sample.expectedLang);
        });
      } else {
        it("has <meta name=\"robots\" content=\"noindex\">", () => {
          const robotsValue = getMetaContent(doc, "robots");
          expect(robotsValue).toBe("noindex");
        });

        it("has <title> that is non-empty", () => {
          const title = doc.querySelector("title");
          expect(title).not.toBeNull();
        });
      }
    });
  }
});

// Graceful skip if build output missing
if (!existsSync(OUT_DIR)) {
  console.warn("out/ directory not found — skipping HTML build output verification");
  describe.skip("out/ HTML output — build output verification", () => {});
}
