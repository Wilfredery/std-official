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
  englishPathFor,
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
  it("defines both Spanish landings with their route folders", () => {
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
      const other = landings.find((o) => o.slug !== l.slug)!;
      for (const required of [
        "/services/data-analysis/",
        "/services/business-intelligence/",
        "/services/data-auditing/",
        "/blog/",
        landingPath(other.slug),
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
    ]) {
      expect(text, `copy contains "${banned}"`).not.toContain(banned);
    }
  });
});

describe("englishPathFor", () => {
  it("maps each landing to its English service page", () => {
    expect(englishPathFor("/consultoria-de-datos-republica-dominicana/")).toBe(
      "/services/data-analysis/",
    );
    expect(englishPathFor("/consultor-power-bi-republica-dominicana/")).toBe(
      "/services/business-intelligence/",
    );
  });

  it("tolerates a missing trailing slash", () => {
    expect(englishPathFor("/consultor-power-bi-republica-dominicana")).toBe(
      "/services/business-intelligence/",
    );
  });

  it("returns null for any other path", () => {
    for (const p of ["/", "/services/", "/blog/some-post/", "/consultoria-de-datos/"]) {
      expect(englishPathFor(p)).toBeNull();
    }
  });
});

describe("landingFooterLinks", () => {
  it("has one short link per landing", () => {
    expect(landingFooterLinks.map((l) => l.href)).toEqual(
      landings.map((l) => landingPath(l.slug)),
    );
    for (const l of landingFooterLinks) expect(l.label.length).toBeLessThan(40);
  });
});
