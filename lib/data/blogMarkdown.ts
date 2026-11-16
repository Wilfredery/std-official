import matter from "gray-matter";
import { Marked } from "marked";
import { serviceSlugs, type ServiceSlug } from "@/lib/data/services";
import type { BlogPostContent, BlogSource } from "@/lib/data/blog";

/**
 * Pure parsers for the Markdown blog in content/blog/ (no filesystem access,
 * so they can be unit-tested). Every check throws with the file name so a bad
 * post fails the build instead of shipping a broken page.
 */

export interface BlogPostMeta {
  publishedAt: string;
  updatedAt?: string;
  relatedService: ServiceSlug;
  alsoRelated: ServiceSlug[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const marked = new Marked({ gfm: true });

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

/** Parses `content/blog/<slug>/meta.json`. */
export function parseBlogMeta(raw: string, file: string): BlogPostMeta {
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
  return {
    publishedAt: requireDate(data, "publishedAt", file),
    updatedAt: data.updatedAt === undefined ? undefined : requireDate(data, "updatedAt", file),
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
  // The page renders the title as <h1>; sections in the body start at ##.
  if (/^#\s/m.test(body)) throw new BlogContentError(file, `use "##" for section headings, not "#"`);

  const html = marked.parse(body, { async: false });

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
