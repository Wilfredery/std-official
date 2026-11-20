"use client";

import Image from "next/image";
import { useHydrated } from "@/hooks/useHydrated";
import { useTheme } from "@/lib/theme/ThemeContext";

// Static imports: Next hashes the file name and serves it with a one-year
// immutable Cache-Control, unlike plain /public paths (max-age=0).
import IMG_DARK from "@/public/images/about/about-dark.webp";
import IMG_LIGHT from "@/public/images/about/about-light.webp";

export function AboutThemedImage({ alt }: { alt: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useHydrated();

  if (!mounted) {
    return <div className="w-full h-full bg-muted animate-pulse rounded-2xl" />;
  }

  return (
    <Image
      src={resolvedTheme === "dark" ? IMG_DARK : IMG_LIGHT}
      alt={alt}
      fill
      className="object-contain"
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority
      fetchPriority="high"
    />
  );
}
