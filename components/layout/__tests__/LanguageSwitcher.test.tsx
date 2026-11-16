import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/lib/__tests__/test-utils";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

// ---------------------------------------------------------------------------
// Shared mutable references for mock hooks (set per test)
// ---------------------------------------------------------------------------

const mockReplace = vi.fn();

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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockReplace.mockClear();
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

  it("names each language button in its own language", () => {
    render(<LanguageSwitcher />, { locale: "en" });
    expect(screen.getByRole("button", { name: "Español" })).toHaveAttribute("lang", "es");
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute("lang", "en");
  });

  it("marks the current locale button with aria-current", () => {
    render(<LanguageSwitcher />, { locale: "en" });
    const enButton = screen.getByText("EN");
    expect(enButton).toHaveAttribute("aria-current", "true");

    const esButton = screen.getByText("ES");
    expect(esButton).not.toHaveAttribute("aria-current");
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

  it("never shows a loading indicator while switching locale", () => {
    render(<LanguageSwitcher />, { locale: "en" });

    fireEvent.click(screen.getByText("ES"));

    const container = screen.getByLabelText("Language");
    expect(container).not.toHaveAttribute("aria-busy");
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    expect(container.querySelector(".animate-spin")).toBeNull();
  });
});
