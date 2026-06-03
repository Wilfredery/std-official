import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ============================================================
// Mocks — set up BEFORE importing the layout component
// ============================================================

vi.mock("next-intl/server", () => ({
  getMessages: vi.fn().mockResolvedValue({}),
  setRequestLocale: vi.fn(),
}));

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

// Mock the franklin font import from root layout
vi.mock("@/app/layout", () => ({
  franklin: { variable: "--font-libre-franklin" },
}));

// ============================================================
// Imports (after mocks are registered)
// ============================================================
import localeLayout from "@/app/[locale]/layout";
import { renderToString } from "react-dom/server";

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
