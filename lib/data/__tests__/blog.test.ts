import { describe, it, expect } from "vitest";
import {
  blogPosts,
  getPostBySlug,
  otherPosts,
  postsForService,
  type BlogLocale,
} from "@/lib/data/blog";
import { serviceSlugs } from "@/lib/data/services";

describe("blog internal linking", () => {
  it("every post's secondary services are valid and exclude the primary", () => {
    for (const post of blogPosts) {
      expect(post.alsoRelated.length).toBeGreaterThan(0);
      for (const s of post.alsoRelated) {
        expect(serviceSlugs).toContain(s);
        expect(s).not.toBe(post.relatedService);
      }
    }
  });

  it("postsForService lists primary-hub posts before secondary ones", () => {
    for (const slug of serviceSlugs) {
      const posts = postsForService(slug);
      const firstSecondary = posts.findIndex((p) => p.relatedService !== slug);
      if (firstSecondary === -1) continue;
      expect(posts.slice(firstSecondary).every((p) => p.relatedService !== slug)).toBe(true);
    }
  });

  it("otherPosts never includes the current post", () => {
    for (const post of blogPosts) {
      const others = otherPosts(post.slug);
      expect(others.map((p) => p.slug)).not.toContain(post.slug);
      expect(others.length).toBe(Math.min(2, blogPosts.length - 1));
    }
  });
});

const LOCALES: BlogLocale[] = ["en", "es"];

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

describe("blog citations", () => {
  const entries = blogPosts.flatMap((post) =>
    LOCALES.map((locale) => ({ post, locale, content: post.content[locale] })),
  );

  it.each(entries)(
    "$post.slug [$locale] has 2-3 well-formed sources",
    ({ content }) => {
      expect(content.sources.length).toBeGreaterThanOrEqual(2);
      expect(content.sources.length).toBeLessThanOrEqual(3);
      for (const s of content.sources) {
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.publisher.length).toBeGreaterThan(0);
        expect(Number.isInteger(s.year)).toBe(true);
        expect(s.year).toBeGreaterThanOrEqual(2024);
        expect(s.url).toMatch(/^https:\/\/[^\s]+$/);
        expect(() => new URL(s.url)).not.toThrow();
      }
      const urls = content.sources.map((s) => s.url);
      expect(new Set(urls).size).toBe(urls.length);
    },
  );

  it.each(entries)(
    "$post.slug [$locale] attributes statistics inside the text",
    ({ content }) => {
      const text = content.text;
      // At least two numeric figures (percentages, counts, dollar amounts)
      const figures = text.match(/\b\d{2,}[\d.,]*/g) ?? [];
      expect(figures.length).toBeGreaterThanOrEqual(2);
    },
  );

  it("existing posts were refreshed on 2026-11-16", () => {
    for (const slug of [
      "ai-governance-data-policy",
      "ai-agents-account-access-risks",
      "generative-ai-small-business-roi",
    ]) {
      expect(getPostBySlug(slug)?.updatedAt).toBe("2026-11-16");
    }
  });
});

describe("blog SEO fields", () => {
  it.each(
    blogPosts.flatMap((post) =>
      LOCALES.map((locale) => ({ slug: post.slug, locale, content: post.content[locale] })),
    ),
  )("$slug [$locale] respects title/description limits", ({ content }) => {
    const seoTitle = content.seoTitle ?? `${content.title} | ShineTechData`;
    expect(seoTitle.length).toBeLessThanOrEqual(60);
    const seoDescription = content.seoDescription ?? content.description;
    expect(seoDescription.length).toBeLessThanOrEqual(160);
    expect(seoDescription.length).toBeGreaterThan(50);
  });
});

describe("business-intelligence-small-business post", () => {
  const post = getPostBySlug("business-intelligence-small-business");

  it("exists with the expected metadata", () => {
    expect(post).toBeDefined();
    expect(post!.publishedAt).toBe("2026-11-16");
    expect(post!.relatedService).toBe("business-intelligence");
    expect(post!.alsoRelated).toEqual(["data-analysis", "process-automation"]);
  });

  it.each(LOCALES)("[%s] is 1200-1600 words", (locale) => {
    const words = wordCount(post!.content[locale].text);
    expect(words).toBeGreaterThanOrEqual(1200);
    expect(words).toBeLessThanOrEqual(1600);
  });

  it("targets the locale keyword in the title and SEO title", () => {
    expect(post!.content.es.title.toLowerCase()).toContain("inteligencia de negocios para pymes");
    expect(post!.content.es.seoTitle!.toLowerCase()).toContain("inteligencia de negocios para pymes");
    expect(post!.content.en.title.toLowerCase()).toContain("business intelligence for small business");
    expect(post!.content.en.seoTitle!.toLowerCase()).toContain("business intelligence for small business");
  });
});
