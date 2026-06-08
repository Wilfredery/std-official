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
import { createWebVitalsScript } from "@/lib/web-vitals";
import { SITE_URL } from "@/lib/site";
import { filterMessages, SHARED_NAMESPACES } from "@/lib/i18n/namespaces";

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
  const allMessages = await getMessages();
  const messages = filterMessages(allMessages, SHARED_NAMESPACES);

  return (
    <html
      lang={locale}
      className={`${franklin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
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
            <script
              type="module"
              dangerouslySetInnerHTML={{
                __html: createWebVitalsScript(),
              }}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
