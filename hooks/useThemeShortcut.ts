"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function useThemeShortcut() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [theme, setTheme]);
}
