export interface SearchAction {
  "@type": "SearchAction";
  target: string;
  "query-input": string;
}

export interface Organization {
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
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

export type JsonLdSchema = Organization | WebSite | BreadcrumbList | Service;
