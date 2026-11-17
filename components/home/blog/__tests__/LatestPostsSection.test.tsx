import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  createMockTranslator,
} from "@/lib/__tests__/test-utils";
import { LatestPostsSection } from "@/components/home/blog/LatestPostsSection";
import { latestPosts } from "@/lib/data/blog";
import enMessages from "@/messages/en.json";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn((namespace: string) => {
    return Promise.resolve(createMockTranslator(namespace));
  }),
}));

vi.mock("@/lib/i18n/navigation", () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Link: ({ children, href, className, prefetch, ...rest }: Record<string, unknown>) => (
    <a href={href as string} className={className as string} {...rest}>
      {children as React.ReactNode}
    </a>
  ),
}));

describe("LatestPostsSection", () => {
  it("renders the section heading as an H2", async () => {
    render((await LatestPostsSection({ locale: "en" }))!);
    expect(
      screen.getByRole("heading", { level: 2, name: enMessages.home.latestPosts.title }),
    ).toBeInTheDocument();
  });

  it("links the three newest posts with H3 titles", async () => {
    render((await LatestPostsSection({ locale: "en" }))!);
    const expected = latestPosts(3);
    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles.map((h) => h.textContent)).toEqual(
      expected.map((p) => p.content.en.title),
    );
    for (const post of expected) {
      expect(
        screen.getByRole("link", { name: new RegExp(escape(post.content.en.title)) }),
      ).toHaveAttribute("href", `/blog/${post.slug}/`);
    }
  });

  it("links to the full blog index", async () => {
    render((await LatestPostsSection({ locale: "en" }))!);
    expect(
      screen.getByRole("link", { name: enMessages.home.latestPosts.viewAll }),
    ).toHaveAttribute("href", "/blog/");
  });
});

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
