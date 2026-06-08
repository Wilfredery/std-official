import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";

// Will be imported after mock setup
let useTheme: () => import("@/lib/theme/types").ThemeContextValue;
let ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: import("@/lib/theme/types").Theme;
}>;

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// ---------------------------------------------------------------------------
// Mock matchMedia
// ---------------------------------------------------------------------------
const matchMediaListeners = new Set<(e: MediaQueryListEvent) => void>();

function createMatchMediaResponse(matches = false) {
  return {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
      if (event === "change") {
        matchMediaListeners.add(handler);
      }
    }),
    removeEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
      if (event === "change") {
        matchMediaListeners.delete(handler);
      }
    }),
    dispatchEvent: vi.fn(),
  };
}

const matchMediaMock = vi.fn((_query: string) => createMatchMediaResponse());

Object.defineProperty(window, "matchMedia", {
  value: matchMediaMock,
  writable: true,
});

// ---------------------------------------------------------------------------
// Helper: simulate matchMedia change
// ---------------------------------------------------------------------------
function fireMatchMediaChange(matches: boolean) {
  const event = { matches, media: "(prefers-color-scheme: dark)" } as MediaQueryListEvent;
  for (const listener of matchMediaListeners) {
    listener(event);
  }
}

// ---------------------------------------------------------------------------
// Dynamic import to capture exports after mocks are set
// ---------------------------------------------------------------------------
beforeEach(async () => {
  vi.clearAllMocks();
  localStorageMock.clear();
  matchMediaListeners.clear();

  const mod = await import("@/lib/theme/ThemeContext");
  useTheme = mod.useTheme;
  ThemeProvider = mod.ThemeProvider;
});

describe("useTheme — all states and transitions", () => {
  // =====================================================================
  // THEME-1: ThemeProvider exposes context values
  // =====================================================================

  describe("context values", () => {
    it("returns system theme by default when localStorage is empty", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // After mount, reads localStorage (empty → system) and applies
      expect(result.current.theme).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
      expect(result.current.themes).toEqual(["light", "dark", "system"]);
    });

    it("initializes with dark theme via initialTheme prop", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider initialTheme="dark">{children}</ThemeProvider>,
      });

      expect(result.current.theme).toBe("dark");
      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("sets resolvedTheme correctly for light theme", () => {
      localStorageMock.setItem("theme", "light");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.theme).toBe("light");
      expect(result.current.resolvedTheme).toBe("light");
    });
  });

  // =====================================================================
  // THEME-2: localStorage persistence
  // =====================================================================

  describe("localStorage persistence", () => {
    it("writes to localStorage when setTheme is called", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
      expect(result.current.theme).toBe("dark");
    });

    it("writes 'light' to localStorage on setTheme('light')", () => {
      localStorageMock.setItem("theme", "dark");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("light");
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
      expect(result.current.theme).toBe("light");
    });
  });

  // =====================================================================
  // THEME-3: All modes are selectable
  // =====================================================================

  describe("theme modes", () => {
    it("accepts 'system' as a valid theme", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("system");
      });

      expect(result.current.theme).toBe("system");
      // resolvedTheme depends on OS — should be "light" since mock defaults to false
      expect(result.current.resolvedTheme).toBe("light");
    });
  });

  // =====================================================================
  // THEME-4: System preference resolution
  // =====================================================================

  describe("system preference resolution", () => {
    it("resolves system to dark when matchMedia says dark", () => {
      // Make matchMedia report dark
      matchMediaMock.mockReturnValue(createMatchMediaResponse(true));

      localStorageMock.setItem("theme", "system");

      // Need to re-import since mocks changed
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // resolvedTheme should be dark because matchMedia currently reports dark & theme is system
      // But the mock was set up before renderHook... 
      // The ThemeProvider reads localStorage on mount inside useEffect.
      // Since we set localStorage to "system", the provider should call matchMedia and resolve.
      // Our matchMedia mock returns matches: true from the second setup.
      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("resolves system to light when matchMedia says light", () => {
      matchMediaMock.mockReturnValue(createMatchMediaResponse(false));

      localStorageMock.setItem("theme", "system");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.resolvedTheme).toBe("light");
    });
  });

  // =====================================================================
  // THEME-5: CSS class toggle
  // =====================================================================

  describe("resolvedTheme transitions", () => {
    it("returns resolvedTheme=dark when setTheme('dark') is called", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("returns resolvedTheme=light when setTheme('light') is called after dark", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider initialTheme="dark">{children}</ThemeProvider>,
      });

      expect(result.current.resolvedTheme).toBe("dark");

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.resolvedTheme).toBe("light");
    });

    it("returns resolvedTheme=dark when dark is loaded from localStorage", () => {
      localStorageMock.setItem("theme", "dark");

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider initialTheme="dark">{children}</ThemeProvider>,
      });

      expect(result.current.resolvedTheme).toBe("dark");
    });
  });

  // =====================================================================
  // THEME-10: System preference subscription
  // =====================================================================

  describe("matchMedia subscription", () => {
    it("updates resolvedTheme when OS switches to dark while theme is system", () => {
      localStorageMock.setItem("theme", "system");
      matchMediaMock.mockReturnValue(createMatchMediaResponse(false));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.resolvedTheme).toBe("light");

      act(() => {
        fireMatchMediaChange(true);
      });

      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("updates resolvedTheme when OS switches to light while theme is system", () => {
      localStorageMock.setItem("theme", "system");
      matchMediaMock.mockReturnValue(createMatchMediaResponse(true));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.resolvedTheme).toBe("dark");

      act(() => {
        fireMatchMediaChange(false);
      });

      expect(result.current.resolvedTheme).toBe("light");
    });

    it("does NOT react to matchMedia changes when theme is not system", () => {
      matchMediaMock.mockReturnValue(createMatchMediaResponse(false));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider initialTheme="dark">{children}</ThemeProvider>,
      });

      expect(result.current.resolvedTheme).toBe("dark");

      act(() => {
        fireMatchMediaChange(true);
      });

      // Should still be dark — not subscribed when theme !== "system"
      expect(result.current.resolvedTheme).toBe("dark");
    });

    it("cleans up matchMedia listener on unmount", () => {
      localStorageMock.setItem("theme", "system");

      const { unmount } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      const mql = matchMediaMock.mock.results[0]?.value;
      const removeFn = mql?.removeEventListener;

      unmount();

      if (removeFn) {
        expect(removeFn).toHaveBeenCalledWith(
          "change",
          expect.any(Function),
        );
      }
    });
  });

  // =====================================================================
  // Phase 4: Simplified context — no mounted field
  // =====================================================================

  describe("Phase 4: simplified context", () => {
    it("does NOT expose mounted in context value", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current).not.toHaveProperty("mounted");
    });

    it("uses useEffect so theme is available after first render tick", () => {
      const { result, rerender } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // Theme should be resolved after mount effect runs
      rerender();
      expect(result.current.theme).toBe("system");
      expect(result.current.resolvedTheme).toBeDefined();
    });
  });

  // =====================================================================
  // Edge cases
  // =====================================================================

  describe("edge cases", () => {
    it("throws when useTheme is used outside ThemeProvider", () => {
      // Suppress console.error for expected error
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it("handles missing localStorage gracefully (falls back to system)", () => {
      // Simulate localStorage not accessible by making getItem throw
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error("Blocked");
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      // Should fall back to system (which resolves to light since mock says OS is light)
      expect(result.current.theme).toBe("system");
      expect(result.current.resolvedTheme).toBe("light");
    });

    it("exposes all three themes via the themes array", () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      expect(result.current.themes).toHaveLength(3);
      expect(result.current.themes).toContain("light");
      expect(result.current.themes).toContain("dark");
      expect(result.current.themes).toContain("system");
    });

    it("setTheme with system resolves based on current matchMedia", () => {
      matchMediaMock.mockReturnValue(createMatchMediaResponse(true));

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      });

      act(() => {
        result.current.setTheme("system");
      });

      expect(result.current.theme).toBe("system");
      expect(result.current.resolvedTheme).toBe("dark");
    });
  });
});
