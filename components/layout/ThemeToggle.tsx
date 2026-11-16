"use client";

import { cloneElement, lazy, Suspense, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useHydrated } from "@/hooks/useHydrated";
import { Button } from "@/components/ui/button";

const loadThemeMenu = () => import("./ThemeMenu");
const ThemeMenu = lazy(() =>
  loadThemeMenu().then((mod) => ({ default: mod.ThemeMenu })),
);

export function ThemeToggle() {
  const t = useTranslations("nav");
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();
  const [menuRequested, setMenuRequested] = useState(false);

  const icon =
    mounted && resolvedTheme === "dark" ? (
      <Moon className="size-4" />
    ) : (
      <Sun className="size-4" />
    );

  const button = (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label={t("themeToggle")}
      aria-haspopup="menu"
    >
      {icon}
    </Button>
  );

  // Until the visitor reaches for it, render a plain button and keep the
  // dropdown out of the initial bundle. Hover/focus prefetches the chunk so
  // the menu opens without a visible delay on click.
  if (!menuRequested) {
    return cloneElement(button, {
      onPointerEnter: () => void loadThemeMenu(),
      onFocus: () => void loadThemeMenu(),
      onClick: () => setMenuRequested(true),
    });
  }

  return (
    <Suspense fallback={button}>
      <ThemeMenu trigger={button} />
    </Suspense>
  );
}
