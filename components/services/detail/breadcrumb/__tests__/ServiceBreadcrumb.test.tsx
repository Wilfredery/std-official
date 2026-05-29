import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { ServiceBreadcrumb } from "@/components/services/detail/breadcrumb/ServiceBreadcrumb";

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("ServiceBreadcrumb", () => {
  it("renders the label text", () => {
    render(<ServiceBreadcrumb label="Back to Services" />);
    expect(screen.getByText("Back to Services")).toBeInTheDocument();
  });

  it("link href points to /services", () => {
    render(<ServiceBreadcrumb label="Back" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/services");
  });

  it("renders an ArrowLeft icon inside the link", () => {
    const { container } = render(<ServiceBreadcrumb label="Back" />);
    const link = screen.getByRole("link");
    const svg = link.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
