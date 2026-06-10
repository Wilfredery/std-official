import { describe, it, expect, beforeEach, vi } from "vitest";

describe("site config", () => {
  describe("SITE_URL", () => {
    beforeEach(() => {
      vi.resetModules();
      vi.unstubAllEnvs();
    });

    it("falls back to default when NEXT_PUBLIC_SITE_URL is not set", async () => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
      const { SITE_URL } = await import("@/lib/site");
      expect(SITE_URL).toBe("https://www.shinetechdata.com");
    });

    it("uses the env var when NEXT_PUBLIC_SITE_URL is set", async () => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://custom.example.com");
      const { SITE_URL } = await import("@/lib/site");
      expect(SITE_URL).toBe("https://custom.example.com");
    });
  });

  describe("locales", () => {
    it("exports the supported locales as an array", async () => {
      const { locales } = await import("@/lib/site");
      expect(locales).toEqual(["en", "es"]);
    });

    it("is read-only (as const)", async () => {
      const { locales } = await import("@/lib/site");
      expect(locales).toHaveLength(2);
      expect(locales).toContain("en");
      expect(locales).toContain("es");
    });
  });
});
