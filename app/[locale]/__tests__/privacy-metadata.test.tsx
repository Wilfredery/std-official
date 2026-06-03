import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// Privacy page test
// ============================================================

const { getTranslationsMock: privGetT } = vi.hoisted(() => ({
  getTranslationsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: privGetT,
  setRequestLocale: vi.fn(),
}));

vi.mock("@/components/legal/LegalPage", () => ({
  LegalPage: () => null,
}));

function privEnT(key: string): string {
  const t: Record<string, string> = {
    "privacy.title": "Privacy Policy — ShineTechData",
    "privacy.description":
      "Learn how ShineTechData collects, uses, and protects your personal information.",
  };
  return t[key] ?? key;
}

import { generateMetadata as privMeta } from "@/app/[locale]/privacy/page";

describe("Privacy Page — generateMetadata (SEO-1)", () => {
  beforeEach(() => {
    privGetT.mockResolvedValue(privEnT);
  });

  it("preserves existing title and description", async () => {
    const metadata = await privMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.title).toBe("Privacy Policy — ShineTechData");
    expect(metadata.description).toContain("Learn how");
  });

  it("includes openGraph metadata (new)", async () => {
    const metadata = await privMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.openGraph!.siteName).toBe("ShineTechData");
  });

  it("includes twitter metadata (new)", async () => {
    const metadata = await privMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter!.card).toBe("summary_large_image");
  });

  it("includes canonical URL (new)", async () => {
    const metadata = await privMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.alternates!.canonical).toContain(
      "shinetechdata.com/en/privacy"
    );
  });

  it("includes hreflang alternates (new)", async () => {
    const metadata = await privMeta({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.alternates!.languages!["en"]).toContain("/en/privacy");
    expect(metadata.alternates!.languages!["es"]).toContain("/es/privacy");
  });
});
