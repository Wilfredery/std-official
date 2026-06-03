import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeShortcut } from "@/components/layout/ThemeShortcut";
import { franklin } from "@/app/layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function localeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${franklin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem("theme");
                if (t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <OrganizationJsonLd
          name="ShineTechData"
          url={SITE_URL}
          logo={`${SITE_URL}/logo.png`}
          sameAs={[
            "https://linkedin.com/company/shinetechdata",
            "https://github.com/shinetechdata",
          ]}
        />
        <WebSiteJsonLd
          name="ShineTechData"
          url={SITE_URL}
          searchUrl={`${SITE_URL}/search?q={search_term_string}`}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeShortcut />
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
