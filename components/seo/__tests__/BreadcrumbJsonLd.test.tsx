import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/lib/site";

describe("BreadcrumbJsonLd (SEO-5)", () => {
  it("renders a script tag with application/ld+json type", () => {
    render(
      <BreadcrumbJsonLd
        items={[{ name: "Home", url: `${SITE_URL}/en/` }]}
      />
    );

    const script = screen.getByTestId("json-ld");
    expect(script.tagName).toBe("SCRIPT");
    expect(script.getAttribute("type")).toBe("application/ld+json");
  });

  it("renders a BreadcrumbList schema with itemListElement", () => {
    const items = [
      { name: "Home", url: `${SITE_URL}/en/` },
      { name: "Services", url: `${SITE_URL}/en/services/` },
    ];

    render(<BreadcrumbJsonLd items={items} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement).toHaveLength(2);
  });

  it("auto-calculates position starting from 1 for each item", () => {
    const items = [
      { name: "Home", url: `${SITE_URL}/en/` },
      { name: "Services", url: `${SITE_URL}/en/services/` },
      { name: "Data Analysis", url: `${SITE_URL}/en/services/data-analysis/` },
    ];

    render(<BreadcrumbJsonLd items={items} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed.itemListElement[0]["@type"]).toBe("ListItem");
    expect(parsed.itemListElement[0].position).toBe(1);
    expect(parsed.itemListElement[0].name).toBe("Home");
    expect(parsed.itemListElement[0].item).toBe(`${SITE_URL}/en/`);

    expect(parsed.itemListElement[1].position).toBe(2);
    expect(parsed.itemListElement[1].name).toBe("Services");

    expect(parsed.itemListElement[2].position).toBe(3);
    expect(parsed.itemListElement[2].name).toBe("Data Analysis");
  });

  it("handles a single breadcrumb item", () => {
    const items = [{ name: "Home", url: `${SITE_URL}/en/` }];

    render(<BreadcrumbJsonLd items={items} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed.itemListElement).toHaveLength(1);
    expect(parsed.itemListElement[0].position).toBe(1);
    expect(parsed.itemListElement[0].name).toBe("Home");
  });

  it("renders each ListItem with its own @type", () => {
    const items = [
      { name: "Home", url: `${SITE_URL}/` },
      { name: "About", url: `${SITE_URL}/about/` },
    ];

    render(<BreadcrumbJsonLd items={items} />);

    const script = screen.getByTestId("json-ld");
    const parsed = JSON.parse(script.textContent ?? "");
    expect(parsed.itemListElement[0]["@type"]).toBe("ListItem");
    expect(parsed.itemListElement[1]["@type"]).toBe("ListItem");
  });
});
