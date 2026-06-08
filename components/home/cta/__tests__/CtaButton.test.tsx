import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { CtaButton } from "@/components/home/cta/CtaButton";

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
    "aria-label": ariaLabel,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

describe("CtaButton", () => {
  const label = "Start Your Free Audit";

  it("renders the label text", () => {
    render(<CtaButton label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("renders an arrow icon", () => {
    const { container } = render(<CtaButton label={label} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has href=/contact", () => {
    render(<CtaButton label={label} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("label text is hidden on small screens by default (max-w-0)", () => {
    const { container } = render(<CtaButton label={label} />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("sm:max-w-0");
  });

  it("on hover/group interaction, text expands (group-hover:max-w-xs)", () => {
    const { container } = render(<CtaButton label={label} />);
    const span = container.querySelector("span");
    expect(span).toHaveClass("sm:group-hover:max-w-xs");
  });

  // ---- S1-R3: focus-visible ring ----

  it("applies focus-visible outline ring classes", () => {
    render(<CtaButton label={label} />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("focus-visible:outline-2");
    expect(link).toHaveClass("focus-visible:outline-offset-2");
    expect(link).toHaveClass("focus-visible:outline-ring");
  });

  // ---- S1-R3: ARIA labels ----

  it("has an accessible label for screen readers", () => {
    render(<CtaButton label={label} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", label);
  });
});
