import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ThemeProvider } from "@/components/providers/theme-provider";

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-themes-provider">{children}</div>
  ),
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

  it("wraps children in the next-themes ThemeProvider", () => {
    render(
      <ThemeProvider>
        <span>Content</span>
      </ThemeProvider>
    );

    expect(screen.getByTestId("next-themes-provider")).toBeInTheDocument();
  });
});
