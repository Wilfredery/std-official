import { expect, test, type Page } from "@playwright/test";
import { BOOKING_URL } from "../lib/site";

// User journeys on desktop (header links) and mobile (sheet menu). On mobile
// the nav links and language switcher live inside the menu.
async function navScope(page: Page, isMobile: boolean, locale: "en" | "es") {
  if (!isMobile) return page.locator("header");
  await page.getByRole("button", { name: locale === "en" ? "Open menu" : "Abrir menú" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  return menu;
}

test("root redirects to a locale home", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|es)\/$/);
  await expect(page.locator("h1")).toBeVisible();
});

const NAV = [
  { name: "About us", path: "/en/about/" },
  { name: "Services", path: "/en/services/" },
  { name: "Blog", path: "/en/blog/" },
  { name: "Contact", path: "/en/contact/" },
];

for (const link of NAV) {
  test(`nav: ${link.name} → ${link.path}`, async ({ page, isMobile }) => {
    await page.goto("/en/");
    const scope = await navScope(page, isMobile, "en");
    await scope.getByRole("link", { name: link.name, exact: true }).click();
    await expect(page).toHaveURL(link.path);
    await expect(page.locator("h1")).toBeVisible();
  });
}

test("language switch keeps the page and swaps the locale", async ({ page, isMobile }) => {
  await page.goto("/en/about/");
  await (await navScope(page, isMobile, "en")).getByRole("button", { name: "Español" }).click();
  await expect(page).toHaveURL("/es/about/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");

  await (await navScope(page, isMobile, "es")).getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL("/en/about/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("Spanish-only landing switches to its English equivalent", async ({ page, isMobile }) => {
  await page.goto("/es/consultoria-de-datos-republica-dominicana/");
  await (await navScope(page, isMobile, "es")).getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL("/en/services/data-analysis/");
});

for (const path of ["/en/contact/", "/es/contact/", "/es/consultoria-de-datos-republica-dominicana/"]) {
  test(`Calendly booking link opens safely in a new tab: ${path}`, async ({ page }) => {
    await page.goto(path);
    const booking = page.locator(`a[href="${BOOKING_URL}"]`).first();
    await expect(booking).toBeVisible();
    await expect(booking).toHaveAttribute("target", "_blank");
    await expect(booking).toHaveAttribute("rel", /noopener/);
  });
}
