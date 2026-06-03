import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================
// Mocks
// ============================================================

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(),
  setRequestLocale: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("@/lib/data/services", () => ({
  getServiceBySlug: vi.fn(),
  serviceSlugs: [
    "data-analysis",
    "machine-learning",
  ],
}));

vi.mock("@/components/services/detail/ServiceDetailSection", () => ({
  ServiceDetailSection: () => null,
}));

// ============================================================
// Import after mocks
// ============================================================
import { getTranslations } from "next-intl/server";
import { generateMetadata } from "@/app/[locale]/services/[slug]/page";

// Helper: create a t-like function with .raw() support
function makeRawT(rawData: Record<string, { title: string; summary: string }>) {
  const fn = vi.fn((key: string) => key);
  return Object.assign(fn, { raw: vi.fn((key: string) => rawData[key]) });
}

describe("Service Detail Page — generateMetadata (SEO-1, SEO-4)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic metadata (existing behavior preserved)", () => {
    it("returns service title with ShineTechData suffix", async () => {
      vi.mocked(getTranslations).mockResolvedValue(
        makeRawT({
          "data-analysis": {
            title: "Data Analysis",
            summary: "Deep-dive diagnostics.",
          },
        })
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en", slug: "data-analysis" }),
      });

      expect(metadata.title).toBe("Data Analysis | ShineTechData");
      expect(metadata.description).toBe("Deep-dive diagnostics.");
    });
  });

  describe("openGraph (new behavior)", () => {
    it("includes OG metadata with service-specific title", async () => {
      vi.mocked(getTranslations).mockResolvedValue(
        makeRawT({
          "machine-learning": {
            title: "Machine Learning",
            summary: "Predictive modeling and custom AI integrations.",
          },
        })
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({
          locale: "en",
          slug: "machine-learning",
        }),
      });

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph!.title).toBe(
        "Machine Learning | ShineTechData"
      );
      expect(metadata.openGraph!.type).toBe("website");
      expect(metadata.openGraph!.images![0].url).toContain(
        "/opengraph-image.png"
      );
    });
  });

  describe("twitter (new behavior)", () => {
    it("includes Twitter card metadata", async () => {
      vi.mocked(getTranslations).mockResolvedValue(
        makeRawT({
          "data-analysis": {
            title: "Data Analysis",
            summary: "Deep-dive diagnostics.",
          },
        })
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en", slug: "data-analysis" }),
      });

      expect(metadata.twitter).toBeDefined();
      expect(metadata.twitter!.card).toBe("summary_large_image");
      expect(metadata.twitter!.images![0]).toContain("/opengraph-image.png");
    });
  });

  describe("canonical URL (new behavior)", () => {
    it("includes canonical with locale and slug", async () => {
      vi.mocked(getTranslations).mockResolvedValue(
        makeRawT({
          "data-analysis": {
            title: "Data Analysis",
            summary: "Deep-dive diagnostics.",
          },
        })
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "en", slug: "data-analysis" }),
      });

      expect(metadata.alternates!.canonical).toBe(
        "https://shinetechdata.com/en/services/data-analysis/"
      );
    });
  });

  describe("hreflang alternates — SEO-4 (new behavior)", () => {
    it("includes hreflang alternates for both locales", async () => {
      vi.mocked(getTranslations).mockResolvedValue(
        makeRawT({
          "data-analysis": {
            title: "Análisis de Datos",
            summary: "Diagnósticos profundos.",
          },
        })
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "es", slug: "data-analysis" }),
      });

      expect(metadata.alternates!.languages).toBeDefined();
      expect(metadata.alternates!.languages!["en"]).toContain(
        "/en/services/data-analysis"
      );
      expect(metadata.alternates!.languages!["es"]).toContain(
        "/es/services/data-analysis"
      );
    });
  });

  describe("OG locale (new behavior)", () => {
    it("sets es_DO for Spanish service detail", async () => {
      vi.mocked(getTranslations).mockResolvedValue(
        makeRawT({
          "data-analysis": {
            title: "Análisis de Datos",
            summary: "Diagnósticos profundos.",
          },
        })
      );

      const metadata = await generateMetadata({
        params: Promise.resolve({ locale: "es", slug: "data-analysis" }),
      });

      expect(metadata.openGraph!.locale).toBe("es_DO");
    });
  });
});
