import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/lib/__tests__/test-utils";
import { Button } from "@/components/ui/button";

vi.mock("@base-ui/react/button", () => ({
  Button: ({
    children,
    className,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button className={className} data-testid="button-primitive" {...props}>
      {children}
    </button>
  ),
}));

describe("Button", () => {
  // ── Variant class assertions ──────────────────────────────────

  it("default variant applies bg-primary text-primary-foreground", () => {
    render(<Button>Default</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("text-primary-foreground");
  });

  it("destructive variant applies destructive classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("bg-destructive/10");
    expect(btn.className).toContain("text-destructive");
  });

  it("outline variant applies border-border and bg-background", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("border-border");
    expect(btn.className).toContain("bg-background");
  });

  it("secondary variant applies bg-secondary text-secondary-foreground", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("bg-secondary");
    expect(btn.className).toContain("text-secondary-foreground");
  });

  it("ghost variant applies hover:bg-muted", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("hover:bg-muted");
  });

  it("link variant applies text-primary and underline-offset-4", () => {
    render(<Button variant="link">Link</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("text-primary");
    expect(btn.className).toContain("underline-offset-4");
  });

  // ── Size class assertions ─────────────────────────────────────

  it("default size applies h-8", () => {
    render(<Button size="default">Default Size</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("h-8");
  });

  it("sm size applies h-7", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("h-7");
  });

  it("lg size applies h-9", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("h-9");
  });

  it("icon size applies size-8", () => {
    render(<Button size="icon">🔍</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("size-8");
  });

  // ── Other props ───────────────────────────────────────────────

  it("renders children text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("passes disabled prop to underlying button", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn).toBeDisabled();
  });

  it("appends custom className alongside variant classes", () => {
    render(<Button className="custom-extra">Styled</Button>);
    const btn = screen.getByTestId("button-primitive");
    expect(btn.className).toContain("custom-extra");
    expect(btn.className).toContain("bg-primary");
  });
});
