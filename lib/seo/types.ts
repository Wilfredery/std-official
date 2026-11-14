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
}

export interface Organization {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint[];
  sameAs?: string[];
}

export interface WebSite {
  "@type": "WebSite";
  name: string;
  url: string;
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
  provider: Organization;
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
  author: Organization;
  publisher: Organization;
}

export type JsonLdSchema =
  | Organization
  | WebSite
  | BreadcrumbList
  | Service
  | BlogPosting;
