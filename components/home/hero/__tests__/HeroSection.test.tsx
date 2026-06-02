import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { HeroSection } from "@/components/home/hero/HeroSection";
import enMessages from "@/messages/en.json";

vi.mock("@/components/home/hero/SubtitleTyping", () => ({
  SubtitleTyping: ({
    staticText,
    dynamicText,
  }: {
    staticText: string;
    dynamicText: string;
  }) => (
    <p data-testid="subtitle">
      {staticText} {dynamicText}
    </p>
  ),
}));

vi.mock("@/components/home/hero/CtaLinks", () => ({
  CtaLinks: () => <div data-testid="cta-links">CTA Links</div>,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("HeroSection", () => {
  it("renders badge text", async () => {
    const jsx = await HeroSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.hero.badge),
    ).toBeInTheDocument();
  });

  it("renders title and titleAccent", async () => {
    const jsx = await HeroSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.hero.title.trim()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages.home.hero.titleAccent),
    ).toBeInTheDocument();
  });

  it("renders SubtitleTyping mock with correct text", async () => {
    const jsx = await HeroSection({ locale: "en" });
    render(jsx);

    const subtitle = screen.getByTestId("subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.textContent).toBe(
      `${enMessages.home.hero.subtitleStatic} ${enMessages.home.hero.subtitleDynamic}`,
    );
  });

  it("renders CtaLinks mock", async () => {
    const jsx = await HeroSection({ locale: "en" });
    render(jsx);

    expect(screen.getByTestId("cta-links")).toBeInTheDocument();
    expect(screen.getByText("CTA Links")).toBeInTheDocument();
  });

  it("renders hero-glow background element", async () => {
    const jsx = await HeroSection({ locale: "en" });
    const { container } = render(jsx);
    expect(container.querySelector(".hero-glow")).toBeInTheDocument();
  });
});
