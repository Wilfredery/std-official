import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeShortcut } from "@/components/layout/ThemeShortcut";
import { franklin } from "@/app/layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { SuppressScriptError } from "@/components/errors/SuppressScriptError";
import {
  AREA_SERVED,
  FOUNDER_AUTHOR_ID,
  ORG_ID,
  SITE_URL,
  WEBSITE_ID,
  personId,
} from "@/lib/site";
import { blogAuthors, toBlogLocale } from "@/lib/data/blog";
import { serviceSlugs } from "@/lib/data/services";
import type { OpeningHoursSpecification } from "@/lib/seo/types";
import { filterMessages, SHARED_NAMESPACES } from "@/lib/i18n/namespaces";

const BUSINESS_HOURS: OpeningHoursSpecification = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "18:00",
};

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
  const tOrg = await getTranslations({ locale, namespace: "seo.organization" });
  const tServices = await getTranslations({ locale, namespace: "serviceDetail.services" });
  const founder = blogAuthors[FOUNDER_AUTHOR_ID];

  return (
    <html
      lang={locale}
      className={`${franklin.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Suppress React 19 warning about <script> in Server Components.
            This is a known false-positive with Next.js 16 + Turbopack. */}
        <SuppressScriptError />
        {/* Anti-flash script: MUST be inside <body>, not <head>.
            Next.js hoists it to <head> automatically. */}
        <Script
          id="theme-anti-flash"
          src="/theme-anti-flash.js"
          strategy="beforeInteractive"
        />
        <OrganizationJsonLd
          type="ProfessionalService"
          id={ORG_ID}
          name="ShineTechData"
          url={SITE_URL}
          description={tOrg("description")}
          logo={`${SITE_URL}/images/navbarFooter/logo-light.webp`}
          email="contact@shinetechdata.com"
          telephone="+1-829-584-9184"
          address={{
            "@type": "PostalAddress",
            addressLocality: "San Pedro de Macorís",
            addressRegion: "San Pedro de Macorís",
            postalCode: "21000",
            addressCountry: "DO",
          }}
          areaServed={AREA_SERVED}
          knowsLanguage={["es", "en"]}
          contactPoint={[
            {
              "@type": "ContactPoint",
              contactType: "customer service",
              telephone: "+1-829-584-9184",
              email: "contact@shinetechdata.com",
              availableLanguage: ["Spanish", "English"],
              hoursAvailable: BUSINESS_HOURS,
            },
          ]}
          openingHoursSpecification={[BUSINESS_HOURS]}
          founder={{
            "@type": "Person",
            "@id": personId(founder.id),
            name: founder.name,
            jobTitle: founder.jobTitle[toBlogLocale(locale)],
            sameAs: founder.sameAs,
          }}
          hasOfferCatalog={{
            "@type": "OfferCatalog",
            name: tOrg("catalogName"),
            itemListElement: serviceSlugs.map((slug) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: tServices(`${slug}.title`),
                url: `${SITE_URL}/${locale}/services/${slug}/`,
              },
            })),
          }}
          sameAs={[
            "https://www.linkedin.com/company/shine-tech-data/",
            "https://clutch.co/profile/shinetechdata",
            "https://github.com/shinetechdata",
            "https://www.instagram.com/shinetechdata/",
          ]}
        />
        <WebSiteJsonLd
          id={WEBSITE_ID}
          name="ShineTechData"
          url={SITE_URL}
          inLanguage={["en-US", "es-DO"]}
          publisherId={ORG_ID}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeShortcut />
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
