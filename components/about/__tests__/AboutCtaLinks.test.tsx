import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { AboutCtaLinks } from "@/components/about/cta/AboutCtaLinks";
import enMessages from "@/messages/en.json";

vi.mock("@/components/home/cta/CtaButton", () => ({
  CtaButton: ({ label }: { label: string }) => (
    // eslint-disable-next-line @next/next/no-html-link-for-pages -- test mock of next/link, not a real page link
    <a data-testid="cta-button" href="/contact">
      {label}
    </a>
  ),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("AboutCtaLinks", () => {
  it("renders the cta title from i18n", async () => {
    const jsx = await AboutCtaLinks();
    render(jsx);

    expect(
      screen.getByText(enMessages.about.cta.title),
    ).toBeInTheDocument();
  });

  it("renders the cta subtitle from i18n", async () => {
    const jsx = await AboutCtaLinks();
    render(jsx);

    expect(
      screen.getByText(enMessages.about.cta.subtitle),
    ).toBeInTheDocument();
  });

  it("renders the CtaButton with the correct label", async () => {
    const jsx = await AboutCtaLinks();
    render(jsx);

    const button = screen.getByTestId("cta-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(enMessages.about.cta.button);
  });

});
