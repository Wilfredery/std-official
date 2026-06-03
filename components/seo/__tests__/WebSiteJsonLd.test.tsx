import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WebSiteJsonLd } from "@/components/seo/WebSiteJsonLd";
import { SITE_URL } from "@/lib/site";

describe("WebSiteJsonLd (SEO-5)", () => {
  it("renders a script tag with application/ld+json type", () => {
    render(<WebSiteJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    expect(script.tagName).toBe("SCRIPT");
    expect(script.getAttribute("type")).toBe("application/ld+json");
  });

  it("renders a WebSite schema with name and url", () => {
    render(<WebSiteJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed["@type"]).toBe("WebSite");
    expect(parsed.name).toBe("ShineTechData");
    expect(parsed.url).toBe(SITE_URL);
  });

  it("includes SearchAction when searchUrl is provided", () => {
    const searchUrl = `${SITE_URL}/search?q={search_term_string}`;

    render(
      <WebSiteJsonLd
        name="ShineTechData"
        url={SITE_URL}
        searchUrl={searchUrl}
      />
    );

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed.potentialAction).toBeDefined();
    expect(parsed.potentialAction["@type"]).toBe("SearchAction");
    expect(parsed.potentialAction.target).toBe(searchUrl);
    expect(parsed.potentialAction["query-input"]).toBe(
      "required name=search_term_string"
    );
  });

  it("omits potentialAction when searchUrl is not provided", () => {
    render(<WebSiteJsonLd name="ShineTechData" url={SITE_URL} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed).not.toHaveProperty("potentialAction");
  });

  it("omits potentialAction when searchUrl is undefined explicitly", () => {
    render(
      <WebSiteJsonLd
        name="ShineTechData"
        url={SITE_URL}
        searchUrl={undefined}
      />
    );

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed).not.toHaveProperty("potentialAction");
  });
});
