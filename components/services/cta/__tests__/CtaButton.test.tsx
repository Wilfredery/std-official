import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { CtaButton } from "@/components/services/cta/CtaButton";

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

describe("CtaButton", () => {
  it("renders the label text", () => {
    render(<CtaButton label="Start Your Free Audit" />);
    expect(screen.getByText("Start Your Free Audit")).toBeInTheDocument();
  });

  it("renders an arrow icon", () => {
    const { container } = render(<CtaButton label="Start Your Free Audit" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has href=/contact", () => {
    render(<CtaButton label="Start Your Free Audit" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("label text is hidden on small screens by default (max-w-0)", () => {
    const { container } = render(<CtaButton label="Start Your Free Audit" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("sm:max-w-0");
  });

  it("on hover/group interaction, text expands (group-hover:max-w-xs)", () => {
    const { container } = render(<CtaButton label="Start Your Free Audit" />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("sm:group-hover:max-w-xs");
  });
});
