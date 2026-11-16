import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { franklin } from "@/app/layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

export const metadata: Metadata = {
  title: "404 | ShineTechData",
  robots: { index: false },
};

const versions = [
  { locale: "es", t: esMessages.notFound },
  { locale: "en", t: enMessages.notFound },
] as const;

// Paths outside any locale (e.g. /foo/ or /xx/foo/). There is no locale to go
// by, and reading Accept-Language here would force every route to render
// dynamically, so the page shows both languages.
export default function RootNotFound() {
  return (
    <html
      lang="es"
      className={`${franklin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Next renders this page client-side (the root layout has no
            <html>), so the theme comes from the provider, not a script. */}
        <ThemeProvider>
          <main className="flex flex-1 items-center justify-center py-20">
            <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
              <h1 className="gradient-text text-8xl font-extrabold sm:text-9xl">
                404
              </h1>
              {versions.map(({ locale, t }) => (
                <section key={locale} lang={locale} className="mt-10">
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {t.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                  <a
                    href={`/${locale}/`}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    {t.backToHome}
                  </a>
                </section>
              ))}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
