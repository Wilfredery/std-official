import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { SITE_PAGES } from "./sitemap";

// WCAG 2.2 A/AA on every sitemap page, in both themes (dark mode has its own
// palette, so contrast must hold in each). Reduced motion settles scroll
// reveal animations so contrast is measured on final colors.
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} theme`, () => {
    test.use({ colorScheme, reducedMotion: "reduce" });

    for (const entry of SITE_PAGES) {
      test(`a11y: ${entry.path}`, async ({ page }) => {
        await page.goto(entry.path);
        await page.waitForLoadState("networkidle");
        const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
        const summary = violations.map(
          (v) =>
            `${v.id} (${v.impact}): ${v.help}\n` +
            v.nodes.map((n) => `  ${n.target.join(" ")}\n    ${n.failureSummary?.replace(/\n/g, " ")}`).join("\n"),
        );
        expect(summary, summary.join("\n")).toEqual([]);
      });
    }
  });
}
