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
      "https://linkedin.com/company/shinetechdata",
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
});
