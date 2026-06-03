import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ThemeProvider } from "@/components/providers/theme-provider";

vi.mock("@/lib/theme/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="custom-theme-provider">{children}</div>
  ),
  useTheme: () => ({
    theme: "light" as const,
    setTheme: vi.fn(),
    resolvedTheme: "light" as const,
    themes: ["light", "dark", "system"] as const,
  }),
}));

describe("ThemeProvider", () => {
  it("renders children passed to it", () => {
    render(
      <ThemeProvider>
        <span data-testid="child">Hello World</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Hello World");
  });

  it("wraps children in the custom ThemeProvider", () => {
    render(
      <ThemeProvider>
        <span>Content</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId("custom-theme-provider")).toBeInTheDocument();
  });
});
