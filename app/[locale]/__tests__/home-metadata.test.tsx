import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// Mocks — use vi.hoisted for values needed in hoisted vi.mock
// ============================================================

const { getTranslationsMock } = vi.hoisted(() => ({
  getTranslationsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: getTranslationsMock,
  setRequestLocale: vi.fn(),
}));

// Mock component imports to prevent transitive Next.js dependency issues
vi.mock("@/components/home/hero/HeroSection", () => ({
  HeroSection: () => null,
}));
vi.mock("@/components/home/problem/ProblemSection", () => ({
  ProblemSection: () => null,
}));
vi.mock("@/components/home/solution/SolutionSection", () => ({
  SolutionSection: () => null,
}));
vi.mock("@/components/ui/ScrollReveal", () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("@/components/home/process/ProcessSection", () => ({
  ProcessSection: () => null,
}));
vi.mock("@/components/home/cta/CtaSection", () => ({
  CtaSection: () => null,
}));

// ============================================================
// Translation data
// ============================================================
const enTranslations: Record<string, string> = {
  "home.title": "ShineTechData — Turn your data into smarter decisions",
  "home.description":
    "ShineTechData helps SMBs turn raw data into clear insights, automated processes, and real business growth.",
};

const esTranslations: Record<string, string> = {
  "home.title":
    "ShineTechData — Convierte tus datos en decisiones inteligentes",
  "home.description":
    "ShineTechData ayuda a PyMEs a transformar datos crudos en insights claros, procesos automatizados y crecimiento real.",
};

function enT(key: string): string {
  return enTranslations[key] ?? key;
}

function esT(key: string): string {
  return esTranslations[key] ?? key;
}

// ============================================================
// Import after mocks
// ============================================================
import { generateMetadata } from "@/app/[locale]/page";

describe("Home Page — generateMetadata (SEO-1)", () => {
  beforeEach(() => {
    getTranslationsMock.mockResolvedValue(enT);
  });

  it("returns locale-aware title and description for English", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.title).toBe(
      "ShineTechData — Turn your data into smarter decisions"
    );
    expect(metadata.description).toBe(
      "ShineTechData helps SMBs turn raw data into clear insights, automated processes, and real business growth."
    );
  });

  it("includes openGraph metadata with website type", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.title).toBe(
      "ShineTechData — Turn your data into smarter decisions"
    );
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.openGraph!.siteName).toBe("ShineTechData");
    expect(metadata.openGraph!.images).toBeDefined();
    expect(metadata.openGraph!.images![0].url).toContain(
      "/opengraph-image.png"
    );
    expect(metadata.openGraph!.images![0].width).toBe(1200);
    expect(metadata.openGraph!.images![0].height).toBe(630);
  });

  it("includes twitter metadata with summary_large_image card", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter!.card).toBe("summary_large_image");
    expect(metadata.twitter!.title).toBe(
      "ShineTechData — Turn your data into smarter decisions"
    );
    expect(metadata.twitter!.images).toBeDefined();
    expect(metadata.twitter!.images![0]).toContain("/opengraph-image.png");
  });

  it("includes canonical URL", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.alternates).toBeDefined();
    expect(metadata.alternates!.canonical).toBe(
      "https://www.shinetechdata.com/en"
    );
  });

  describe("i18n triangulation — Spanish locale", () => {
    beforeEach(() => {
      getTranslationsMock.mockResolvedValue(esT);
    });

    it("returns Spanish title and description for locale=es", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "es" }),
      });

      expect(metadata.title).toBe(
        "ShineTechData — Convierte tus datos en decisiones inteligentes"
      );
      expect(metadata.description).toContain("ShineTechData ayuda a PyMEs");
    });

    it("sets og:locale to es_DO for Spanish locale", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "es" }),
      });

      expect(metadata.openGraph!.locale).toBe("es_DO");
    });

    it("includes hreflang alternates for both locales", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "es" }),
      });

      expect(metadata.alternates!.languages).toBeDefined();
      expect(metadata.alternates!.languages!["en"]).toContain(
        "shinetechdata.com/en"
      );
      expect(metadata.alternates!.languages!["es"]).toContain(
        "shinetechdata.com/es"
      );
    });
  });

  describe("OG images use absolute URLs", () => {
    it("uses absolute https URL for og:image", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(metadata.openGraph!.images![0].url).toBe(
        "https://www.shinetechdata.com/opengraph-image.png"
      );
    });

    it("uses absolute https URL for twitter:image", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en" }),
      });

      expect(metadata.twitter!.images![0]).toBe(
        "https://www.shinetechdata.com/opengraph-image.png"
      );
    });
  });
});
