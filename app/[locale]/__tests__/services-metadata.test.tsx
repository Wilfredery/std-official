import { describe, it, expect, vi, beforeEach } from "vitest";

const { getTranslationsMock } = vi.hoisted(() => ({
  getTranslationsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: getTranslationsMock,
  setRequestLocale: vi.fn(),
}));

vi.mock("@/components/services/ServicesHeader", () => ({ ServicesHeader: () => null }));
vi.mock("@/components/ui/ScrollReveal", () => ({ ScrollReveal: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("@/components/services/ServicesSection", () => ({ ServicesSection: () => null }));
vi.mock("@/components/services/benefits/BenefitsSection", () => ({ BenefitsSection: () => null }));
vi.mock("@/components/services/cta/CtaSection", () => ({ CtaSection: () => null }));

// Translation data (seo.services namespace exists in messages)
function enT(key: string): string {
  const t: Record<string, string> = {
    "services.title": "Services — ShineTechData",
    "services.description":
      "Data Analysis, Business Intelligence, Machine Learning, Auditing, Digital Transformation, and Process Automation.",
  };
  return t[key] ?? key;
}

function esT(key: string): string {
  const t: Record<string, string> = {
    "services.title": "Servicios — ShineTechData",
    "services.description":
      "Análisis de datos, Business Intelligence, Machine Learning, Auditoría, Transformación Digital y Automatización de Procesos.",
  };
  return t[key] ?? key;
}

import { generateMetadata } from "@/app/[locale]/services/page";

describe("Services Page — generateMetadata (SEO-1)", () => {
  beforeEach(() => {
    getTranslationsMock.mockResolvedValue(enT);
  });

  it("returns locale-aware title and description for English", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.title).toBe("Services — ShineTechData");
    expect(metadata.description).toContain("Data Analysis");
  });

  it("includes openGraph metadata with images", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.openGraph!.images![0].url).toContain("/opengraph-image.png");
  });

  it("includes twitter metadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.twitter!.card).toBe("summary_large_image");
  });

  it("includes canonical URL", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.alternates!.canonical).toContain("shinetechdata.com/en/services");
  });

  it("returns Spanish translation for locale=es", async () => {
    getTranslationsMock.mockResolvedValue(esT);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.title).toBe("Servicios — ShineTechData");
    expect(metadata.description).toContain("Análisis de datos");
  });

  it("includes hreflang alternates", async () => {
    getTranslationsMock.mockResolvedValue(esT);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.alternates!.languages!["en"]).toContain("/en/services");
    expect(metadata.alternates!.languages!["es"]).toContain("/es/services");
  });
});
