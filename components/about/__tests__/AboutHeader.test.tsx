import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { AboutHeader } from "@/components/about/hero/AboutHeader";
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

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("AboutHeader", () => {
  it("renders the eyebrow text from i18n", async () => {
    const jsx = await AboutHeader({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.about.header.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders title and titleAccent combined in the h1", async () => {
    const jsx = await AboutHeader({ locale: "en" });
    render(jsx);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(enMessages.about.header.title.trim());
    expect(heading).toHaveTextContent(enMessages.about.header.titleAccent);
  });

  it("renders the subtitle typing mock with correct static and dynamic text", async () => {
    const jsx = await AboutHeader({ locale: "en" });
    render(jsx);

    const subtitle = screen.getByTestId("subtitle");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.textContent).toBe(
      `${enMessages.about.header.subtitleStatic} ${enMessages.about.header.subtitleDynamic}`,
    );
  });

  it("has the eyebrow styled as a badge with primary color", async () => {
    const jsx = await AboutHeader({ locale: "en" });
    render(jsx);

    const badge = screen.getByText(enMessages.about.header.eyebrow);
    expect(badge.className).toContain("bg-primary/10");
    expect(badge.className).toContain("text-primary");
  });
});
