import { describe, it, expect } from "vitest";
import { ANALYSIS_REQUEST_MARKER } from "@/lib/analysisRequest";
import {
  parseBlogAuthors,
  parseBlogMeta,
  parseBlogPostContent,
  parseBlogSources,
  svgSize,
} from "@/lib/data/blogMarkdown";

const sources = parseBlogSources(
  JSON.stringify({
    cepal: { title: "Pymes", publisher: "CEPAL", year: 2026, url: "https://www.cepal.org/x" },
  }),
  "sources.json",
);

const noImages = (src: string) => {
  throw new Error(`unexpected image ${src}`);
};
const fixedSize = () => ({ width: 800, height: 400 });

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
      noImages,
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
    expect(() => parseBlogPostContent(raw, "es.md", sources, noImages)).toThrow(/es\.md: unknown source "missing"/);
  });

  it("rejects a level-1 heading in the body", () => {
    expect(() => parseBlogPostContent(post({ body: "# Título otra vez" }), "es.md", sources, noImages)).toThrow(
      /use "##"/,
    );
  });

  it("renders fenced code as an escaped, focusable block where # is a comment, not a heading", () => {
    const { html } = parseBlogPostContent(
      post({ body: "Código:\n\n```python\n# 1. Datos\nif a < b and c > d:\n    print(\"&\")\n```\n\nUsa `pip`." }),
      "es.md",
      sources,
      noImages,
    );
    expect(html).toContain(
      '<pre tabindex="0"><code class="language-python"># 1. Datos\nif a &lt; b and c &gt; d:\n    print(&quot;&amp;&quot;)</code></pre>',
    );
    expect(html).toContain("<code>pip</code>");
    expect(html).not.toContain("<h1>");
  });

  it("rejects a setext level-1 heading too", () => {
    expect(() => parseBlogPostContent(post({ body: "Título\n======" }), "es.md", sources, noImages)).toThrow(
      /use "##"/,
    );
  });

  it("rejects a missing CTA field and an empty body", () => {
    expect(() =>
      parseBlogPostContent(post().replace('  button: "Botón"\n', ""), "es.md", sources, noImages),
    ).toThrow(/"button" must be a non-empty string/);
    expect(() => parseBlogPostContent(post({ body: "   " }), "es.md", sources, noImages)).toThrow(/body is empty/);
  });

  it("renders a standalone image as a lazy figure with alt, size and caption", () => {
    const { html } = parseBlogPostContent(
      post({ body: 'Intro.\n\n![Flujo con "IA" & CRM](/images/blog/x/flujo.svg "Un flujo típico")\n\nFin.' }),
      "es.md",
      sources,
      fixedSize,
    );
    expect(html).toContain(
      '<figure><img src="/images/blog/x/flujo.svg" alt="Flujo con &quot;IA&quot; &amp; CRM" width="800" height="400" loading="lazy" decoding="async"><figcaption>Un flujo típico</figcaption></figure>',
    );
    expect(html).not.toMatch(/<p>\s*<figure>/);
  });

  it("rejects an image without alt text or with a non-local src", () => {
    expect(() =>
      parseBlogPostContent(post({ body: "![](/images/blog/x/a.svg)" }), "es.md", sources, fixedSize),
    ).toThrow(/es\.md: image "\/images\/blog\/x\/a\.svg" needs alt text/);
    expect(() =>
      parseBlogPostContent(post({ body: "![Logo](https://cdn.example.com/a.svg)" }), "es.md", sources, fixedSize),
    ).toThrow(/must be a local path under \/images\/blog\//);
  });

  it("leaves a placeholder for the free-analysis form on a ::analysis-request line", () => {
    const { html } = parseBlogPostContent(post({ body: "Intro.\n\n::analysis-request\n\nFin." }), "es.md", sources, fixedSize);
    expect(html).toBe(`<p>Intro.</p>\n${ANALYSIS_REQUEST_MARKER}\n<p>Fin.</p>\n`);
  });
});

describe("svgSize", () => {
  it("reads width/height attributes, falling back to the viewBox", () => {
    expect(svgSize('<svg xmlns="http://www.w3.org/2000/svg" width="960" height="420" viewBox="0 0 10 10">', "a.svg")).toEqual({ width: 960, height: 420 });
    expect(svgSize('<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">', "b.svg")).toEqual({ width: 640, height: 360 });
  });

  it("throws when the size cannot be read", () => {
    expect(() => svgSize("<svg>", "c.svg")).toThrow(/c\.svg: .*width and height/);
  });
});

const authorJson = {
  "ana-perez": {
    name: "Ana Pérez",
    jobTitle: { es: "Analista", en: "Analyst" },
    bio: { es: "Bio es", en: "Bio en" },
    sameAs: ["https://www.linkedin.com/in/ana"],
  },
};
const authors = parseBlogAuthors(JSON.stringify(authorJson), "authors.json");

describe("parseBlogMeta", () => {
  const valid = {
    publishedAt: "2026-11-16",
    author: "ana-perez",
    relatedService: "business-intelligence",
    alsoRelated: ["data-analysis"],
  };

  it("parses valid metadata and resolves the author", () => {
    expect(parseBlogMeta(JSON.stringify(valid), "meta.json", authors)).toEqual({
      ...valid,
      author: { id: "ana-perez", ...authorJson["ana-perez"] },
      updatedAt: undefined,
    });
  });

  it("rejects unknown services, malformed dates and unknown or missing authors", () => {
    expect(() =>
      parseBlogMeta(JSON.stringify({ ...valid, relatedService: "seo" }), "meta.json", authors),
    ).toThrow(/relatedService "seo" is not one of/);
    expect(() =>
      parseBlogMeta(JSON.stringify({ ...valid, publishedAt: "16/11/2026" }), "meta.json", authors),
    ).toThrow(/YYYY-MM-DD/);
    expect(() =>
      parseBlogMeta(JSON.stringify({ ...valid, author: "nobody" }), "meta.json", authors),
    ).toThrow(/unknown author "nobody"/);
    expect(() =>
      parseBlogMeta(JSON.stringify({ ...valid, author: undefined }), "meta.json", authors),
    ).toThrow(/"author"/);
  });
});

describe("parseBlogAuthors", () => {
  const base = authorJson["ana-perez"];

  it("defaults sameAs to an empty list", () => {
    const noProfiles = JSON.stringify({ "ana-perez": { ...base, sameAs: undefined } });
    expect(parseBlogAuthors(noProfiles, "authors.json")["ana-perez"].sameAs).toEqual([]);
  });

  it("rejects a missing locale, non-https profiles and bad ids", () => {
    expect(() =>
      parseBlogAuthors(JSON.stringify({ "ana-perez": { ...base, bio: { es: "x" } } }), "authors.json"),
    ).toThrow(/bio/);
    expect(() =>
      parseBlogAuthors(JSON.stringify({ "ana-perez": { ...base, sameAs: ["http://x.org"] } }), "authors.json"),
    ).toThrow(/https profile URLs/);
    expect(() => parseBlogAuthors(JSON.stringify({ "Ana Perez": base }), "authors.json")).toThrow(/kebab-case/);
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
