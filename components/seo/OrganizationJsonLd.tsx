import { JsonLd } from "@/components/JsonLd";
import type { ContactPoint, Organization, PostalAddress } from "@/lib/seo/types";

interface OrganizationJsonLdProps {
  /** Defaults to "Organization"; use "ProfessionalService" for the business entity. */
  type?: Organization["@type"];
  id?: string;
  name: string;
  url: string;
  description?: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  areaServed?: string[];
  knowsLanguage?: string[];
  sameAs?: string[];
}

export function OrganizationJsonLd({
  type = "Organization",
  id,
  name,
  url,
  description,
  logo,
  email,
  telephone,
  address,
  contactPoint,
  areaServed,
  knowsLanguage,
  sameAs,
}: OrganizationJsonLdProps) {
  const data: Organization = {
    "@type": type,
    ...(id && { "@id": id }),
    name,
    url,
    ...(description && { description }),
    ...(logo && { logo }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(address && { address }),
    ...(contactPoint && { contactPoint }),
    ...(areaServed && { areaServed }),
    ...(knowsLanguage && { knowsLanguage }),
  };

  if (sameAs) {
    data.sameAs = sameAs;
  }

  return <JsonLd data={data} />;
}
