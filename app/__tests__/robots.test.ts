import { describe, it, expect } from "vitest";

// Import the default export from robots.ts — this file does NOT exist yet (RED phase)
// The import will fail until we create app/robots.ts in GREEN phase
import robots from "@/app/robots";

describe("robots.ts — CRAWL-1", () => {
  it("returns a Robots config allowing all crawlers (userAgent: *, allow: /)", () => {
    const config = robots();

    expect(config.rules).toBeDefined();
    // robots() returns { rules: [...] } — verify the rule structure
    const rules = Array.isArray(config.rules)
      ? config.rules
      : [config.rules];

    expect(rules).toHaveLength(1);
    expect(rules[0].userAgent).toBe("*");
    expect(rules[0].allow).toBe("/");
  });

  it("points sitemap to the correct absolute URL", () => {
    const config = robots();

    expect(config.sitemap).toBe("https://shinetechdata.com/sitemap.xml");
  });

  it("does not include any disallow rules", () => {
    const config = robots();

    const rules = Array.isArray(config.rules)
      ? config.rules
      : [config.rules];

    for (const rule of rules) {
      expect(rule.disallow).toBeUndefined();
    }
  });
});
