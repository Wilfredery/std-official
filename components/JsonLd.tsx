import type { JsonLdSchema } from "@/lib/seo/types";

/**
 * Renders a <script type="application/ld+json"> tag for Google structured data.
 *
 * Uses dangerouslySetInnerHTML to prevent React from HTML-encoding the JSON
 * content (which would produce invalid JSON-LD).
 */
export function JsonLd<T extends JsonLdSchema>({ data }: { data: T }) {
  return (
    <script
      data-testid="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
