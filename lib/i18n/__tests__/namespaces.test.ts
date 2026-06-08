import { describe, it, expect } from "vitest";
import {
  ALL_NAMESPACES,
  SHARED_NAMESPACES,
  PAGE_NAMESPACES,
  filterMessages,
  getRequiredNamespaces,
} from "@/lib/i18n/namespaces";

// ---------------------------------------------------------------------------
// Unit tests: filterMessages
// ---------------------------------------------------------------------------
describe("filterMessages", () => {
  it("returns only the requested namespaces", () => {
    const full = {
      nav: { home: "Home" },
      common: { learnMore: "Learn More" },
      home: { hero: { title: "Hello" } },
      about: { header: { title: "About" } },
    };
    const result = filterMessages(full, ["nav", "home"]);
    expect(result).toEqual({
      nav: { home: "Home" },
      home: { hero: { title: "Hello" } },
    });
    expect(result).not.toHaveProperty("common");
    expect(result).not.toHaveProperty("about");
  });

  it("skips namespaces not present in messages", () => {
    const full = { nav: {}, common: {} };
    const result = filterMessages(full, ["nav", "nonexistent"]);
    expect(result).toEqual({ nav: {} });
  });

  it("returns empty object for empty namespace list", () => {
    const result = filterMessages({ nav: {} }, []);
    expect(result).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// Unit tests: getRequiredNamespaces
// ---------------------------------------------------------------------------
describe("getRequiredNamespaces", () => {
  it("always includes shared namespaces", () => {
    const result = getRequiredNamespaces("/");
    for (const ns of SHARED_NAMESPACES) {
      expect(result).toContain(ns);
    }
  });

  it("includes page-specific namespaces for /about", () => {
    const result = getRequiredNamespaces("/about");
    expect(result).toContain("about");
    expect(result).toContain("nav");
    expect(result).toContain("common");
    expect(result).toContain("footer");
    expect(result).toContain("serviceDetail");
  });

  it("returns only shared for /", () => {
    const result = getRequiredNamespaces("/");
    expect(result).toEqual([
      "nav",
      "common",
      "footer",
      "serviceDetail",
      "about",
      "legal",
      "notFound",
    ]);
  });

  it("returns legal for /privacy", () => {
    const result = getRequiredNamespaces("/privacy");
    expect(result).toContain("legal");
  });

  it("returns legal for /terms", () => {
    const result = getRequiredNamespaces("/terms");
    expect(result).toContain("legal");
  });

  it("returns notFound for /404", () => {
    const result = getRequiredNamespaces("/404");
    expect(result).toContain("notFound");
  });
});

// ---------------------------------------------------------------------------
// Guard test: Validate ALL_NAMESPACES covers all used namespaces
// ---------------------------------------------------------------------------
describe("Namespace Declaration Guard", () => {
  it("SHARED_NAMESPACES are all valid ALL_NAMESPACES values", () => {
    for (const ns of SHARED_NAMESPACES) {
      expect(ALL_NAMESPACES).toContain(ns);
    }
  });

  it("PAGE_NAMESPACES values are all valid ALL_NAMESPACES values", () => {
    for (const [, namespaces] of Object.entries(PAGE_NAMESPACES)) {
      for (const ns of namespaces) {
        expect(ALL_NAMESPACES).toContain(ns);
      }
    }
  });

  it("ALL_NAMESPACES contains all known translation namespaces", () => {
    // This list MUST match the top-level keys in messages/en.json
    const expected = [
      "nav",
      "common",
      "home",
      "services",
      "serviceDetail",
      "contact",
      "footer",
      "seo",
      "notFound",
      "about",
      "legal",
    ];
    expect(ALL_NAMESPACES.sort()).toEqual(expected.sort());
  });

  it("every page has a declared namespace mapping", () => {
    // All known pages MUST have an entry in PAGE_NAMESPACES
    const requiredPages = [
      "/",
      "/about",
      "/services",
      "/services/*",
      "/contact",
      "/privacy",
      "/terms",
      "/404",
    ];
    for (const page of requiredPages) {
      expect(PAGE_NAMESPACES).toHaveProperty(page);
    }
  });

  it("mapping pages align with user requirements", () => {
    // Homepage: nav, common, home, footer, seo → but seo is server-only
    // Client: nav, common, footer, serviceDetail (shared) + home? NO - home is server-only
    expect(PAGE_NAMESPACES["/"]).toEqual([]);

    // About: nav, common, about, footer, seo
    // Client needs: about (MissionVision uses useTranslations)
    expect(PAGE_NAMESPACES["/about"]).toEqual(["about"]);

    // Services: nav, common, services, footer, seo
    // Client needs: nothing extra (all server components)
    expect(PAGE_NAMESPACES["/services"]).toEqual([]);

    // Service detail: nav, common, services, serviceDetail, footer, seo
    // serviceDetail already in shared
    expect(PAGE_NAMESPACES["/services/*"]).toEqual([]);

    // Contact: nav, common, contact, footer, seo
    expect(PAGE_NAMESPACES["/contact"]).toEqual([]);

    // Privacy/terms: nav, common, legal, footer, seo
    expect(PAGE_NAMESPACES["/privacy"]).toEqual(["legal"]);
    expect(PAGE_NAMESPACES["/terms"]).toEqual(["legal"]);

    // 404: nav, common, notFound, footer, seo
    expect(PAGE_NAMESPACES["/404"]).toEqual(["notFound"]);
  });
});
