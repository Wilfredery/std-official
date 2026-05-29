import { describe, it, expect, vi } from "vitest";
import { render } from "@/lib/__tests__/test-utils";
import { ThemeShortcut } from "@/components/layout/ThemeShortcut";

const mockUseThemeShortcut = vi.fn();

vi.mock("@/hooks/useThemeShortcut", () => ({
  useThemeShortcut: () => mockUseThemeShortcut(),
}));

describe("ThemeShortcut", () => {
  it("renders null (no DOM output)", () => {
    const { container } = render(<ThemeShortcut />);
    expect(container.innerHTML).toBe("");
  });

  it("calls useThemeShortcut hook on render", () => {
    mockUseThemeShortcut.mockClear();
    render(<ThemeShortcut />);
    expect(mockUseThemeShortcut).toHaveBeenCalled();
  });
});
