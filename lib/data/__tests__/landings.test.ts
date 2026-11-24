import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  landings,
  landingSlugs,
  landingPath,
  landingFooterLinks,
  landingInternalHrefs,
  landingTexts,
  landingWordCount,
  alternatePathFor,
  getLandingBySlug,
} from "@/lib/data/landings";
import { serviceSlugs } from "@/lib/data/services";
import { blogSlugs } from "@/lib/data/blog";

const staticRoutes = ["/", "/services/", "/blog/", "/about/", "/contact/"];

function isRealRoute(href: string): boolean {
  if (staticRoutes.includes(href)) return true;
  const service = href.match(/^\/services\/([^/]+)\/$/);
  if (service) return (serviceSlugs as readonly string[]).includes(service[1]);
  const post = href.match(/^\/blog\/([^/]+)\/$/);
  if (post) return (blogSlugs as readonly string[]).includes(post[1]);
  const landing = href.match(/^\/([^/]+)\/$/);
  return !!landing && (landingSlugs as readonly string[]).includes(landing[1]);
}

describe("landings data", () => {
  it("defines every landing with its route folder", () => {
    expect(landings.map((l) => l.slug)).toEqual([...landingSlugs]);
    for (const l of landings) {
      const page = path.join(process.cwd(), "app", "[locale]", l.slug, "page.tsx");
      expect(existsSync(page)).toBe(true);
    }
  });

  it.each(landings.map((l) => [l.slug, l] as const))("%s: word count is at least 1000", (_s, l) => {
    expect(landingWordCount(l)).toBeGreaterThanOrEqual(1000);
  });

  it.each(landings.map((l) => [l.slug, l] as const))("%s: SEO title/description limits", (_s, l) => {
    expect(l.seoTitle.length).toBeLessThanOrEqual(60);
    expect(l.seoDescription.length).toBeLessThanOrEqual(160);
    expect(l.seoDescription.length).toBeGreaterThan(80);
  });

  it.each(landings.map((l) => [l.slug, l] as const))("%s: has at least 6 FAQs", (_s, l) => {
    expect(l.faq.length).toBeGreaterThanOrEqual(6);
    for (const f of l.faq) {
      expect(f.question.trim().endsWith("?")).toBe(true);
      expect(f.answer.length).toBeGreaterThan(40);
    }
  });

  it("targets the primary keywords in the H1", () => {
    expect(getLandingBySlug("consultoria-de-datos-republica-dominicana")!.h1).toMatch(
      /consultoría de datos en república dominicana/i,
    );
    expect(getLandingBySlug("consultor-power-bi-republica-dominicana")!.h1).toMatch(
      /consultor power bi en república dominicana/i,
    );
    expect(getLandingBySlug("business-intelligence-for-local-government")!.h1).toMatch(
      /business intelligence for local government/i,
    );
  });

  it.each(landings.map((l) => [l.slug, l] as const))(
    "%s: every internal link points to a real route",
    (_s, l) => {
      const hrefs = landingInternalHrefs(l);
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(isRealRoute(href), `${href} is not a real route`).toBe(true);
      }
    },
  );

  it.each(landings.map((l) => [l.slug, l] as const))(
    "%s: links the required related pages",
    (_s, l) => {
      const hrefs = new Set(landingInternalHrefs(l));
      // Sibling landings in the same locale cross-link; other locales can't.
      const siblings = landings.filter((o) => o.slug !== l.slug && o.locale === l.locale);
      for (const required of [
        "/services/data-analysis/",
        "/services/business-intelligence/",
        "/services/data-auditing/",
        "/blog/",
        ...siblings.map((o) => landingPath(o.slug)),
      ]) {
        expect(hrefs.has(required), `${l.slug} should link ${required}`).toBe(true);
      }
    },
  );

  it("never makes unverifiable claims", () => {
    const text = landings.flatMap(landingTexts).join(" ").toLowerCase();
    for (const banned of [
      "partner",
      "certificad",
      "garantiz",
      "garantía",
      "años de experiencia",
      "clientes satisfechos",
      "testimonio",
      "certified",
      "guarantee",
      "years of experience",
      "satisfied clients",
      "testimonial",
    ]) {
      expect(text, `copy contains "${banned}"`).not.toContain(banned);
    }
  });
});

describe("alternatePathFor", () => {
  it("maps each Spanish landing to its English service page", () => {
    expect(alternatePathFor("/consultoria-de-datos-republica-dominicana/", "en")).toBe(
      "/services/data-analysis/",
    );
    expect(alternatePathFor("/consultor-power-bi-republica-dominicana/", "en")).toBe(
      "/services/business-intelligence/",
    );
  });

  it("maps the English landing to its Spanish service page", () => {
    expect(alternatePathFor("/business-intelligence-for-local-government/", "es")).toBe(
      "/services/business-intelligence/",
    );
  });

  it("keeps the path when switching to the landing's own locale", () => {
    expect(alternatePathFor("/consultor-power-bi-republica-dominicana/", "es")).toBeNull();
    expect(alternatePathFor("/business-intelligence-for-local-government/", "en")).toBeNull();
  });

  it("tolerates a missing trailing slash", () => {
    expect(alternatePathFor("/consultor-power-bi-republica-dominicana", "en")).toBe(
      "/services/business-intelligence/",
    );
  });

  it("returns null for any other path", () => {
    for (const p of ["/", "/services/", "/blog/some-post/", "/consultoria-de-datos/"]) {
      expect(alternatePathFor(p, "en")).toBeNull();
      expect(alternatePathFor(p, "es")).toBeNull();
    }
  });
});

describe("landingFooterLinks", () => {
  it.each(["es", "en"])("has one short link per %s landing", (locale) => {
    const links = landingFooterLinks(locale);
    expect(links.map((l) => l.href)).toEqual(
      landings.filter((l) => l.locale === locale).map((l) => landingPath(l.slug)),
    );
    expect(links.length).toBeGreaterThan(0);
    for (const l of links) expect(l.label.length).toBeLessThan(40);
  });
});
