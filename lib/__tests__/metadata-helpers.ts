import type { Metadata } from "next";

/**
 * Typed accessors for Next.js `Metadata` in tests.
 *
 * `Metadata["openGraph"]` and `Metadata["twitter"]` are discriminated unions
 * (`type` / `card` only exist on some members) and their `images` can be a
 * single value or an array. These helpers expose the concrete shape our pages
 * actually emit, with `images` always normalised to an array, so assertions
 * stay readable without `any` or non-null casts.
 */

export interface OpenGraphImage {
  url: string;
  width?: number | string;
  height?: number | string;
  alt?: string;
}

export interface TestOpenGraph {
  type?: string;
  title?: string;
  description?: string;
  siteName?: string;
  locale?: string;
  url?: string;
  images: OpenGraphImage[];
}

export interface TestTwitter {
  card?: string;
  title?: string;
  description?: string;
  /** Image URLs (descriptor objects are reduced to their `url`). */
  images: string[];
}

type ImageInput = string | URL | { url: string | URL };

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function imageUrl(image: ImageInput): string {
  if (typeof image === "string") return image;
  if (image instanceof URL) return image.toString();
  return String(image.url);
}

export function getOpenGraph(metadata: Metadata): TestOpenGraph {
  const og = (metadata.openGraph ?? {}) as unknown as Omit<
    TestOpenGraph,
    "images"
  > & { images?: ImageInput | ImageInput[] };
  return {
    ...og,
    images: toArray(og.images).map((image) =>
      typeof image === "string" || image instanceof URL
        ? { url: imageUrl(image) }
        : { ...image, url: imageUrl(image) },
    ),
  };
}

export function getTwitter(metadata: Metadata): TestTwitter {
  const tw = (metadata.twitter ?? {}) as unknown as Omit<
    TestTwitter,
    "images"
  > & { images?: ImageInput | ImageInput[] };
  return {
    ...tw,
    images: toArray(tw.images).map(imageUrl),
  };
}
