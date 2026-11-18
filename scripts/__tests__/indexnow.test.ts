import { describe, expect, it } from "vitest";
import { urlsForChangedFiles } from "../indexnow.mjs";

const BASE = "https://www.shinetechdata.com";

describe("urlsForChangedFiles", () => {
  it("maps a post's language file to that language only, plus the index", () => {
    expect(urlsForChangedFiles(["content/blog/my-post/en.md"])).toEqual([
      `${BASE}/en/blog/`,
      `${BASE}/en/blog/my-post/`,
      `${BASE}/es/blog/`,
    ]);
  });

  it("maps meta.json and body images to both languages", () => {
    const urls = urlsForChangedFiles([
      "content/blog/my-post/meta.json",
      "public/images/blog/other-post/chart.svg",
    ]);
    expect(urls).toEqual([
      `${BASE}/en/blog/`,
      `${BASE}/en/blog/my-post/`,
      `${BASE}/en/blog/other-post/`,
      `${BASE}/es/blog/`,
      `${BASE}/es/blog/my-post/`,
      `${BASE}/es/blog/other-post/`,
    ]);
  });

  it("deduplicates a post whose files all changed", () => {
    const urls = urlsForChangedFiles([
      "content/blog/my-post/es.md",
      "content/blog/my-post/en.md",
      "content/blog/my-post/meta.json",
    ]);
    expect(urls).toHaveLength(4);
  });

  it("ignores shared blog files and everything outside the blog", () => {
    expect(
      urlsForChangedFiles([
        "content/blog/sources.json",
        "content/blog/authors.json",
        "content/blog/README.md",
        "lib/data/blog.ts",
        ".github/workflows/deploy.yml",
      ]),
    ).toEqual([]);
  });
});
