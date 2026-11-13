import { JsonLd } from "@/components/JsonLd";
import type { ContactPoint, Organization, PostalAddress } from "@/lib/seo/types";

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  email,
  telephone,
  address,
  contactPoint,
  sameAs,
}: OrganizationJsonLdProps) {
  const data: Organization = {
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(address && { address }),
    ...(contactPoint && { contactPoint }),
  };

  if (sameAs) {
    data.sameAs = sameAs;
  }

  return <JsonLd data={data} />;
}
