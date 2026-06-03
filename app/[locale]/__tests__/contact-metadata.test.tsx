import { describe, it, expect, vi, beforeEach } from "vitest";

const { getTranslationsMock } = vi.hoisted(() => ({
  getTranslationsMock: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: getTranslationsMock,
  setRequestLocale: vi.fn(),
}));

vi.mock("@/components/ui/ScrollReveal", () => ({ ScrollReveal: ({ children }: { children: React.ReactNode }) => children }));
vi.mock("@/components/contact/ContactHeader", () => ({ ContactHeader: () => null }));
vi.mock("@/components/contact/Channels/ContactChannels", () => ({ ContactChannels: () => null }));
vi.mock("@/components/contact/Faq/FaqSection", () => ({ ContactFaq: () => null }));

function enT(key: string): string {
  const t: Record<string, string> = {
    "contact.title": "Contact — ShineTechData",
    "contact.description": "Let's work together. Reach out to discuss your data project.",
  };
  return t[key] ?? key;
}

function esT(key: string): string {
  const t: Record<string, string> = {
    "contact.title": "Contacto — ShineTechData",
    "contact.description": "Trabajemos juntos. Contáctanos para discutir tu proyecto de datos.",
  };
  return t[key] ?? key;
}

import { generateMetadata } from "@/app/[locale]/contact/page";

describe("Contact Page — generateMetadata (SEO-1)", () => {
  beforeEach(() => {
    getTranslationsMock.mockResolvedValue(enT);
  });

  it("returns English title and description", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.title).toBe("Contact — ShineTechData");
    expect(metadata.description).toContain("Let's work together");
  });

  it("returns Spanish title and description", async () => {
    getTranslationsMock.mockResolvedValue(esT);
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.title).toBe("Contacto — ShineTechData");
    expect(metadata.description).toContain("Trabajemos juntos");
  });

  it("includes OG, Twitter, and canonical", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });

    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph!.type).toBe("website");
    expect(metadata.twitter!.card).toBe("summary_large_image");
    expect(metadata.alternates!.canonical).toContain("shinetechdata.com/en/contact");
  });

  it("includes hreflang alternates", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "es" }),
    });

    expect(metadata.alternates!.languages!["en"]).toContain("/en/contact");
    expect(metadata.alternates!.languages!["es"]).toContain("/es/contact");
  });
});
