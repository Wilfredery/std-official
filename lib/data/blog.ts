import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ServiceSlug } from "@/lib/data/services";
import {
  parseBlogAuthors,
  parseBlogMeta,
  parseBlogPostContent,
  parseBlogSources,
  svgSize,
  type ImageSize,
} from "@/lib/data/blogMarkdown";

/**
 * Blog posts live as Markdown in content/blog/:
 *
 *   content/blog/sources.json        verified references, keyed by id
 *   content/blog/authors.json        post authors (real people), keyed by id
 *   content/blog/<slug>/meta.json    dates, author and related services
 *   content/blog/<slug>/es.md        frontmatter (title, seo, sources, cta) + body
 *   content/blog/<slug>/en.md
 *
 * Files are read once at build time; every route that uses them is static.
 */

export type BlogLocale = "en" | "es";

/** An external reference backing a statistic cited in the post text. */
export interface BlogSource {
  title: string;
  publisher: string;
  /** Publication year; for undated web pages, the year the page was consulted. */
  year: number;
  /** Absolute https URL of the page that was opened and checked. */
  url: string;
}

/** A real person who writes posts (schema.org Person, for E-E-A-T). */
export interface BlogAuthor {
  /** Key in content/blog/authors.json; also the Person `@id` fragment. */
  id: string;
  name: string;
  jobTitle: Record<BlogLocale, string>;
  bio: Record<BlogLocale, string>;
  /** Public profiles (LinkedIn, GitHub…) that confirm who the author is. */
  sameAs: string[];
}

export interface BlogPostContent {
  title: string;
  description: string;
  /** Full <title> (≤60 chars). Falls back to `${title} | ShineTechData`. */
  seoTitle?: string;
  /** Meta description (≤160 chars). Falls back to `description`. */
  seoDescription?: string;
  /** Body rendered from the repo's own Markdown (trusted content). */
  html: string;
  /** Visible body text, for reading time and content checks. */
  text: string;
  /** Verified references for the statistics cited in the body (2-3 per post). */
  sources: BlogSource[];
  cta: { title: string; text: string; button: string };
}

export interface BlogPost {
  /** Same slug in every locale so hreflang alternates line up. */
  slug: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** ISO date (YYYY-MM-DD) of the last meaningful edit. Falls back to `publishedAt`. */
  updatedAt?: string;
  author: BlogAuthor;
  /** Primary service hub this post supports (CTA target). */
  relatedService: ServiceSlug;
  /** Secondary services the post also links to. */
  alsoRelated: ServiceSlug[];
  content: Record<BlogLocale, BlogPostContent>;
}


/** UI strings for the blog pages (kept with the content they frame). */
export const blogUi: Record<
  BlogLocale,
  {
    title: string;
    titleAccent: string;
    eyebrow: string;
    subtitle: string;
    seoTitle: string;
    seoDescription: string;
    readMore: string;
    minRead: string;
    backToBlog: string;
    relatedService: string;
    alsoRelated: string;
    moreArticles: string;
    relatedArticles: string;
    home: string;
    sources: string;
    opensInNewTab: string;
    by: string;
    aboutAuthor: string;
  }
> = {
  es: {
    eyebrow: "Blog",
    title: "Datos e IA,",
    titleAccent: "sin humo",
    subtitle:
      "Guías prácticas para usar datos e inteligencia artificial en tu empresa con criterio.",
    seoTitle: "Blog de datos e inteligencia artificial | ShineTechData",
    seoDescription:
      "Guías prácticas sobre inteligencia artificial, gobernanza de datos, analítica y automatización para empresas en República Dominicana y Latinoamérica.",
    readMore: "Leer artículo",
    minRead: "min de lectura",
    backToBlog: "Volver al blog",
    relatedService: "Servicio relacionado",
    alsoRelated: "También te puede servir",
    moreArticles: "Más artículos",
    relatedArticles: "Artículos relacionados",
    home: "Inicio",
    sources: "Fuentes",
    opensInNewTab: "se abre en una pestaña nueva",
    by: "Por",
    aboutAuthor: "Sobre el autor",
  },
  en: {
    eyebrow: "Blog",
    title: "Data and AI,",
    titleAccent: "minus the hype",
    subtitle:
      "Practical guides for using data and artificial intelligence in your business with good judgment.",
    seoTitle: "Data & AI Blog | ShineTechData",
    seoDescription:
      "Practical guides on AI, data governance, analytics and automation for small and mid-sized businesses.",
    readMore: "Read article",
    minRead: "min read",
    backToBlog: "Back to blog",
    relatedService: "Related service",
    alsoRelated: "You may also need",
    moreArticles: "More articles",
    relatedArticles: "Related articles",
    home: "Home",
    sources: "Sources",
    opensInNewTab: "opens in a new tab",
    by: "By",
    aboutAuthor: "About the author",
  },
};


const CONTENT_DIR = join(process.cwd(), "content", "blog");
const PUBLIC_DIR = join(process.cwd(), "public");
const LOCALES: BlogLocale[] = ["es", "en"];

/** Intrinsic size of a body image in public/, so the build fails on a missing file. SVG only for now. */
function bodyImageSize(file: string) {
  return (src: string): ImageSize => {
    const path = join(PUBLIC_DIR, src);
    if (!existsSync(path)) throw new Error(`[blog] ${file}: image "${src}" not found in public/`);
    if (!src.endsWith(".svg")) throw new Error(`[blog] ${file}: image "${src}" must be an .svg`);
    return svgSize(readFileSync(path, "utf8"), `public${src}`);
  };
}

function loadPosts(): BlogPost[] {
  const read = (...parts: string[]) => readFileSync(join(CONTENT_DIR, ...parts), "utf8");
  const sources = parseBlogSources(read("sources.json"), "content/blog/sources.json");
  const authors = parseBlogAuthors(read("authors.json"), "content/blog/authors.json");

  const slugs = readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return (
    slugs
      .map((slug): BlogPost => {
        const dir = `content/blog/${slug}`;
        const meta = parseBlogMeta(read(slug, "meta.json"), `${dir}/meta.json`, authors);
        const content = Object.fromEntries(
          LOCALES.map((locale) => [
            locale,
            parseBlogPostContent(
              read(slug, `${locale}.md`),
              `${dir}/${locale}.md`,
              sources,
              bodyImageSize(`${dir}/${locale}.md`),
            ),
          ]),
        ) as Record<BlogLocale, BlogPostContent>;
        return { slug, ...meta, content };
      })
      // Oldest first, slug as the same-day tiebreak: a stable, filesystem-independent order.
      .sort((a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug))
  );
}

export const blogPosts: BlogPost[] = loadPosts();

export const blogSlugs = blogPosts.map((p) => p.slug);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** ~200 words per minute, rounded up, minimum 1. */
export function readingMinutes(content: BlogPostContent): number {
  const words = content.text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function toBlogLocale(locale: string): BlogLocale {
  return locale === "es" ? "es" : "en";
}

/** Posts that link to a service, primary hub first. */
export function postsForService(slug: ServiceSlug): BlogPost[] {
  return [
    ...blogPosts.filter((p) => p.relatedService === slug),
    ...blogPosts.filter((p) => p.alsoRelated.includes(slug)),
  ];
}

/**
 * Posts newest first, optionally capped. Reversed before the (stable) sort so a
 * post added later wins a same-day tie.
 */
export function latestPosts(limit?: number): BlogPost[] {
  const sorted = [...blogPosts]
    .reverse()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return limit === undefined ? sorted : sorted.slice(0, limit);
}

/**
 * Other posts to cross-link from a post, closest topic first: posts for the same
 * primary service, then by how many services they share. Ties go to the older
 * post, which in each cluster is the guide the others build on. Ranking by date
 * alone sent every post's links to the two newest posts.
 */
export function otherPosts(slug: string, limit = 2): BlogPost[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  const services = (p: BlogPost) => new Set([p.relatedService, ...p.alsoRelated]);
  const mine = services(post);
  const score = (p: BlogPost) =>
    (p.relatedService === post.relatedService ? 10 : 0) +
    [...services(p)].filter((s) => mine.has(s)).length;

  return blogPosts
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, score: score(p) }))
    .sort((a, b) => b.score - a.score || a.p.publishedAt.localeCompare(b.p.publishedAt))
    .slice(0, limit)
    .map(({ p }) => p);
}
