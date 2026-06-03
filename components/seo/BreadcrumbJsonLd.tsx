import { JsonLd } from "@/components/JsonLd";
import type { BreadcrumbList, BreadcrumbItem } from "@/lib/seo/types";

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const itemListElement: BreadcrumbItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  const data: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return <JsonLd data={data} />;
}
