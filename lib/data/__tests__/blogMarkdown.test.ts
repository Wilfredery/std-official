import { describe, it, expect } from "vitest";
import {
  parseBlogMeta,
  parseBlogPostContent,
  parseBlogSources,
} from "@/lib/data/blogMarkdown";

const sources = parseBlogSources(
  JSON.stringify({
    cepal: { title: "Pymes", publisher: "CEPAL", year: 2026, url: "https://www.cepal.org/x" },
  }),
  "sources.json",
);

function post({ front = "", body = "Intro with a [link](/es/blog/) and **bold**." } = {}) {
  return [
    "---",
    'title: "Título"',
    'description: "Descripción"',
    "sources:",
    "  - cepal",
    "cta:",
    '  title: "CTA"',
    '  text: "Texto"',
    '  button: "Botón"',
    front,
    "---",
    "",
    body,
  ].join("\n");
}

describe("parseBlogPostContent", () => {
  it("renders Markdown to HTML and resolves sources by id", () => {
    const content = parseBlogPostContent(
      post({ body: "Hola **mundo** y [CEPAL](https://www.cepal.org/x).\n\n## Sección\n\n- uno\n- dos\n\n1. a\n2. b" }),
      "es.md",
      sources,
    );
    expect(content.title).toBe("Título");
    expect(content.seoTitle).toBeUndefined();
    expect(content.sources).toEqual([sources.cepal]);
    expect(content.html).toContain("<strong>mundo</strong>");
    expect(content.html).toContain('<a href="https://www.cepal.org/x">CEPAL</a>');
    expect(content.html).toContain("<h2>Sección</h2>");
    expect(content.html).toMatch(/<ul>\s*<li>uno<\/li>/);
    expect(content.html).toMatch(/<ol>\s*<li>a<\/li>/);
    expect(content.text).toBe("Hola mundo y CEPAL . Sección uno dos a b");
  });

  it("rejects an unknown source id", () => {
    const raw = post().replace("  - cepal", "  - missing");
    expect(() => parseBlogPostContent(raw, "es.md", sources)).toThrow(/es\.md: unknown source "missing"/);
  });

  it("rejects a level-1 heading in the body", () => {
    expect(() => parseBlogPostContent(post({ body: "# Título otra vez" }), "es.md", sources)).toThrow(
      /use "##"/,
    );
  });

  it("rejects a missing CTA field and an empty body", () => {
    expect(() =>
      parseBlogPostContent(post().replace('  button: "Botón"\n', ""), "es.md", sources),
    ).toThrow(/"button" must be a non-empty string/);
    expect(() => parseBlogPostContent(post({ body: "   " }), "es.md", sources)).toThrow(/body is empty/);
  });
});

describe("parseBlogMeta", () => {
  const valid = {
    publishedAt: "2026-11-16",
    relatedService: "business-intelligence",
    alsoRelated: ["data-analysis"],
  };

  it("parses valid metadata", () => {
    expect(parseBlogMeta(JSON.stringify(valid), "meta.json")).toEqual({ ...valid, updatedAt: undefined });
  });

  it("rejects unknown services and malformed dates", () => {
    expect(() =>
      parseBlogMeta(JSON.stringify({ ...valid, relatedService: "seo" }), "meta.json"),
    ).toThrow(/relatedService "seo" is not one of/);
    expect(() =>
      parseBlogMeta(JSON.stringify({ ...valid, publishedAt: "16/11/2026" }), "meta.json"),
    ).toThrow(/YYYY-MM-DD/);
  });
});

describe("parseBlogSources", () => {
  it("rejects non-https URLs", () => {
    expect(() =>
      parseBlogSources(
        JSON.stringify({ x: { title: "t", publisher: "p", year: 2026, url: "http://x.org" } }),
        "sources.json",
      ),
    ).toThrow(/https URL/);
  });
});
