import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { CtaSection } from "@/components/services/cta/CtaSection";
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

describe("CtaSection (services)", () => {
  it("renders title text", async () => {
    const jsx = await CtaSection({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.services.cta.title)).toBeInTheDocument();
  });

  it("renders subtitle text", async () => {
    const jsx = await CtaSection({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.services.cta.subtitle)).toBeInTheDocument();
  });

  it("contains the CtaButton component", async () => {
    const jsx = await CtaSection({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.services.cta.button)).toBeInTheDocument();
  });

  it("links to contact page", async () => {
    const jsx = await CtaSection({ locale: "en" });
    render(jsx);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/contact");
  });
});