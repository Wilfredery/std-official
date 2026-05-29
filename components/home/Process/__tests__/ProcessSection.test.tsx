import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { ProcessSection } from "@/components/home/process/ProcessSection";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

describe("ProcessSection", () => {
  it("renders eyebrow text", async () => {
    const jsx = await ProcessSection({ locale: "en" });
    render(jsx);
    expect(
      screen.getByText(enMessages.home.process.eyebrow),
    ).toBeInTheDocument();
  });

  it("renders title text", async () => {
    const jsx = await ProcessSection({ locale: "en" });
    render(jsx);
    expect(screen.getByText(enMessages.home.process.title)).toBeInTheDocument();
  });

  it("renders exactly 3 step items", async () => {
    const jsx = await ProcessSection({ locale: "en" });
    render(jsx);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3);
  });

  it("each step has a step number (01, 02, 03)", async () => {
    const jsx = await ProcessSection({ locale: "en" });
    render(jsx);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("connecting line exists on desktop (hidden on mobile)", async () => {
    const jsx = await ProcessSection({ locale: "en" });
    const { container } = render(jsx);
    const line = container.querySelector(".h-px");
    expect(line).toBeInTheDocument();
    expect(line).toHaveClass("hidden");
    expect(line).toHaveClass("sm:block");
  });
});
