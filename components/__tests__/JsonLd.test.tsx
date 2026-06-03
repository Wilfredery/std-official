import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JsonLd } from "@/components/JsonLd";
import type { Organization, Service, BreadcrumbList } from "@/lib/seo/types";
import { SITE_URL } from "@/lib/site";

describe("JsonLd — Structured Data Component (SEO-5)", () => {
  describe("Organization schema", () => {
    it("renders a script tag with application/ld+json type", () => {
      const org: Organization = {
        "@type": "Organization",
        name: "ShineTechData",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
      };

      render(<JsonLd data={org} />);

      const script = screen.getByTestId("json-ld");
      expect(script.tagName).toBe("SCRIPT");
      expect(script.getAttribute("type")).toBe("application/ld+json");
    });

    it("renders valid JSON with the correct Organization data", () => {
      const org: Organization = {
        "@type": "Organization",
        name: "ShineTechData",
        url: SITE_URL,
      };

      render(<JsonLd data={org} />);

      const script = screen.getByTestId("json-ld");
      const parsed = JSON.parse(script.textContent ?? "");
      expect(parsed["@type"]).toBe("Organization");
      expect(parsed.name).toBe("ShineTechData");
      expect(parsed.url).toBe(SITE_URL);
    });
  });

  describe("Service schema", () => {
    it("renders a Service JSON-LD with the correct @type and fields", () => {
      const service: Service = {
        "@type": "Service",
        name: "Data Analysis",
        description: "Deep-dive diagnostics for operational efficiency.",
        provider: {
          "@type": "Organization",
          name: "ShineTechData",
          url: SITE_URL,
        },
      };

      render(<JsonLd data={service} />);

      const script = screen.getByTestId("json-ld");
      const parsed = JSON.parse(script.textContent ?? "");
      expect(parsed["@type"]).toBe("Service");
      expect(parsed.name).toBe("Data Analysis");
      expect(parsed.provider["@type"]).toBe("Organization");
      expect(parsed.provider.name).toBe("ShineTechData");
    });
  });

  describe("BreadcrumbList schema", () => {
    it("renders a BreadcrumbList with itemListElement array", () => {
      const breadcrumb: BreadcrumbList = {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/en`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${SITE_URL}/en/services/`,
          },
        ],
      };

      render(<JsonLd data={breadcrumb} />);

      const script = screen.getByTestId("json-ld");
      const parsed = JSON.parse(script.textContent ?? "");
      expect(parsed["@type"]).toBe("BreadcrumbList");
      expect(parsed.itemListElement).toHaveLength(2);
      expect(parsed.itemListElement[0].name).toBe("Home");
      expect(parsed.itemListElement[1].name).toBe("Services");
    });
  });

  it("does NOT render HTML-escaped JSON (dangerouslySetInnerHTML used correctly)", () => {
    const org: Organization = {
      "@type": "Organization",
      name: "A & B Consulting",
      url: SITE_URL,
    };

    render(<JsonLd data={org} />);

    const script = screen.getByTestId("json-ld");
    // The & should not be HTML-encoded inside the JSON
    expect(script.textContent).toContain("A & B");
  });
});
