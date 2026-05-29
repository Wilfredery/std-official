import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/lib/__tests__/test-utils";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

// ---------------------------------------------------------------------------
// Shared mutable references for mock hooks (set per test)
// ---------------------------------------------------------------------------

const mockReplace = vi.fn();
const mockIsPending = vi.hoisted(() => vi.fn<() => boolean>());
const mockStartTransition = vi.hoisted(() =>
  vi.fn((cb: () => void) => cb()),
);

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: vi.fn(() => "/en"),
  Link: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/lib/i18n/routing", () => ({
  routing: { locales: ["es", "en"] },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useTransition: () => [mockIsPending(), mockStartTransition],
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockIsPending.mockReturnValue(false);
  });

  it("renders EN and ES language buttons", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("ES")).toBeInTheDocument();
  });

  it("has aria-label for accessibility", () => {
    render(<LanguageSwitcher />);
    const container = screen.getByLabelText("Language");
    expect(container).toBeInTheDocument();
  });

  it("marks the current locale button with aria-current", () => {
    render(<LanguageSwitcher />, { locale: "en" });
    const enButton = screen.getByText("EN");
    expect(enButton).toHaveAttribute("aria-current", "true");

    const esButton = screen.getByText("ES");
    expect(esButton).not.toHaveAttribute("aria-current");
  });

  it("applies bg-primary to the currently selected locale", () => {
    render(<LanguageSwitcher />, { locale: "en" });
    const enButton = screen.getByText("EN");
    expect(enButton.className).toContain("bg-primary");

    const esButton = screen.getByText("ES");
    expect(esButton.className).not.toContain("bg-primary");
    expect(esButton.className).toContain("text-muted-foreground");
  });

  it("calls router.replace with correct locale when clicking a button", () => {
    render(<LanguageSwitcher />, { locale: "en" });

    const esButton = screen.getByText("ES");
    fireEvent.click(esButton);

    expect(mockReplace).toHaveBeenCalledWith("/en", { locale: "es" });
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it("calls router.replace with es locale when clicking ES while on en", () => {
    render(<LanguageSwitcher />, { locale: "en" });

    fireEvent.click(screen.getByText("ES"));
    expect(mockReplace).toHaveBeenCalledWith("/en", { locale: "es" });
  });

  it("calls router.replace with en locale when clicking EN while on es", () => {
    render(<LanguageSwitcher />, { locale: "es" });

    fireEvent.click(screen.getByText("EN"));
    expect(mockReplace).toHaveBeenCalledWith("/en", { locale: "en" });
  });

  describe("pending state", () => {
    beforeEach(() => {
      mockIsPending.mockReturnValue(true);
    });

    it("shows loading indicator (Loader2) when pending", () => {
      render(<LanguageSwitcher />);
      // The Loader2 component renders an SVG with animate-spin class
      const container = document.querySelector(".animate-spin");
      expect(container).toBeInTheDocument();
    });

    it("applies opacity-70 and pointer-events-none when pending", () => {
      render(<LanguageSwitcher />);
      const container = screen.getByLabelText("Language");
      expect(container.className).toContain("opacity-70");
      expect(container.className).toContain("pointer-events-none");
    });

    it("sets aria-busy to true when pending", () => {
      render(<LanguageSwitcher />);
      const container = screen.getByLabelText("Language");
      expect(container).toHaveAttribute("aria-busy", "true");
    });
  });

  describe("non-pending state", () => {
    it("does not have Loader2 when not pending", () => {
      mockIsPending.mockReturnValue(false);
      render(<LanguageSwitcher />);
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeNull();
    });

    it("does not set aria-busy when not pending", () => {
      mockIsPending.mockReturnValue(false);
      render(<LanguageSwitcher />);
      const container = screen.getByLabelText("Language");
      expect(container).not.toHaveAttribute("aria-busy", "true");
    });
  });
});
