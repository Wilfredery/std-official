import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(),
  setRequestLocale: vi.fn(),
}));

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children, className }: Record<string, unknown>) => (
    <a href={href as string} className={className as string}>
      {children as React.ReactNode}
    </a>
  ),
}));

import * as dataPage from "@/app/[locale]/consultoria-de-datos-republica-dominicana/page";
import * as biPage from "@/app/[locale]/consultor-power-bi-republica-dominicana/page";
import * as localGovPage from "@/app/[locale]/business-intelligence-for-local-government/page";
import { BOOKING_URL, ORG_ID, SITE_URL } from "@/lib/site";
import { getLandingBySlug, landings, landingUi } from "@/lib/data/landings";

const pages = [
  {
    slug: "consultoria-de-datos-republica-dominicana",
    mod: dataPage,
    locale: "es",
    other: "en",
    og: "es_DO",
    lang: "es-DO",
    area: ["Dominican Republic"],
  },
  {
    slug: "consultor-power-bi-republica-dominicana",
    mod: biPage,
    locale: "es",
    other: "en",
    og: "es_DO",
    lang: "es-DO",
    area: ["Dominican Republic"],
  },
  {
    slug: "business-intelligence-for-local-government",
    mod: localGovPage,
    locale: "en",
    other: "es",
    og: "en_US",
    lang: "en-US",
    area: ["United States"],
  },
] as const;

function jsonLdOf(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]'),
  ).map((s) => JSON.parse(s.innerHTML));
}

describe.each(pages)("landing page $slug", ({ slug, mod, locale, other, og, lang, area }) => {
  const landing = getLandingBySlug(slug)!;
  const canonical = `${SITE_URL}/${locale}/${slug}/`;

  beforeEach(() => {
    notFoundMock.mockClear();
  });

  it("is statically generated for its own locale only and 404s everything else", () => {
    expect(landing.locale).toBe(locale);
    expect(mod.dynamicParams).toBe(false);
    expect(mod.generateStaticParams()).toEqual([{ locale }]);
  });

  it("returns canonical, single-locale hreflang, OG and Twitter metadata", async () => {
    const meta = await mod.generateMetadata({ params: Promise.resolve({ locale }) });

    expect(meta.title).toBe(landing.seoTitle);
    expect(meta.description).toBe(landing.seoDescription);
    expect(meta.alternates?.canonical).toBe(canonical);
    expect(canonical.endsWith("/")).toBe(true);
    expect(meta.alternates?.languages).toEqual({ [locale]: canonical });
    expect(meta.openGraph).toMatchObject({
      url: canonical,
      locale: og,
      siteName: "ShineTechData",
      images: [{ url: `${SITE_URL}/opengraph-image.png`, width: 1200, height: 630 }],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      images: [`${SITE_URL}/opengraph-image.png`],
    });
  });

  it("renders nothing and 404s for the other locale", async () => {
    await expect(
      mod.default({ params: Promise.resolve({ locale: other }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();
    expect(await mod.generateMetadata({ params: Promise.resolve({ locale: other }) })).toEqual({});
  });

  it("renders H1, booking + contact CTAs and real internal links", async () => {
    const ui = await mod.default({ params: Promise.resolve({ locale }) });
    const { container, getAllByRole } = render(ui);

    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toBe(landing.h1);
    expect(container.querySelectorAll("h1")).toHaveLength(1);

    const hrefs = getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain(BOOKING_URL);
    expect(hrefs).toContain("/contact/");
    expect(hrefs).toContain("/services/data-analysis/");
    expect(hrefs).toContain("/services/business-intelligence/");
    expect(hrefs).toContain("/services/data-auditing/");
    expect(hrefs).toContain("/blog/");
    for (const sibling of landings.filter((l) => l.slug !== slug && l.locale === locale)) {
      expect(hrefs).toContain(`/${sibling.slug}/`);
    }

    const booking = getAllByRole("link").find((a) => a.getAttribute("href") === BOOKING_URL)!;
    expect(booking).toHaveAttribute("target", "_blank");
    expect(booking.getAttribute("rel")).toContain("noopener");
  });

  it("emits BreadcrumbList, Service and FAQPage JSON-LD", async () => {
    const ui = await mod.default({ params: Promise.resolve({ locale }) });
    const { container } = render(ui);
    const schemas = jsonLdOf(container);

    const byType = Object.fromEntries(schemas.map((s) => [s["@type"], s]));
    expect(Object.keys(byType).sort()).toEqual(["BreadcrumbList", "FAQPage", "Service"]);

    expect(byType.BreadcrumbList.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: landingUi[locale].home,
        item: `${SITE_URL}/${locale}/`,
      },
      { "@type": "ListItem", position: 2, name: landing.breadcrumbName, item: canonical },
    ]);

    expect(byType.Service).toMatchObject({
      "@context": "https://schema.org",
      name: landing.serviceName,
      url: canonical,
      areaServed: area,
      inLanguage: lang,
      provider: { "@id": ORG_ID },
    });

    expect(byType.FAQPage["@context"]).toBe("https://schema.org");
    expect(byType.FAQPage.mainEntity).toHaveLength(landing.faq.length);
    expect(byType.FAQPage.mainEntity[0]).toEqual({
      "@type": "Question",
      name: landing.faq[0].question,
      acceptedAnswer: { "@type": "Answer", text: landing.faq[0].answer },
    });
  });
});
