import { JsonLd } from "@/components/JsonLd";
import type { WebSite, SearchAction } from "@/lib/seo/types";

interface WebSiteJsonLdProps {
  name: string;
  url: string;
  searchUrl?: string;
}

export function WebSiteJsonLd({
  name,
  url,
  searchUrl,
}: WebSiteJsonLdProps) {
  const data: WebSite = {
    "@type": "WebSite",
    name,
    url,
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
