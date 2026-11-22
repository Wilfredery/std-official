import { describe, it, expect, vi } from "vitest";

// ============================================================
// Mocks — set up BEFORE importing the layout component
// ============================================================

vi.mock("next-intl/server", async () => {
  const { createTranslator } = await vi.importActual<typeof import("next-intl")>("next-intl");
  const messages = {
    en: (await import("@/messages/en.json")).default,
    es: (await import("@/messages/es.json")).default,
  };
  return {
    getMessages: vi.fn().mockResolvedValue({}),
    setRequestLocale: vi.fn(),
    getTranslations: vi.fn(async ({ locale, namespace }: { locale: "en" | "es"; namespace: string }) =>
      createTranslator({ locale, messages: messages[locale], namespace: namespace as never }),
    ),
  };
});

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("@/components/layout/Navbar", () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/layout/ThemeShortcut", () => ({
  ThemeShortcut: () => <div data-testid="theme-shortcut" />,
}));

vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/lib/theme/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => ({
    theme: "light" as const,
    setTheme: vi.fn(),
    resolvedTheme: "light" as const,
    themes: ["light", "dark", "system"] as const,
  }),
}));

// Mock Vercel Analytics with a marker element
vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

// Mock the franklin font import from root layout
vi.mock("@/app/layout", () => ({
  franklin: { variable: "--font-libre-franklin" },
}));

// ============================================================
// Imports (after mocks are registered)
// ============================================================
import localeLayout from "@/app/[locale]/layout";
import { renderToString } from "react-dom/server";
import { SITE_URL } from "@/lib/site";
import { serviceSlugs } from "@/lib/data/services";

describe("Locale Layout — Vercel Analytics", () => {
  it("mounts the Analytics component", async () => {
    const jsx = await localeLayout({
      children: <div>Content</div>,
      params: Promise.resolve({ locale: "es" }),
    });
    const html = renderToString(jsx);

    expect(html).toContain('data-testid="vercel-analytics"');
  });
});

describe("Locale Layout — <html lang> attribute (SEO-2)", () => {
  // jsdom cannot render <html> inside a <div>, so we use renderToString
  // for structural assertions and @testing-library/react for component contents.

  describe("<html> element structure", () => {
    it("renders <html> with lang=\"en\" when locale is en", async () => {
      const jsx = await localeLayout({
        children: <div>Hello World</div>,
        params: Promise.resolve({ locale: "en" }),
      });
      const html = renderToString(jsx);

      expect(html).toContain('<html lang="en"');
    });

    it("renders <html> with lang=\"es\" when locale is es", async () => {
      const jsx = await localeLayout({
        children: <div>Hola Mundo</div>,
        params: Promise.resolve({ locale: "es" }),
      });
      const html = renderToString(jsx);

      expect(html).toContain('<html lang="es"');
    });

    it("renders valid <html> wrapper with lang and class attributes", async () => {
      const jsx = await localeLayout({
        children: <div>Content</div>,
        params: Promise.resolve({ locale: "en" }),
      });
      const html = renderToString(jsx);

      // <html> must be present with lang and font class
      expect(html).toContain('<html lang="en"');
      expect(html).toContain("--font-libre-franklin");
      // <body> must be present with structural classes
      expect(html).toContain('<body class="min-h-full flex flex-col"');
      // Note: suppressHydrationWarning is a React-internal prop on <html>
      // for theme class mismatch handling. It does not render as a DOM attribute
      // in React 19 renderToString — verified via code review.
    });

    it("renders <body> with the font class", async () => {
      const jsx = await localeLayout({
        children: <div>Content</div>,
        params: Promise.resolve({ locale: "en" }),
      });
      const html = renderToString(jsx);

      expect(html).toContain("--font-libre-franklin");
    });
  });

  describe("component tree (rendered via testing-library)", () => {
    it("wraps content with ThemeProvider", async () => {
      const jsx = await localeLayout({
        children: <div>Content</div>,
        params: Promise.resolve({ locale: "en" }),
      });
      // Use ReactDOM.renderToString to extract inner content only.
      // Since jsdom blocks <html> inside <div>, we render children manually.
      // Instead, test ThemeProvider is present by rendering without <html>/<body>:
      // We verify through the string output.
      const html = renderToString(jsx);
      expect(html).toContain('data-testid="theme-provider"');
    });

    it("renders Navbar, Footer, ThemeShortcut, and children inside the layout", async () => {
      const jsx = await localeLayout({
        children: <div>Page Content</div>,
        params: Promise.resolve({ locale: "en" }),
      });
      const html = renderToString(jsx);

      expect(html).toContain('data-testid="navbar"');
      expect(html).toContain("Navbar");
      expect(html).toContain('data-testid="footer"');
      expect(html).toContain("Footer");
      expect(html).toContain('data-testid="theme-shortcut"');
      expect(html).toContain("Page Content");
    });
  });
});

describe("Locale Layout — business JSON-LD", () => {
  async function organization(locale: "en" | "es") {
    const jsx = await localeLayout({ children: <div />, params: Promise.resolve({ locale }) });
    const html = renderToString(jsx);
    const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)].map(
      (m) => JSON.parse(m[1]),
    );
    return blocks.find((b) => b["@type"] === "ProfessionalService");
  }

  it("declares business hours on the business itself", async () => {
    const org = await organization("en");
    expect(org.openingHoursSpecification).toEqual([
      expect.objectContaining({ opens: "09:00", closes: "18:00" }),
    ]);
  });

  it("describes the business in the page language", async () => {
    expect((await organization("es")).description).toMatch(/^Consultoría de análisis de datos/);
    expect((await organization("en")).description).toMatch(/^Data analysis/);
  });

  it("links the founder with the same Person @id the blog uses for its author", async () => {
    const org = await organization("es");
    expect(org.founder).toMatchObject({
      "@type": "Person",
      "@id": `${SITE_URL}/#person-diogenes-monegro`,
      name: "Diogenes Monegro",
      jobTitle: "CEO de ShineTechData",
    });
  });

  it("lists every service, localized, in an OfferCatalog", async () => {
    const org = await organization("es");
    const items = org.hasOfferCatalog.itemListElement;
    expect(items).toHaveLength(serviceSlugs.length);
    expect(items[0].itemOffered).toEqual({
      "@type": "Service",
      name: "Análisis de Datos",
      url: `${SITE_URL}/es/services/data-analysis/`,
    });
  });
});

