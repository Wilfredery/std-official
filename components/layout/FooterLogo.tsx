"use client";

import Image from "next/image";
import { useHydrated } from "@/hooks/useHydrated";
import { useTheme } from "@/lib/theme/ThemeContext";

// The only part of the footer that depends on client state. Decorative: the
// surrounding link carries the visible "ShineTechData" name.
export function FooterLogo() {
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();

  if (!mounted) {
    return (
      <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-xs">STD</span>
      </div>
    );
  }

  return (
    <Image
      src={
        resolvedTheme === "dark"
          ? "/images/navbarFooter/logo-dark.webp"
          : "/images/navbarFooter/logo-light.webp"
      }
      alt=""
      width={120}
      height={40}
      className="h-10 w-auto"
      loading="lazy"
    />
  );
}
