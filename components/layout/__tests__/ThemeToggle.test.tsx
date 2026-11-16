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

// Inline stand-ins for the dropdown primitives (the real menu is lazy-loaded
// by ThemeToggle on first click; these keep the assertions synchronous once
// the lazy chunk resolves).
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ render }: { render: React.ReactNode }) => (
    <div data-testid="dropdown-trigger">{render}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
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
    <button data-testid="dropdown-item" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

async function openMenu(locale: "en" | "es" = "en") {
  const utils = render(<ThemeToggle />, { locale });
  fireEvent.click(screen.getByRole("button"));
  await screen.findByTestId("dropdown-content");
  return utils;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  it("renders a plain button with the Sun icon before any interaction", () => {
    const { container } = render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
    // The dropdown stays out of the initial render (and bundle)
    expect(screen.queryByTestId("dropdown-menu")).not.toBeInTheDocument();
  });

  it("loads and opens the menu on click", async () => {
    await openMenu();
    expect(screen.getByTestId("dropdown-trigger")).toBeInTheDocument();
  });

  it("renders three theme options: Light, Dark, System", async () => {
    await openMenu();

    const items = screen.getAllByTestId("dropdown-item");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent("Light");
    expect(items[1]).toHaveTextContent("Dark");
    expect(items[2]).toHaveTextContent("System");
  });

  it("localizes the label and options in Spanish", async () => {
    await openMenu("es");

    expect(screen.getByRole("button", { name: "Cambiar tema" })).toBeInTheDocument();
    const items = screen.getAllByTestId("dropdown-item");
    expect(items.map((i) => i.textContent)).toEqual(["Claro", "Oscuro", "Sistema"]);
  });

  it.each([
    [0, "light"],
    [1, "dark"],
    [2, "system"],
  ])("calls setTheme for option %i (%s)", async (index, value) => {
    await openMenu();

    fireEvent.click(screen.getAllByTestId("dropdown-item")[index]);
    expect(mockSetTheme).toHaveBeenCalledWith(value);
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it("trigger button has focus-visible outline classes", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Change theme" })).toHaveClass(
      "focus-visible:border-ring",
    );
  });
});
