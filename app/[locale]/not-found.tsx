"use client";

import { useEffect, useState } from "react";

export default function LocaleNotFound() {
  const [showFallback, setShowFallback] = useState(false);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const pathname = window.location.pathname;
    const detectedLocale = pathname.startsWith("/es") ? "es" : "en";
    setLocale(detectedLocale);
    const dest = `/${detectedLocale}/`;

    // Protection: if already at home, never redirect
    if (pathname === dest || pathname === `/${detectedLocale}`) {
      setShowFallback(true);
      return;
    }

    // Anti-loop via sessionStorage (5-second window)
    const raw = sessionStorage.getItem("std-404-redirect");
    if (raw) {
      try {
        const prev = JSON.parse(raw);
        if (prev.url === dest && Date.now() - prev.time < 5_000) {
          setShowFallback(true);
          return; // Loop detected, show static 404 fallback
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

  if (!showFallback) {
    return (
      <html>
        <body />
      </html>
    );
  }

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="gradient-text text-8xl font-extrabold sm:text-9xl">
            404
          </h1>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Page not found
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-8">
            <a
              href={`/${locale}/`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
