import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react";

const mockSetTheme = vi.fn();
let currentTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: currentTheme,
    setTheme: mockSetTheme,
  }),
}));

import { useThemeShortcut } from "@/hooks/useThemeShortcut";

describe("useThemeShortcut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentTheme = "light";
  });

  it("toggles theme from light to dark when pressing 'd'", () => {
    renderHook(() => useThemeShortcut());

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    });

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles theme from dark to light when pressing 'd'", () => {
    currentTheme = "dark";
    renderHook(() => useThemeShortcut());

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    });

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("does not trigger when modifier keys are held", () => {
    renderHook(() => useThemeShortcut());

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "d", ctrlKey: true }),
      );
    });

    expect(mockSetTheme).not.toHaveBeenCalled();
  });

  it("does not trigger from input elements", () => {
    renderHook(() => useThemeShortcut());

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "d", bubbles: true }),
      );
    });

    expect(mockSetTheme).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
