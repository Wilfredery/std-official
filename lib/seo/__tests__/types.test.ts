import { describe, it, expect } from "vitest";
import type {
  Organization,
  WebSite,
  BreadcrumbList,
  Service,
  JsonLdSchema,
} from "@/lib/seo/types";

describe("SEO JSON-LD types", () => {
  describe("Organization", () => {
    it("accepts valid Organization with all fields", () => {
      const org: Organization = {
        "@type": "Organization",
        name: "ShineTechData",
        url: "https://shinetechdata.com",
        logo: "https://shinetechdata.com/logo.png",
      };
      expect(org["@type"]).toBe("Organization");
      expect(org.name).toBe("ShineTechData");
      expect(org.url).toBe("https://shinetechdata.com");
      expect(org.logo).toBe("https://shinetechdata.com/logo.png");
    });

    it("accepts Organization without optional logo", () => {
      const org: Organization = {
        "@type": "Organization",
        name: "ShineTechData",
        url: "https://shinetechdata.com",
      };
      expect(org["@type"]).toBe("Organization");
      expect(org.logo).toBeUndefined();
    });
  });

  describe("WebSite", () => {
    it("accepts valid WebSite with SearchAction", () => {
      const site: WebSite = {
        "@type": "WebSite",
        name: "ShineTechData",
        url: "https://shinetechdata.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://shinetechdata.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      expect(site["@type"]).toBe("WebSite");
      expect(site.potentialAction?.["@type"]).toBe("SearchAction");
      expect(site.potentialAction?.target).toContain("search_term_string");
    });

    it("accepts WebSite without optional potentialAction", () => {
      const site: WebSite = {
        "@type": "WebSite",
        name: "ShineTechData",
        url: "https://shinetechdata.com",
      };
      expect(site["@type"]).toBe("WebSite");
      expect(site.potentialAction).toBeUndefined();
    });
  });

  describe("BreadcrumbList", () => {
    it("accepts valid BreadcrumbList with multiple items", () => {
      const bc: BreadcrumbList = {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Services",
            item: "https://shinetechdata.com/services/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Data Analysis",
            item: "https://shinetechdata.com/services/data-analysis/",
          },
        ],
      };
      expect(bc["@type"]).toBe("BreadcrumbList");
      expect(bc.itemListElement).toHaveLength(2);
      expect(bc.itemListElement[0].position).toBe(1);
      expect(bc.itemListElement[0].name).toBe("Services");
      expect(bc.itemListElement[1].position).toBe(2);
    });
  });

  describe("Service", () => {
    it("accepts valid Service with Organization provider", () => {
      const svc: Service = {
        "@type": "Service",
        name: "Data Analysis",
        description: "Professional data analysis services for businesses",
        provider: {
          "@type": "Organization",
          name: "ShineTechData",
          url: "https://shinetechdata.com",
        },
      };
      expect(svc["@type"]).toBe("Service");
      expect(svc.name).toBe("Data Analysis");
      expect(svc.description).toContain("data analysis");
      expect(svc.provider["@type"]).toBe("Organization");
      expect(svc.provider.name).toBe("ShineTechData");
    });
  });

  describe("JsonLdSchema union", () => {
    it("accepts Organization as JsonLdSchema", () => {
      const schema: JsonLdSchema = {
        "@type": "Organization",
        name: "Test",
        url: "https://example.com",
      };
      expect(schema["@type"]).toBe("Organization");
    });

    it("accepts WebSite as JsonLdSchema", () => {
      const schema: JsonLdSchema = {
        "@type": "WebSite",
        name: "Test",
        url: "https://example.com",
      };
      expect(schema["@type"]).toBe("WebSite");
    });

    it("accepts BreadcrumbList as JsonLdSchema", () => {
      const schema: JsonLdSchema = {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://example.com/",
          },
        ],
      };
      expect(schema["@type"]).toBe("BreadcrumbList");
    });

    it("accepts Service as JsonLdSchema", () => {
      const schema: JsonLdSchema = {
        "@type": "Service",
        name: "Test",
        description: "A test service",
        provider: {
          "@type": "Organization",
          name: "TestCo",
          url: "https://example.com",
        },
      };
      expect(schema["@type"]).toBe("Service");
    });
  });
});
