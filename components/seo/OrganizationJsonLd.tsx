import { JsonLd } from "@/components/JsonLd";
import type {
  ContactPoint,
  EntityRef,
  OfferCatalog,
  OpeningHoursSpecification,
  Organization,
  Person,
  PostalAddress,
} from "@/lib/seo/types";

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
  openingHoursSpecification?: OpeningHoursSpecification[];
  founder?: Person | EntityRef;
  hasOfferCatalog?: OfferCatalog;
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
  openingHoursSpecification,
  founder,
  hasOfferCatalog,
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
    ...(openingHoursSpecification && { openingHoursSpecification }),
    ...(founder && { founder }),
    ...(hasOfferCatalog && { hasOfferCatalog }),
  };

  if (sameAs) {
    data.sameAs = sameAs;
  }

  return <JsonLd data={data} />;
}
