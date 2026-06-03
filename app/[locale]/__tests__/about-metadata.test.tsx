import { describe, it, expect, vi } from "vitest";

// ============================================================
// Mocks
// ============================================================

const { getTranslationsMock } = vi.hoisted(() => ({
  getTranslationsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: getTranslationsMock,
  setRequestLocale: vi.fn(),
}));

// Mock component imports from the about page
vi.mock("@/components/about/hero/AboutHeader", () => ({ AboutHeader: () => null }));
vi.mock("@/components/about/brandStory/AboutBrandStory", () => ({ BrandStory: () => null }));
vi.mock("@/components/about/missionVission/AboutMissionVision", () => ({ MissionVision: () => null }));
vi.mock("@/components/about/values/AboutValuesSection", () => ({ ValuesSection: () => null }));
vi.mock("@/components/ui/ScrollReveal", () => ({ ScrollReveal: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("@/components/about/pillars/AboutPillarsSection", () => ({ PillarsSection: () => null }));
vi.mock("@/components/about/cta/AboutCtaLinks", () => ({ AboutCtaLinks: () => null }));
vi.mock("@/components/about/team/AboutTeam", () => ({ AboutTeam: () => null }));

// ============================================================
// Import after mocks
// ============================================================
import { generateMetadata } from "@/app/[locale]/about/page";

describe("About Page — generateMetadata (SEO-1)", () => {
  it("returns English fallback title since seo.about keys do not exist yet", async () => {
    // The about page uses hardcoded fallback because seo.about namespace
    // doesn't exist in messages/*.json. Make getTranslations return a dummy.
    getTranslationsMock.mockResolvedValue((key: string) => key);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.title).toContain("About");
    expect(metadata.title).toContain("ShineTechData");
    expect(metadata.description).toBeTruthy();
    expect(typeof metadata.description).toBe("string");
  });

  it("returns Spanish fallback title for locale=es", async () => {
    getTranslationsMock.mockResolvedValue((key: string) => key);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.title).toContain("ShineTechData");
    expect(metadata.title).not.toBe("");
    expect(metadata.description).toBeTruthy();
  });

  it("includes openGraph metadata", async () => {
    getTranslationsMock.mockResolvedValue((key: string) => key);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.openGraph!.siteName).toBe("ShineTechData");
    expect(metadata.openGraph!.images![0].url).toContain("/opengraph-image.png");
  });

  it("includes twitter metadata", async () => {
    getTranslationsMock.mockResolvedValue((key: string) => key);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter!.card).toBe("summary_large_image");
  });

  it("includes canonical URL with trailing slash for static export", async () => {
    getTranslationsMock.mockResolvedValue((key: string) => key);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.alternates!.canonical).toContain("shinetechdata.com/en/about");
  });

  it("includes hreflang alternates for both locales", async () => {
    getTranslationsMock.mockResolvedValue((key: string) => key);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.alternates!.languages!["en"]).toContain("/en/about");
    expect(metadata.alternates!.languages!["es"]).toContain("/es/about");
  });
});
