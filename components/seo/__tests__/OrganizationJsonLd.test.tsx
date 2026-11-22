import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { SITE_URL } from "@/lib/site";

describe("OrganizationJsonLd (SEO-5)", () => {
  it("includes contact details when provided", () => {
    render(
      <OrganizationJsonLd
        name="ShineTechData"
        url={SITE_URL}
        email="contact@shinetechdata.com"
        telephone="+1-829-584-9184"
        address={{ "@type": "PostalAddress", addressCountry: "DO" }}
        contactPoint={[
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: "+1-829-584-9184",
          },
        ]}
      />
    );

    const parsed = JSON.parse(screen.getByTestId("json-ld").textContent ?? "");
    expect(parsed.email).toBe("contact@shinetechdata.com");
    expect(parsed.telephone).toBe("+1-829-584-9184");
    expect(parsed.address.addressCountry).toBe("DO");
    expect(parsed.contactPoint[0].contactType).toBe("customer service");
  });

  it("omits contact fields when not provided", () => {
    render(<OrganizationJsonLd name="ShineTechData" url={SITE_URL} />);
    const parsed = JSON.parse(screen.getByTestId("json-ld").textContent ?? "");
    expect(parsed).not.toHaveProperty("telephone");
    expect(parsed).not.toHaveProperty("contactPoint");
  });

  it("renders a script tag with application/ld+json type", () => {
    render(<OrganizationJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    expect(script.tagName).toBe("SCRIPT");
    expect(script.getAttribute("type")).toBe("application/ld+json");
  });

  it("renders an Organization schema with name and url", () => {
    render(<OrganizationJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed["@type"]).toBe("Organization");
    expect(parsed.name).toBe("ShineTechData");
    expect(parsed.url).toBe(SITE_URL);
  });

  it("renders a ProfessionalService with @id, locality and areaServed", () => {
    render(
      <OrganizationJsonLd
        type="ProfessionalService"
        id={`${SITE_URL}/#organization`}
        name="ShineTechData"
        url={SITE_URL}
        address={{
          "@type": "PostalAddress",
          addressLocality: "San Pedro de Macorís",
          postalCode: "21000",
          addressCountry: "DO",
        }}
        areaServed={["Dominican Republic", "United States"]}
      />
    );

    const parsed = JSON.parse(screen.getByTestId("json-ld").textContent ?? "");
    expect(parsed["@type"]).toBe("ProfessionalService");
    expect(parsed["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(parsed.address.addressLocality).toBe("San Pedro de Macorís");
    expect(parsed.areaServed).toEqual(["Dominican Republic", "United States"]);
  });

  it("includes logo when provided", () => {
    render(
      <OrganizationJsonLd
        name="ShineTechData"
        url={SITE_URL}
        logo={`${SITE_URL}/logo.png`}
      />
    );

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed.logo).toBe(`${SITE_URL}/logo.png`);
  });

  it("includes sameAs when provided", () => {
    const socials = [
      "https://www.linkedin.com/company/shine-tech-data/",
      "https://github.com/shinetechdata",
    ];

    render(
      <OrganizationJsonLd
        name="ShineTechData"
        url={SITE_URL}
        sameAs={socials}
      />
    );

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed.sameAs).toEqual(socials);
  });

  it("does NOT include logo in JSON when logo prop is omitted", () => {
    render(<OrganizationJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed).not.toHaveProperty("logo");
  });

  it("does NOT include sameAs in JSON when sameAs prop is omitted", () => {
    render(<OrganizationJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed).not.toHaveProperty("sameAs");
  });

  it("includes opening hours, founder and offer catalog when provided", () => {
    render(
      <OrganizationJsonLd
        type="ProfessionalService"
        name="ShineTechData"
        url={SITE_URL}
        openingHoursSpecification={[
          { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday"], opens: "09:00", closes: "18:00" },
        ]}
        founder={{ "@id": `${SITE_URL}/#person-x` }}
        hasOfferCatalog={{
          "@type": "OfferCatalog",
          name: "Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "BI", url: `${SITE_URL}/en/services/bi/` } },
          ],
        }}
      />
    );
    const parsed = JSON.parse(screen.getByTestId("json-ld").textContent ?? "");
    expect(parsed.openingHoursSpecification[0].opens).toBe("09:00");
    expect(parsed.founder["@id"]).toBe(`${SITE_URL}/#person-x`);
    expect(parsed.hasOfferCatalog.itemListElement[0].itemOffered.name).toBe("BI");
  });

  it("omits opening hours, founder and catalog when not provided", () => {
    render(<OrganizationJsonLd name="ShineTechData" url={SITE_URL} />);
    const parsed = JSON.parse(screen.getByTestId("json-ld").textContent ?? "");
    expect(parsed).not.toHaveProperty("openingHoursSpecification");
    expect(parsed).not.toHaveProperty("founder");
    expect(parsed).not.toHaveProperty("hasOfferCatalog");
  });
});
