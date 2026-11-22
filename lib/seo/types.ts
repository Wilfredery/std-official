export interface SearchAction {
  "@type": "SearchAction";
  target: string;
  "query-input": string;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface ContactPoint {
  "@type": "ContactPoint";
  contactType: string;
  telephone?: string;
  email?: string;
  availableLanguage?: string[];
  areaServed?: string | string[];
  hoursAvailable?: OpeningHoursSpecification;
}

export interface PostalAddress {
  "@type": "PostalAddress";
  addressCountry: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
}

/** Reference to an entity declared elsewhere on the page/site by `@id`. */
export interface EntityRef {
  "@id": string;
}

export interface Organization {
  /** ProfessionalService is a schema.org Organization subtype (via LocalBusiness). */
  "@type": "Organization" | "ProfessionalService";
  "@id"?: string;
  name: string;
  description?: string;
  url: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  areaServed?: string[];
  knowsLanguage?: string[];
  sameAs?: string[];
  /** Business hours; LocalBusiness subtypes are read from here, not from contactPoint. */
  openingHoursSpecification?: OpeningHoursSpecification[];
  founder?: Person | EntityRef;
  hasOfferCatalog?: OfferCatalog;
}

export interface Offer {
  "@type": "Offer";
  itemOffered: { "@type": "Service"; name: string; url: string };
}

export interface OfferCatalog {
  "@type": "OfferCatalog";
  name: string;
  itemListElement: Offer[];
}

export interface WebPage {
  "@type": "WebPage";
  "@id": string;
  url: string;
  name: string;
  description?: string;
  inLanguage: string;
  isPartOf: EntityRef;
  about?: EntityRef;
  publisher?: EntityRef;
}

export interface Person {
  "@type": "Person";
  "@id"?: string;
  name: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
  worksFor?: Organization | EntityRef;
}

export interface WebSite {
  "@type": "WebSite";
  "@id"?: string;
  name: string;
  url: string;
  inLanguage?: string[];
  publisher?: EntityRef;
  potentialAction?: SearchAction;
}

export interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbList {
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItem[];
}

export interface Service {
  "@type": "Service";
  name: string;
  description: string;
  url?: string;
  serviceType?: string;
  areaServed?: string[];
  inLanguage?: string;
  provider: Organization | EntityRef;
}

/** schema.org CreativeWork used for `BlogPosting.citation`. */
export interface CreativeWork {
  "@type": "CreativeWork";
  name: string;
  url: string;
  publisher: { "@type": "Organization"; name: string };
}

export interface BlogPosting {
  "@type": "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  inLanguage: string;
  url: string;
  image?: string;
  mainEntityOfPage: string;
  author: Person | Organization | EntityRef;
  publisher: Organization | EntityRef;
  /** External sources the post cites (statistics, reports). */
  citation?: CreativeWork[];
}

export type JsonLdSchema =
  | Organization
  | Person
  | WebSite
  | WebPage
  | BreadcrumbList
  | Service
  | BlogPosting;
