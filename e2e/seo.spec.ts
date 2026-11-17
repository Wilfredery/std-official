import { expect, test } from "@playwright/test";
import { SITE_PAGES } from "./sitemap";

// Server-rendered SEO contract for every sitemap page: what crawlers read
// from the raw HTML, before any JavaScript runs.
test.use({ javaScriptEnabled: false });

for (const entry of SITE_PAGES) {
  test(`SEO tags: ${entry.path}`, async ({ page }) => {
    const res = await page.goto(entry.path);
    expect(res?.status(), "HTTP status").toBe(200);

    await expect(page.locator("html")).toHaveAttribute("lang", entry.locale);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", entry.url);

    expect((await page.title()).trim(), "<title>").not.toBe("");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /^https:\/\//);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator("h1")).toHaveCount(1);

    // Absent robots meta = indexable; present must not say noindex.
    const robots = await page
      .locator('meta[name="robots"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute("content") ?? ""));
    expect(robots.join(","), "robots meta").not.toMatch(/noindex/);

    // Page hreflang set must match what the sitemap advertises.
    const hreflangs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((els) => els.map((el) => el.getAttribute("hreflang") ?? ""));
    expect(hreflangs.sort()).toEqual([...entry.hreflangs].sort());
  });
}

test("unknown URL returns 404 with noindex", async ({ page }) => {
  const res = await page.goto("/en/this-page-does-not-exist/");
  expect(res?.status()).toBe(404);
  // Next.js adds its own noindex on not-found, alongside ours: every one must say it.
  const robots = await page
    .locator('meta[name="robots"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("content") ?? ""));
  expect(robots.length).toBeGreaterThan(0);
  for (const content of robots) expect(content).toMatch(/noindex/);
});

test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toMatch(/User-Agent: \*/i);
  expect(body).toMatch(/Allow: \//);
  expect(body).not.toMatch(/Disallow: \/\s*$/m);
  expect(body).toMatch(/Sitemap: https:\/\/\S+\/sitemap\.xml/);
});

test("sitemap.xml is served and lists every page", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const locs = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs.sort()).toEqual(SITE_PAGES.map((p) => p.url).sort());
});
