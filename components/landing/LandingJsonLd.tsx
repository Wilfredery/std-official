import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { landingUi, landingPath, type Landing } from "@/lib/data/landings";
import { ORG_ID, SITE_URL } from "@/lib/site";
import type { Service } from "@/lib/seo/types";

/** Absolute canonical URL of a landing (always Spanish, trailing slash). */
export function landingUrl(landing: Landing): string {
  return `${SITE_URL}/es${landingPath(landing.slug)}`;
}

// FAQPage is not part of the shared lib/seo/types union, so it is typed
// locally and rendered with the same escaping as <JsonLd>.
export interface FaqPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  inLanguage: string;
  mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[];
}

export function buildFaqSchema(landing: Landing): FaqPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-DO",
    mainEntity: landing.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildServiceSchema(landing: Landing): Service {
  return {
    "@type": "Service",
    name: landing.serviceName,
    description: landing.seoDescription,
    url: landingUrl(landing),
    serviceType: landing.serviceName,
    areaServed: ["Dominican Republic"],
    inLanguage: "es-DO",
    provider: { "@id": ORG_ID },
  };
}

export function LandingJsonLd({ landing }: { landing: Landing }) {
  const url = landingUrl(landing);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: landingUi.home, url: `${SITE_URL}/es/` },
          { name: landing.breadcrumbName, url },
        ]}
      />
      <JsonLd<Service> data={buildServiceSchema(landing)} />
      <script
        data-testid="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqSchema(landing)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
