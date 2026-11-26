import type { ServiceSlug } from "@/lib/data/services";

/** What the blog index needs to render and filter one card (serializable). */
export interface BlogCardData {
  slug: string;
  title: string;
  description: string;
  /** ISO date, for <time dateTime>. */
  publishedAt: string;
  /** Date already formatted for the page locale. */
  dateLabel: string;
  minutes: number;
  topic: ServiceSlug;
  topicLabel: string;
}

export interface BlogTopic {
  slug: ServiceSlug;
  label: string;
  count: number;
}

/** Lowercase and strip accents, so "analisis" matches "Análisis". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Cards matching every word of `query` (in title, description or topic) and,
 * when given, the `topic`. Order is preserved.
 */
export function filterPosts(
  posts: BlogCardData[],
  query: string,
  topic: ServiceSlug | null,
): BlogCardData[] {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    if (topic && post.topic !== topic) return false;
    if (words.length === 0) return true;
    const haystack = normalizeText(`${post.title} ${post.description} ${post.topicLabel}`);
    return words.every((w) => haystack.includes(w));
  });
}
