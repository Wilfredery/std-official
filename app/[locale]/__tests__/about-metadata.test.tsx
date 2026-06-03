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
  it("uses getTranslations with namespace=seo for English locale", async () => {
    // Simulate getTranslations returning specific seo.about values
    getTranslationsMock.mockResolvedValue((key: string) => {
      const seo: Record<string, string> = {
        "about.title": "About Us | ShineTechData",
        "about.description": "Learn about ShineTechData's mission, values, and the team behind our tech solutions.",
      };
      return seo[key] ?? key;
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    // Verify getTranslations was called with the correct namespace
    expect(getTranslationsMock).toHaveBeenCalledWith({
      locale: "en",
      namespace: "seo",
    });
    expect(metadata.title).toBe("About Us | ShineTechData");
    expect(metadata.description).toBe(
      "Learn about ShineTechData's mission, values, and the team behind our tech solutions."
    );
  });

  it("uses getTranslations with namespace=seo for Spanish locale", async () => {
    getTranslationsMock.mockResolvedValue((key: string) => {
      const seo: Record<string, string> = {
        "about.title": "Sobre Nosotros | ShineTechData",
        "about.description": "Conoce la misión, valores y equipo detrás de las soluciones tecnológicas de ShineTechData.",
      };
      return seo[key] ?? key;
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(getTranslationsMock).toHaveBeenCalledWith({
      locale: "es",
      namespace: "seo",
    });
    expect(metadata.title).toBe("Sobre Nosotros | ShineTechData");
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
