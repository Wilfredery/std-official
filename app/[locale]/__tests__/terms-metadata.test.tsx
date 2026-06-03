import { describe, it, expect, vi, beforeEach } from "vitest";

const { getTranslationsMock } = vi.hoisted(() => ({
  getTranslationsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: getTranslationsMock,
  setRequestLocale: vi.fn(),
}));

vi.mock("@/components/legal/LegalPage", () => ({
  LegalPage: () => null,
}));

function termsEnT(key: string): string {
  const t: Record<string, string> = {
    "terms.title": "Terms of Service — ShineTechData",
    "terms.description":
      "Read the website usage terms and service agreements of ShineTechData.",
  };
  return t[key] ?? key;
}

import { generateMetadata as termsMeta } from "@/app/[locale]/terms/page";

describe("Terms Page — generateMetadata (SEO-1)", () => {
  beforeEach(() => {
    getTranslationsMock.mockResolvedValue(termsEnT);
  });

  it("preserves existing title and description", async () => {
    const metadata = await termsMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.title).toBe("Terms of Service — ShineTechData");
    expect(metadata.description).toContain("website usage terms");
  });

  it("includes openGraph metadata (new)", async () => {
    const metadata = await termsMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.siteName).toBe("ShineTechData");
  });

  it("includes twitter card (new)", async () => {
    const metadata = await termsMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter!.card).toBe("summary_large_image");
  });

  it("includes canonical and hreflang (new)", async () => {
    const metadata = await termsMeta({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.alternates!.canonical).toContain("shinetechdata.com/en/terms");
    expect(metadata.alternates!.languages!["en"]).toContain("/en/terms");
    expect(metadata.alternates!.languages!["es"]).toContain("/es/terms");
  });
});
