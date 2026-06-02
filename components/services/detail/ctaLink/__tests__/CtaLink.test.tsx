import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { CtaLink } from "@/components/services/detail/ctaLink/CtaLink";

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children?: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("CtaLink", () => {
  it("renders the label text", () => {
    render(<CtaLink label="Back to all services" />);
    expect(screen.getByText("Back to all services")).toBeInTheDocument();
  });

  it("link href points to /services", () => {
    render(<CtaLink label="Back" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/services");
  });

  it("renders an ArrowLeft icon inside the link", () => {
    const { container } = render(<CtaLink label="Back" />);
    const link = screen.getByRole("link");
    const svg = link.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies the primary button styling", () => {
    render(<CtaLink label="Back" />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-primary");
    expect(link).toHaveClass("rounded-full");
  });
});
