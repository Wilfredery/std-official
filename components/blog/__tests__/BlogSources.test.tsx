import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogSources } from "@/components/blog/BlogSources";

const sources = [
  {
    title: "Report A",
    publisher: "Publisher A",
    year: 2025,
    url: "https://example.com/a",
  },
  {
    title: "Report B",
    publisher: "Publisher B",
    year: 2026,
    url: "https://example.com/b",
  },
];

describe("BlogSources", () => {
  it("renders an ordered list of external links with publisher and year", () => {
    render(
      <BlogSources sources={sources} heading="Sources" newTabLabel="opens in a new tab" />,
    );
    expect(screen.getByRole("heading", { name: "Sources" })).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Report A");
    expect(items[0]).toHaveTextContent("Publisher A, 2025");

    const link = screen.getByRole("link", { name: /Report B/ });
    expect(link).toHaveAttribute("href", "https://example.com/b");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("opens in a new tab");
  });

  it("renders nothing without sources", () => {
    const { container } = render(
      <BlogSources sources={[]} heading="Sources" newTabLabel="x" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
