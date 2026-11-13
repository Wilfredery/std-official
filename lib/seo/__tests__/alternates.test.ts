import { describe, it, expect } from "vitest";
import { languageAlternates } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/site";

describe("languageAlternates", () => {
  it("returns en, es and x-default for a path", () => {
    expect(languageAlternates("/services/")).toEqual({
      en: `${SITE_URL}/en/services/`,
      es: `${SITE_URL}/es/services/`,
      "x-default": `${SITE_URL}/en/services/`,
    });
  });

  it("handles the home path with trailing slash", () => {
    const alt = languageAlternates("/");
    expect(alt.en).toBe(`${SITE_URL}/en/`);
    expect(alt.es).toBe(`${SITE_URL}/es/`);
    expect(alt["x-default"]).toBe(`${SITE_URL}/en/`);
  });
});
