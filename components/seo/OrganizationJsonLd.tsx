import { JsonLd } from "@/components/JsonLd";
import type { Organization } from "@/lib/seo/types";

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  sameAs,
}: OrganizationJsonLdProps) {
  const data: Organization = {
    "@type": "Organization",
    name,
    url,
  };

  if (logo) {
    data.logo = logo;
  }

  if (sameAs) {
    data.sameAs = sameAs;
  }

  return <JsonLd data={data} />;
}
