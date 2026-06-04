import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/lib/__tests__/test-utils";
import { MobileMenu } from "@/components/layout/MobileMenu";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    onClick,
    className,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} onClick={onClick} className={className} {...props}>
      {children}
    </a>
  ),
  usePathname: vi.fn(() => "/"),
}));

vi.mock("@/components/layout/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock("@/components/layout/LanguageSwitcher", () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Lang</div>,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="sheet">{children}</div> : null),
  SheetContent: ({
    children,
    side,
    className,
  }: {
    children: React.ReactNode;
    side?: string;
    className?: string;
  }) => (
    <div data-testid="sheet-content" data-side={side} className={className}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sheet-header">{children}</div>
  ),
  SheetTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <h2 data-testid="sheet-title" className={className}>
      {children}
    </h2>
  ),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MobileMenu", () => {
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
  });

  it("does not render content when closed", () => {
    const { container } = render(
      <MobileMenu open={false} onOpenChange={mockOnOpenChange} />,
    );
    expect(container.querySelector('[data-testid="sheet"]')).toBeNull();
  });

  describe("when menu is open", () => {
    const renderOpenMenu = () =>
      render(<MobileMenu open={true} onOpenChange={mockOnOpenChange} />);

    it("renders the Sheet with correct title", () => {
      renderOpenMenu();
      expect(screen.getByTestId("sheet-title")).toHaveTextContent(
        "ShineTechData",
      );
    });

    it("renders all navigation links with translated labels", () => {
      renderOpenMenu();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders ThemeToggle and LanguageSwitcher", () => {
      renderOpenMenu();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
      expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
    });

    it("renders CTA link with correct text", () => {
      renderOpenMenu();
      // "Free Consultation" from en.json nav.cta
      expect(screen.getByText("Free Consultation")).toBeInTheDocument();
    });

    it("closes menu when a navigation link is clicked", () => {
      renderOpenMenu();

      const servicesLink = screen.getByText("Services");
      fireEvent.click(servicesLink);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      expect(mockOnOpenChange).toHaveBeenCalledTimes(1);
    });

    it("closes menu when CTA link is clicked", () => {
      renderOpenMenu();

      const ctaLink = screen.getByText("Free Consultation");
      fireEvent.click(ctaLink);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("sets aria-current=page on the active route link", async () => {
      const { usePathname } = await import("@/lib/i18n/navigation");
      vi.mocked(usePathname).mockReturnValue("/services");

      renderOpenMenu();

      const servicesLink = screen.getByText("Services");
      expect(servicesLink).toHaveAttribute("aria-current", "page");

      const homeLink = screen.getByText("Home");
      expect(homeLink).not.toHaveAttribute("aria-current");
    });

    it("marks home as inactive when pathname is not '/'", async () => {
      const { usePathname } = await import("@/lib/i18n/navigation");
      vi.mocked(usePathname).mockReturnValue("/services");

      renderOpenMenu();

      const homeLink = screen.getByText("Home");
      expect(homeLink).not.toHaveAttribute("aria-current");
    });

    it("marks /services as active for sub-paths starting with /services", async () => {
      const { usePathname } = await import("@/lib/i18n/navigation");
      vi.mocked(usePathname).mockReturnValue(
        "/services/data-analysis",
      );

      renderOpenMenu();

      const servicesLink = screen.getByText("Services");
      expect(servicesLink).toHaveAttribute("aria-current", "page");
    });
  });
});
