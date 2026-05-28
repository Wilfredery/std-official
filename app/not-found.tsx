"use client";
import { useEffect } from "react";
export default function RootNotFound() {
  useEffect(() => {
    const path = window.location.pathname;
    // Si la URL ya tiene /es/ o /en/, usar ese locale
    const localeMatch = path.match(/^\/(es|en)\//);
    const dest = localeMatch
      ? `/${localeMatch[1]}/`
      : navigator.language.toLowerCase().startsWith("es")
        ? "/es/"
        : "/en/";
    window.location.replace(dest);
  }, []);
  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-muted-foreground">Redirecting…</p>
      </body>
    </html>
  );
}
