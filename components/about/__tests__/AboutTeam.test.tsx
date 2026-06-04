import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { AboutTeam } from "@/components/about/team/AboutTeam";
import enMessages from "@/messages/en.json";

vi.mock("@/components/home/cta/CtaButton", () => ({
  CtaButton: ({ label }: { label: string }) => (
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

describe("AboutTeam", () => {
  it("renders the section title from i18n", async () => {
    const jsx = await AboutTeam({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.team.title),
    ).toBeInTheDocument();
  });

  it("renders the subtitle from i18n", async () => {
    const jsx = await AboutTeam({ locale: "en" });
    render(jsx);

    expect(
      screen.getByText(enMessages.about.team.subtitle),
    ).toBeInTheDocument();
  });

  it("renders all 4 team member cards with their roles", async () => {
    const jsx = await AboutTeam({ locale: "en" });
    render(jsx);

    const items = enMessages.about.team.items;
    for (const item of items) {
      expect(screen.getByText(item.role)).toBeInTheDocument();
    }
  });

  it("renders all 4 team member cards with their descriptions", async () => {
    const jsx = await AboutTeam({ locale: "en" });
    render(jsx);

    const items = enMessages.about.team.items;
    for (const item of items) {
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

});
