import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@/lib/__tests__/test-utils";
import { Navbar } from "@/components/layout/Navbar";

// ---------------------------------------------------------------------------
// Mock child components to isolate Navbar testing
// ---------------------------------------------------------------------------
vi.mock("@/components/layout/MobileMenu", () => ({
  MobileMenu: ({ open }: { open: boolean }) =>
    open ? <div data-testid="mobile-menu">MobileMenu</div> : null,
}));

vi.mock("@/components/layout/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock("@/components/layout/LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="lang-switcher">LangSwitcher</div>,
}));

// ---------------------------------------------------------------------------
// Mock hooks (dynamic vi.fn so individual tests can override return values)
// ---------------------------------------------------------------------------
const useHydratedMock = vi.fn(() => true);
vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => useHydratedMock(),
}));

const useThemeMock = vi.fn(() => ({ resolvedTheme: "light" }));
vi.mock("next-themes", () => ({
  useTheme: () => useThemeMock(),
}));

// ---------------------------------------------------------------------------
// Mock next-intl — preserve NextIntlClientProvider (needed by custom render),
// only override useTranslations to return the key directly.
// ---------------------------------------------------------------------------
vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
  };
});

// ---------------------------------------------------------------------------
// Mock @/lib/i18n/navigation — Link renders as a plain anchor,
// usePathname is a mock function so individual tests can override it.
// ---------------------------------------------------------------------------
const usePathnameMock = vi.fn(() => "/es/services");
vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children, className, ...props }: Record<string, unknown>) => (
    <a href={href as string} className={className as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
  usePathname: () => usePathnameMock(),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });
    useHydratedMock.mockReturnValue(true);
    usePathnameMock.mockReturnValue("/es/services");
  });

  // ---- Basic rendering ----

  it("renders navbar with logo text", () => {
    render(<Navbar />);
    expect(screen.getByText("Shine")).toBeInTheDocument();
    expect(screen.getByText("TechData")).toBeInTheDocument();
  });

  it("renders nav links (Home, Services, Contact)", () => {
    render(<Navbar />);
    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("services")).toBeInTheDocument();
    expect(screen.getByText("contact")).toBeInTheDocument();
  });

  it("renders the CTA button", () => {
    render(<Navbar />);
    expect(screen.getByText("cta")).toBeInTheDocument();
  });

  // ---- Active link detection ----

  it("highlights active link when pathname matches", () => {
    // Override pathname so "/services" matches the services nav link
    usePathnameMock.mockReturnValue("/services");

    render(<Navbar />);

    const links = screen.getAllByRole("link");
    const servicesLink = links.find((l) => l.textContent === "services");
    expect(servicesLink).toBeDefined();
    expect(servicesLink!.className).toContain("text-primary");
    expect(servicesLink!.className).toContain("bg-primary/10");
  });

  it("applies inactive styles to non-matching links", () => {
    usePathnameMock.mockReturnValue("/services");

    render(<Navbar />);

    const links = screen.getAllByRole("link");
    const homeLink = links.find((l) => l.textContent === "home");
    expect(homeLink).toBeDefined();
    expect(homeLink!.className).toContain("text-muted-foreground");
  });

  // ---- Child components ----

  it("renders ThemeToggle and LanguageSwitcher in desktop view", () => {
    render(<Navbar />);

    // ThemeToggle appears twice: desktop actions + mobile toggle area
    expect(screen.getAllByTestId("theme-toggle")).toHaveLength(2);
    expect(screen.getByTestId("lang-switcher")).toBeInTheDocument();
  });

  it("renders MobileMenu when burger button is clicked", () => {
    render(<Navbar />);

    // Mobile menu is not visible initially
    expect(screen.queryByTestId("mobile-menu")).toBeNull();

    // Click the burger button
    const menuButton = screen.getByLabelText("menuOpen");
    fireEvent.click(menuButton);

    // Mobile menu appears
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  // ---- Scroll behaviour ----

  it("has transparent background when not scrolled", () => {
    render(<Navbar />);
    const header = document.querySelector("header")!;
    expect(header.className).toContain("bg-transparent");
  });

  it("applies scrolled background class after scroll past threshold", () => {
    render(<Navbar />);

    act(() => {
      Object.defineProperty(window, "scrollY", {
        value: 100,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("scroll"));
    });

    const header = document.querySelector("header")!;
    expect(header.className).toContain("bg-background/90");
    expect(header.className).toContain("backdrop-blur-md");
    expect(header.className).toContain("shadow-sm");
  });

  // ---- Theme-aware logo ----

  it("renders logo with light src when theme is light", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "light" });
    render(<Navbar />);

    const logo = screen.getByAltText("ShineTechData isotipo");
    expect(logo.getAttribute("src")).toContain(
      "%2Fimages%2Fisotipo%2Fisotipo-light.webp",
    );
  });

  it("renders logo with dark src when theme is dark", () => {
    useThemeMock.mockReturnValue({ resolvedTheme: "dark" });
    render(<Navbar />);

    const logo = screen.getByAltText("ShineTechData isotipo");
    expect(logo.getAttribute("src")).toContain(
      "%2Fimages%2Fdecorations%2Fcomposicion-visual.webp",
    );
  });

  // ---- Edge case: not mounted yet ----

  it("renders placeholder div when not hydrated", () => {
    useHydratedMock.mockReturnValue(false);

    render(<Navbar />);
    expect(screen.getByText("ST")).toBeInTheDocument();
  });
});
