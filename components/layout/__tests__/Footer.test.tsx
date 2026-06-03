import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { Footer } from "@/components/layout/Footer";

// ---------------------------------------------------------------------------
// Mock hooks (dynamic vi.fn so individual tests can override values)
// ---------------------------------------------------------------------------
const useHydratedMock = vi.fn(() => true);
vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => useHydratedMock(),
}));

const useThemeMock = vi.fn(() => ({ resolvedTheme: "light" }));
vi.mock("@/lib/theme/ThemeContext", () => ({
  useTheme: () => useThemeMock(),
}));

// ---------------------------------------------------------------------------
// Mock next-intl — preserve NextIntlClientProvider, override useTranslations
// to handle multiple namespaces and return the key.
// ---------------------------------------------------------------------------
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

// ---------------------------------------------------------------------------
// Mock @/lib/i18n/navigation — Link renders as a plain anchor.
// ---------------------------------------------------------------------------
vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children, className, ...props }: Record<string, unknown>) => (
    <a href={href as string} className={className as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("Footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });
    useHydratedMock.mockReturnValue(true);
  });

  // ---- Brand / Logo ----

  it("renders the brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Shine")).toBeInTheDocument();
    expect(screen.getByText("TechData")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Footer />);
    expect(screen.getByText("tagline")).toBeInTheDocument();
  });

  it("renders logo with light src when theme is light", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });
    render(<Footer />);

    const logo = screen.getByAltText("ShineTechData logo");
    expect(logo.getAttribute("src")).toContain(
      "%2Fimages%2Fisotipo%2Fisotipo-light.webp",
    );
  });

  it("renders logo with dark src when theme is dark", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark" });
    render(<Footer />);

    const logo = screen.getByAltText("ShineTechData logo");
    expect(logo.getAttribute("src")).toContain(
      "%2Fimages%2Fdecorations%2Fcomposicion-visual.webp",
    );
  });

  it("renders placeholder when not hydrated", () => {
    useHydratedMock.mockReturnValue(false);
    render(<Footer />);
    expect(screen.getByText("STD")).toBeInTheDocument();
  });

  // ---- Contact info ----

  it("renders phone link with correct href", () => {
    render(<Footer />);
    const phoneLink = screen.getByText("829-584-9184").closest("a");
    expect(phoneLink).toHaveAttribute("href", "tel:+18295849184");
  });

  it("renders email link with correct href", () => {
    render(<Footer />);
    const emailLink = screen.getByText("contact@shinetechdata.com").closest("a");
    expect(emailLink).toHaveAttribute("href", "mailto:contact@shinetechdata.com");
  });

  // ---- Service links ----

  it("renders service links from the services array", () => {
    render(<Footer />);

    // Check all 6 service slugs have a rendered link
    const serviceSlugs = [
      "data-analysis",
      "business-intelligence",
      "machine-learning",
      "data-auditing",
      "digital-transformation",
      "process-automation",
    ];

    for (const slug of serviceSlugs) {
      const link = screen.getByText(`services.${slug}.title`).closest("a");
      expect(link).toHaveAttribute("href", `/services/${slug}`);
    }
  });

  it("has services heading", () => {
    render(<Footer />);
    const headings = screen.getAllByRole("heading");
    const servicesHeading = headings.find((h) => h.textContent === "services");
    expect(servicesHeading).toBeInTheDocument();
  });

  // ---- Navigation / Company links ----

  it("renders navigation links (Home, Services, Contact)", () => {
    render(<Footer />);

    expect(screen.getByText("home")).toBeInTheDocument();
    // "services" appears both as <h3> heading and as a nav link —
    // use getAllByText and pick the <a> element
    const servicesNodes = screen.getAllByText("services");
    const servicesLink = servicesNodes.find(
      (el) => el.tagName === "A",
    ) as HTMLAnchorElement;
    expect(servicesLink).toBeDefined();
    expect(servicesLink).toHaveAttribute("href", "/services");
    expect(screen.getByText("contact")).toBeInTheDocument();
  });

  it("renders privacy and terms links", () => {
    render(<Footer />);
    expect(screen.getByText("links.privacy")).toBeInTheDocument();
    expect(screen.getByText("links.terms")).toBeInTheDocument();
  });

  it("has company heading", () => {
    render(<Footer />);
    const headings = screen.getAllByRole("heading");
    const companyHeading = headings.find((h) => h.textContent === "company");
    expect(companyHeading).toBeInTheDocument();
  });

  // ---- Copyright ----

  it("renders copyright text with current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyright = screen.getByText(
      new RegExp(`©\\s*${currentYear}\\s*ShineTechData`),
    );
    expect(copyright).toBeInTheDocument();
  });

  it("renders developer credit", () => {
    render(<Footer />);
    expect(
      screen.getByText("dev.text"),
    ).toBeInTheDocument();
  });
});
