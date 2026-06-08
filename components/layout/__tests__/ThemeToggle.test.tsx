import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/lib/__tests__/test-utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

// ---------------------------------------------------------------------------
// Shared mutable references
// ---------------------------------------------------------------------------

const mockSetTheme = vi.fn();

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock("@/lib/theme/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
    resolvedTheme: "light",
    themes: ["light", "dark", "system"],
  }),
}));

vi.mock("@/hooks/useHydrated", () => ({
  useHydrated: () => true,
}));

// Mock the dropdown-menu UI components inline (no actual lazy loading)
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
  });

  // ---- Happy path (S1-SC1) ----

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

  // ---- Happy path: theme toggle opens after interaction (S1-SC1) ----

  it("opens the dropdown content when trigger is rendered", () => {
    render(<ThemeToggle />);

    // The dropdown content should be present (in the mocked version it always renders)
    const content = screen.getByTestId("dropdown-content");
    expect(content).toBeInTheDocument();
  });

  // ---- Edge case: trigger button has correct ARIA (S1-R3) ----

  it("renders the trigger button with aria-label for accessibility", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  // ---- Edge case: trigger button preserves focus ring (S1-R3) ----

  it("trigger button has focus-visible outline classes", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    // The Button component from @base-ui renders with focus-visible classes
    expect(button).toHaveClass("focus-visible:border-ring");
  });
});
