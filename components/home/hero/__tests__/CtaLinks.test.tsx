import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { CtaLinks } from "@/components/home/hero/CtaLinks";

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("CtaLinks", () => {
  const primaryLabel = "Book Free Audit";
  const secondaryLabel = "Explore Services";

  it("renders primary link with correct href", () => {
    render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/contact");
  });

  it("renders secondary link with correct href", () => {
    render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    const links = screen.getAllByRole("link");
    expect(links[1]).toHaveAttribute("href", "/services");
  });

  it("renders primary label text", () => {
    render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    expect(screen.getByText(primaryLabel)).toBeInTheDocument();
  });

  it("renders secondary label text", () => {
    render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    expect(screen.getByText(secondaryLabel)).toBeInTheDocument();
  });

  it("renders both Lucide icons (CalendarDays and ArrowRight)", () => {
    const { container } = render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(2);
  });

  it("renders text-reveal classes on primary link span", () => {
    render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    const spans = screen.getAllByText(primaryLabel);
    expect(spans[0]).toHaveClass("sm:max-w-0");
    expect(spans[0]).toHaveClass("sm:group-hover:max-w-xs");
  });

  it("renders text-reveal classes on secondary link span", () => {
    render(
      <CtaLinks primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />,
    );
    const spans = screen.getAllByText(secondaryLabel);
    expect(spans[0]).toHaveClass("sm:max-w-0");
    expect(spans[0]).toHaveClass("sm:group-hover:max-w-xs");
  });
});
