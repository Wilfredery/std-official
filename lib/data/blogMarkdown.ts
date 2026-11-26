import matter from "gray-matter";
import { Marked } from "marked";
import { serviceSlugs, type ServiceSlug } from "@/lib/data/services";
import { ANALYSIS_REQUEST_MARKER } from "@/lib/analysisRequest";
import type { BlogAuthor, BlogLocale, BlogPostContent, BlogSource } from "@/lib/data/blog";

/**
 * Pure parsers for the Markdown blog in content/blog/ (no filesystem access,
 * so they can be unit-tested). Every check throws with the file name so a bad
 * post fails the build instead of shipping a broken page.
 */

export interface BlogPostMeta {
  publishedAt: string;
  updatedAt?: string;
  author: BlogAuthor;
  relatedService: ServiceSlug;
  alsoRelated: ServiceSlug[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

class BlogContentError extends Error {
  constructor(file: string, message: string) {
    super(`[blog] ${file}: ${message}`);
    this.name = "BlogContentError";
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function requireString(obj: Record<string, unknown>, key: string, file: string): string {
  const v = obj[key];
  if (typeof v !== "string" || v.trim() === "") {
    throw new BlogContentError(file, `"${key}" must be a non-empty string`);
  }
  return v;
}

function optionalString(obj: Record<string, unknown>, key: string, file: string): string | undefined {
  return obj[key] === undefined ? undefined : requireString(obj, key, file);
}

function requireService(v: unknown, field: string, file: string): ServiceSlug {
  if (!serviceSlugs.includes(v as ServiceSlug)) {
    throw new BlogContentError(file, `${field} "${String(v)}" is not one of: ${serviceSlugs.join(", ")}`);
  }
  return v as ServiceSlug;
}

function requireDate(obj: Record<string, unknown>, key: string, file: string): string {
  const v = requireString(obj, key, file);
  if (!ISO_DATE.test(v) || Number.isNaN(Date.parse(`${v}T00:00:00Z`))) {
    throw new BlogContentError(file, `"${key}" must be a YYYY-MM-DD date, got "${v}"`);
  }
  return v;
}

/** Parses `content/blog/<slug>/meta.json`, resolving `author` against authors.json. */
export function parseBlogMeta(
  raw: string,
  file: string,
  authors: Record<string, BlogAuthor>,
): BlogPostMeta {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new BlogContentError(file, `invalid JSON (${(e as Error).message})`);
  }
  if (!isRecord(data)) throw new BlogContentError(file, "must be a JSON object");

  if (!Array.isArray(data.alsoRelated)) {
    throw new BlogContentError(file, `"alsoRelated" must be an array of service slugs`);
  }
  const authorId = requireString(data, "author", file);
  const author = authors[authorId];
  if (!author) {
    throw new BlogContentError(file, `unknown author "${authorId}" (add it to content/blog/authors.json)`);
  }
  return {
    publishedAt: requireDate(data, "publishedAt", file),
    updatedAt: data.updatedAt === undefined ? undefined : requireDate(data, "updatedAt", file),
    author,
    relatedService: requireService(data.relatedService, "relatedService", file),
    alsoRelated: data.alsoRelated.map((s) => requireService(s, "alsoRelated", file)),
  };
}

/** Parses `content/blog/sources.json`: verified references, keyed by id. */
export function parseBlogSources(raw: string, file: string): Record<string, BlogSource> {
  const data: unknown = JSON.parse(raw);
  if (!isRecord(data)) throw new BlogContentError(file, "must be a JSON object");
  const sources: Record<string, BlogSource> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!isRecord(value)) throw new BlogContentError(file, `source "${key}" must be an object`);
    const where = `${file} (${key})`;
    const url = requireString(value, "url", where);
    if (!/^https:\/\/\S+$/.test(url)) throw new BlogContentError(where, `"url" must be an https URL`);
    if (!Number.isInteger(value.year)) throw new BlogContentError(where, `"year" must be an integer`);
    sources[key] = {
      title: requireString(value, "title", where),
      publisher: requireString(value, "publisher", where),
      year: value.year as number,
      url,
    };
  }
  return sources;
}

const BLOG_LOCALES: BlogLocale[] = ["es", "en"];

function requireLocalized(
  obj: Record<string, unknown>,
  key: string,
  file: string,
): Record<BlogLocale, string> {
  const v = obj[key];
  if (!isRecord(v)) throw new BlogContentError(file, `"${key}" must have "es" and "en" strings`);
  return Object.fromEntries(
    BLOG_LOCALES.map((locale) => [locale, requireString(v, locale, `${file} ${key}`)]),
  ) as Record<BlogLocale, string>;
}

/** Parses `content/blog/authors.json`: real people who write the posts, keyed by id. */
export function parseBlogAuthors(raw: string, file: string): Record<string, BlogAuthor> {
  const data: unknown = JSON.parse(raw);
  if (!isRecord(data)) throw new BlogContentError(file, "must be a JSON object");
  const authors: Record<string, BlogAuthor> = {};
  for (const [id, value] of Object.entries(data)) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
      throw new BlogContentError(file, `author id "${id}" must be lowercase-kebab-case`);
    }
    if (!isRecord(value)) throw new BlogContentError(file, `author "${id}" must be an object`);
    const where = `${file} (${id})`;
    const sameAs = value.sameAs ?? [];
    if (!Array.isArray(sameAs) || !sameAs.every((u) => typeof u === "string" && /^https:\/\/\S+$/.test(u))) {
      throw new BlogContentError(where, `"sameAs" must be an array of https profile URLs`);
    }
    authors[id] = {
      id,
      name: requireString(value, "name", where),
      jobTitle: requireLocalized(value, "jobTitle", where),
      bio: requireLocalized(value, "bio", where),
      sameAs: sameAs as string[],
    };
  }
  return authors;
}

export interface ImageSize {
  width: number;
  height: number;
}

/** Looks up the intrinsic size of a body image by its `src`; throws if the file is missing. */
export type ImageSizeResolver = (src: string) => ImageSize;

/** Size of an SVG from its root width/height attributes, or its viewBox. */
export function svgSize(svg: string, file: string): ImageSize {
  const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const attr = (name: string) => root.match(new RegExp(`\\s${name}="([\\d.]+)(?:px)?"`))?.[1];
  const [w, h] = [attr("width"), attr("height")];
  if (w && h) return { width: Number(w), height: Number(h) };
  const box = root.match(/\sviewBox="[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/);
  if (box) return { width: Number(box[1]), height: Number(box[2]) };
  throw new BlogContentError(file, "the <svg> root needs width and height attributes or a viewBox");
}

const ATTR_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const escapeAttr = (s: string) => s.replace(/[&<>"]/g, (c) => ATTR_ESCAPES[c]);

/**
 * Marked instance for one file. Images must be local, carry alt text (the build
 * fails otherwise) and get their intrinsic size so lazy loading causes no layout shift.
 * An image alone in its paragraph becomes a <figure>; its Markdown title is the caption.
 * Fenced code becomes a keyboard-focusable <pre> so long lines can be scrolled.
 */
function markedFor(file: string, imageSize: ImageSizeResolver): Marked {
  const IMAGE_DIR = "/images/blog/";
  return new Marked({
    gfm: true,
    // `::analysis-request` on its own line: where BlogPostBody puts the free-analysis form.
    extensions: [
      {
        name: "analysisRequest",
        level: "block",
        start: (src) => src.match(/^::analysis-request/m)?.index,
        tokenizer(src) {
          const match = /^::analysis-request[ \t]*(?:\n+|$)/.exec(src);
          return match ? { type: "analysisRequest", raw: match[0] } : undefined;
        },
        renderer: () => `${ANALYSIS_REQUEST_MARKER}\n`,
      },
    ],
    // The page renders the title as <h1>; sections in the body start at ##.
    // Checked on tokens so a "# comment" inside a code block is not a heading.
    walkTokens(token) {
      if (token.type === "heading" && token.depth === 1) {
        throw new BlogContentError(file, `use "##" for section headings, not "#"`);
      }
    },
    renderer: {
      code({ text, lang }) {
        const language = lang?.match(/^[\w-]+/)?.[0];
        const cls = language ? ` class="language-${language}"` : "";
        return `<pre tabindex="0"><code${cls}>${escapeAttr(text)}</code></pre>\n`;
      },
      image({ href, title, text }) {
        if (!href.startsWith(IMAGE_DIR) || href.includes("..")) {
          throw new BlogContentError(file, `image "${href}" must be a local path under ${IMAGE_DIR}`);
        }
        if (text.trim() === "") throw new BlogContentError(file, `image "${href}" needs alt text`);
        const { width, height } = imageSize(href);
        const img = `<img src="${escapeAttr(href)}" alt="${escapeAttr(text.trim())}" width="${width}" height="${height}" loading="lazy" decoding="async">`;
        return `<figure>${img}${title ? `<figcaption>${escapeAttr(title)}</figcaption>` : ""}</figure>`;
      },
      paragraph({ tokens }) {
        const inline = this.parser.parseInline(tokens);
        return tokens.length === 1 && tokens[0].type === "image" ? `${inline}\n` : `<p>${inline}</p>\n`;
      },
    },
  });
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" };

/** Visible text of rendered HTML, for word counts and reading time. */
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39);/g, (_, name: string) => ENTITIES[name])
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses one locale file, `content/blog/<slug>/<locale>.md`. */
export function parseBlogPostContent(
  raw: string,
  file: string,
  sources: Record<string, BlogSource>,
  imageSize: ImageSizeResolver,
): BlogPostContent {
  const { data, content } = matter(raw);

  const sourceKeys: unknown = data.sources;
  if (!Array.isArray(sourceKeys) || sourceKeys.length === 0) {
    throw new BlogContentError(file, `"sources" must list ids from content/blog/sources.json`);
  }
  const resolvedSources = sourceKeys.map((key) => {
    const source = sources[String(key)];
    if (!source) throw new BlogContentError(file, `unknown source "${String(key)}" (add it to content/blog/sources.json)`);
    return source;
  });

  if (!isRecord(data.cta)) throw new BlogContentError(file, `"cta" must have title, text and button`);
  const cta = {
    title: requireString(data.cta, "title", `${file} cta`),
    text: requireString(data.cta, "text", `${file} cta`),
    button: requireString(data.cta, "button", `${file} cta`),
  };

  const body = content.trim();
  if (body === "") throw new BlogContentError(file, "body is empty");

  const html = markedFor(file, imageSize).parse(body, { async: false });

  return {
    title: requireString(data, "title", file),
    description: requireString(data, "description", file),
    seoTitle: optionalString(data, "seoTitle", file),
    seoDescription: optionalString(data, "seoDescription", file),
    html,
    text: htmlToText(html),
    sources: resolvedSources,
    cta,
  };
}
