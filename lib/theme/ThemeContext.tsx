"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Theme, ResolvedTheme, ThemeContextValue } from "@/lib/theme/types";
import { THEMES } from "@/lib/theme/types";

const STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    try {
      return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
    } catch {
      return "light";
    }
  }
  return theme;
}

function applyThemeClass(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage blocked — fall through
  }
  return "system";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  // Use a fixed initial value for SSR/hydration safety.
  // LocalStorage is read inside useEffect to avoid hydration mismatch.
  // Tests can pass initialTheme directly for deterministic behavior.
  const [theme, setThemeState] = useState<Theme>(initialTheme ?? "system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(
    initialTheme ? resolveTheme(initialTheme) : "light",
  );

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // localStorage blocked — ignore
    }
  };

  // On mount: read stored preference and apply (useEffect instead of
  // useLayoutEffect — does not block paint; minimal flash is acceptable).
  useEffect(() => {
    if (initialTheme) {
      applyThemeClass(resolveTheme(initialTheme));
      return;
    }

    const stored = readStoredTheme();
    setThemeState(stored);
    const resolved = resolveTheme(stored);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
  }, [initialTheme]);

  // Subscribe to matchMedia when theme === "system"
  useEffect(() => {
    if (theme !== "system") return;

    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(MEDIA_QUERY);
    } catch {
      return;
    }

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
    };

    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme, themes: THEMES }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      "useTheme must be used within a ThemeProvider. Wrap your app with <ThemeProvider>.",
    );
  }
  return ctx;
}
