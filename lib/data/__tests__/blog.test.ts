import { describe, it, expect } from "vitest";
import { blogPosts, otherPosts, postsForService } from "@/lib/data/blog";
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
