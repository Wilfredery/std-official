import { describe, it, expect, vi } from "vitest";
import { render, screen, createMockTranslator } from "@/lib/__tests__/test-utils";
import { NotFoundPage } from "@/components/404/NotFoundSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

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

describe("NotFoundPage", () => {
  it("renders the 404 gradient text", async () => {
    const jsx = await NotFoundPage();
    render(jsx);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the 404 status code as an h1 heading for proper hierarchy", async () => {
    const jsx = await NotFoundPage();
    render(jsx);
    const heading = screen.getByRole("heading", { level: 1, name: "404" });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("text-8xl");
    expect(heading.className).toContain("gradient-text");
  });

  it("renders the translated title from notFound.title", async () => {
    const jsx = await NotFoundPage();
    render(jsx);
    expect(screen.getByText(enMessages.notFound.title)).toBeInTheDocument();
  });

  it("renders the translated description from notFound.description", async () => {
    const jsx = await NotFoundPage();
    render(jsx);
    expect(screen.getByText(enMessages.notFound.description)).toBeInTheDocument();
  });

  it("renders the Back to home link pointing to /", async () => {
    const jsx = await NotFoundPage();
    render(jsx);
    const link = screen.getByRole("link", { name: enMessages.notFound.backToHome });
    expect(link).toHaveAttribute("href", "/");
  });
});
