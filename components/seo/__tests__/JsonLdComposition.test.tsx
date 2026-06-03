import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import type { Service } from "@/lib/seo/types";

describe("JSON-LD Composition — Page-level injection (SEO-5)", () => {
  describe("Layout: Organization + WebSite coexist", () => {
    it("renders both Organization and WebSite scripts without conflict", () => {
      render(
        <>
          <OrganizationJsonLd
            name="ShineTechData"
            url={SITE_URL}
            logo={`${SITE_URL}/logo.png`}
            sameAs={[
              "https://linkedin.com/company/shinetechdata",
              "https://github.com/shinetechdata",
            ]}
          />
          <WebSiteJsonLd
            name="ShineTechData"
            url={SITE_URL}
            searchUrl={`${SITE_URL}/search?q={search_term_string}`}
          />
        </>
      );

      const scripts = screen.getAllByTestId("json-ld");
      expect(scripts).toHaveLength(2);

      // First script: Organization
      const orgParsed = JSON.parse(scripts[0].textContent ?? "");
      expect(orgParsed["@type"]).toBe("Organization");
      expect(orgParsed.name).toBe("ShineTechData");

      // Second script: WebSite
      const webParsed = JSON.parse(scripts[1].textContent ?? "");
      expect(webParsed["@type"]).toBe("WebSite");
      expect(webParsed.name).toBe("ShineTechData");
    });

    it("produces well-formed JSON in both scripts", () => {
      render(
        <>
          <OrganizationJsonLd name="ShineTechData" url={SITE_URL} />
          <WebSiteJsonLd name="ShineTechData" url={SITE_URL} />
        </>
      );

      const scripts = screen.getAllByTestId("json-ld");
      for (const script of scripts) {
        // Must not throw on parse
        const parsed = JSON.parse(script.textContent ?? "");
        expect(typeof parsed["@context"] === "undefined" || parsed["@context"] === "https://schema.org").toBe(true);
        expect(typeof parsed["@type"]).toBe("string");
      }
    });
  });

  describe("Service detail page: BreadcrumbList + Service coexist", () => {
    it("renders both BreadcrumbList and Service scripts without conflict", () => {
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

      render(
        <>
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: `${SITE_URL}/en/` },
              { name: "Services", url: `${SITE_URL}/en/services/` },
              {
                name: "Data Analysis",
                url: `${SITE_URL}/en/services/data-analysis/`,
              },
            ]}
          />
          <JsonLd<Service> data={service} />
        </>
      );

      const scripts = screen.getAllByTestId("json-ld");
      expect(scripts).toHaveLength(2);

      // First script: BreadcrumbList
      const bcParsed = JSON.parse(scripts[0].textContent ?? "");
      expect(bcParsed["@type"]).toBe("BreadcrumbList");
      expect(bcParsed.itemListElement).toHaveLength(3);

      // Second script: Service
      const svcParsed = JSON.parse(scripts[1].textContent ?? "");
      expect(svcParsed["@type"]).toBe("Service");
      expect(svcParsed.name).toBe("Data Analysis");
    });
  });
});
