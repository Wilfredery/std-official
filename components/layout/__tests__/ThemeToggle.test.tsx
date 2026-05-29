import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/lib/__tests__/test-utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// ---------------------------------------------------------------------------
// Shared mutable references
// ---------------------------------------------------------------------------

const mockSetTheme = vi.fn();
const mockHydrated = vi.hoisted(() => vi.fn<() => boolean>());

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
    resolvedTheme: "light",
    themes: ["light", "dark", "system"],
  }),
}));

vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => mockHydrated(),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({
    render,
  }: {
    render: React.ReactNode;
  }) => <div data-testid="dropdown-trigger">{render}</div>,
  DropdownMenuContent: ({
    children,
    align,
    sideOffset,
  }: {
    children: React.ReactNode;
    align?: string;
    sideOffset?: number;
  }) => (
    <div
      data-testid="dropdown-content"
      data-align={align}
      data-side-offset={sideOffset}
    >
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      data-testid="dropdown-item"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockHydrated.mockReturnValue(true);
  });

  describe("before hydration", () => {
    it("renders a Sun icon button while not mounted", () => {
      mockHydrated.mockReturnValue(false);

      const { container } = render(<ThemeToggle />);
      // Should be a Button with Sun icon; Sun is an SVG from lucide
      const sunIcon = container.querySelector("svg");
      expect(sunIcon).toBeInTheDocument();
      // Should not have dropdown yet
      expect(
        container.querySelector('[data-testid="dropdown-menu"]'),
      ).toBeNull();
    });
  });

  describe("after hydration", () => {
    it("renders the dropdown trigger with Sun icon when resolved theme is light", () => {
      const { container } = render(<ThemeToggle />);

      const trigger = screen.getByTestId("dropdown-trigger");
      expect(trigger).toBeInTheDocument();

      const sunIcon = container.querySelector("svg");
      expect(sunIcon).toBeInTheDocument();
    });

    it("renders three theme options: Light, Dark, System", () => {
      render(<ThemeToggle />);

      const items = screen.getAllByTestId("dropdown-item");
      expect(items).toHaveLength(3);

      expect(items[0]).toHaveTextContent("Light");
      expect(items[1]).toHaveTextContent("Dark");
      expect(items[2]).toHaveTextContent("System");
    });

    it("calls setTheme with 'light' when Light is clicked", () => {
      render(<ThemeToggle />);

      const items = screen.getAllByTestId("dropdown-item");
      fireEvent.click(items[0]); // Light

      expect(mockSetTheme).toHaveBeenCalledWith("light");
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it("calls setTheme with 'dark' when Dark is clicked", () => {
      render(<ThemeToggle />);

      const items = screen.getAllByTestId("dropdown-item");
      fireEvent.click(items[1]); // Dark

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("calls setTheme with 'system' when System is clicked", () => {
      render(<ThemeToggle />);

      const items = screen.getAllByTestId("dropdown-item");
      fireEvent.click(items[2]); // System

      expect(mockSetTheme).toHaveBeenCalledWith("system");
    });
  });
});
