import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const isCI = !!process.env.CI;

// E2E + accessibility against the production build (`next start`), not the
// dev server: same HTML, headers and CSP that ship. Run `pnpm build` first.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      // Sitewide crawls run once (desktop); mobile covers the responsive UI.
      testIgnore: ["**/seo.spec.ts", "**/a11y.spec.ts"],
    },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/en/`,
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
});
