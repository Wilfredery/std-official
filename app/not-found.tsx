"use client";

import { useEffect } from "react";

export default function RootNotFound() {
  useEffect(() => {
    const pathname = window.location.pathname;

    // Detect locale from URL or browser
    const hasLocalePrefix =
      pathname.startsWith("/es/") || pathname.startsWith("/en/");
    const locale = hasLocalePrefix
      ? pathname.startsWith("/es")
        ? "es"
        : "en"
      : navigator.language.startsWith("es")
        ? "es"
        : "en";

    const dest = `/${locale}/`;

    // Protection: if already at home, never redirect
    if (pathname === dest || pathname === `/${locale}`) {
      return;
    }

    // Anti-loop via sessionStorage
    const raw = sessionStorage.getItem("std-404-redirect");
    if (raw) {
      try {
        const prev = JSON.parse(raw);
        if (prev.url === dest && Date.now() - prev.time < 5_000) {
          return; // Loop detected, show blank 404
        }
      } catch {
        // corrupted entry → ignore
      }
    }

    sessionStorage.setItem(
      "std-404-redirect",
      JSON.stringify({ url: dest, time: Date.now() }),
    );
    window.location.replace(dest);
  }, []);

  return (
    <html>
      <body />
    </html>
  );
}
