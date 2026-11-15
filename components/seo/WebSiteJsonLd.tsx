import { JsonLd } from "@/components/JsonLd";
import type { WebSite, SearchAction } from "@/lib/seo/types";

interface WebSiteJsonLdProps {
  id?: string;
  name: string;
  url: string;
  inLanguage?: string[];
  publisherId?: string;
  searchUrl?: string;
}

export function WebSiteJsonLd({
  id,
  name,
  url,
  inLanguage,
  publisherId,
  searchUrl,
}: WebSiteJsonLdProps) {
  const data: WebSite = {
    "@type": "WebSite",
    ...(id && { "@id": id }),
    name,
    url,
    ...(inLanguage && { inLanguage }),
    ...(publisherId && { publisher: { "@id": publisherId } }),
  };

  if (searchUrl) {
    const searchAction: SearchAction = {
      "@type": "SearchAction",
      target: searchUrl,
      "query-input": "required name=search_term_string",
    };
    data.potentialAction = searchAction;
  }

  return <JsonLd data={data} />;
}
