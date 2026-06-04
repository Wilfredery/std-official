import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve(process.cwd(), "out");

const EXPECTED_LOCALES = ["en", "es"] as const;

const STATIC_ROUTES = [
  "",
  "about",
  "services",
  "contact",
  "privacy",
  "terms",
] as const;

const SERVICE_SLUGS = [
  "data-analysis",
  "business-intelligence",
  "machine-learning",
  "data-auditing",
  "digital-transformation",
  "process-automation",
] as const;

describe("out/ SEO route existence — build output verification", () => {
  it("has en home page", () => {
    const path = resolve(OUT_DIR, "en", "index.html");
    expect(existsSync(path), `Missing: ${path}`).toBe(true);
  });

  it("has es home page", () => {
    const path = resolve(OUT_DIR, "es", "index.html");
    expect(existsSync(path), `Missing: ${path}`).toBe(true);
  });

  for (const locale of EXPECTED_LOCALES) {
    for (const route of STATIC_ROUTES) {
      if (route === "") continue; // already tested above

      it(`has ${locale}/${route} page`, () => {
        const path = resolve(OUT_DIR, locale, route, "index.html");
        expect(existsSync(path), `Missing: ${path}`).toBe(true);
      });
    }
  }

  for (const locale of EXPECTED_LOCALES) {
    for (const slug of SERVICE_SLUGS) {
      it(`has ${locale}/services/${slug} page`, () => {
        const path = resolve(OUT_DIR, locale, "services", slug, "index.html");
        expect(existsSync(path), `Missing: ${path}`).toBe(true);
      });
    }
  }

  it("has 404.html page", () => {
    const path = resolve(OUT_DIR, "404.html");
    expect(existsSync(path), `Missing: ${path}`).toBe(true);
  });

  it("does NOT have unexpected routes (e.g., /en/search/)", () => {
    const searchPath = resolve(OUT_DIR, "en", "search", "index.html");
    expect(
      existsSync(searchPath),
      `Unexpected route exists: ${searchPath}`
    ).toBe(false);
  });

  it("does NOT have unexpected routes (e.g., /en/blog/)", () => {
    const blogPath = resolve(OUT_DIR, "en", "blog", "index.html");
    expect(
      existsSync(blogPath),
      `Unexpected route exists: ${blogPath}`
    ).toBe(false);
  });
});

// Graceful skip if build output missing
if (!existsSync(OUT_DIR)) {
  console.warn("out/ directory not found — skipping SEO route existence verification");
  describe.skip("out/ SEO route existence — build output verification", () => {});
}
