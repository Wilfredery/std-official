import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(
    async () => (key: string) => `t:${key}`,
  ),
  setRequestLocale: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

vi.mock("@/lib/i18n/navigation", () => ({
  Link: ({ href, children, className }: Record<string, unknown>) => (
    <a href={href as string} className={className as string}>
      {children as React.ReactNode}
    </a>
  ),
}));

vi.mock("@/components/home/cta/CtaButton", () => ({
  CtaButton: ({ label }: { label: string }) => <button>{label}</button>,
}));

import BlogPostPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/[locale]/blog/[slug]/page";
import { blogPosts, blogUi } from "@/lib/data/blog";
import { locales } from "@/lib/site";

function jsonLdOf(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]'),
  ).map((s) => JSON.parse(s.innerHTML));
}

const cases = blogPosts.flatMap((post) =>
  locales.map((locale) => ({ post, locale, slug: post.slug })),
);

describe("blog post page", () => {
  it("statically generates every locale x slug", () => {
    expect(generateStaticParams()).toHaveLength(blogPosts.length * locales.length);
  });

  describe.each(cases)("$slug [$locale]", ({ post, locale, slug }) => {
    const lang = locale === "es" ? "es" : "en";
    const content = post.content[lang];

    it("leaves images to the file-based opengraph-image / twitter-image", async () => {
      const meta = await generateMetadata({
        params: Promise.resolve({ locale, slug }),
      });
      expect(meta.openGraph).not.toHaveProperty("images");
      expect(meta.twitter).not.toHaveProperty("images");
    });

    it("renders the sources list as external links with an accessible hint", async () => {
      const ui = blogUi[lang];
      const { container } = render(
        await BlogPostPage({ params: Promise.resolve({ locale, slug }) }),
      );

      const heading = screen.getByRole("heading", { level: 2, name: ui.sources });
      const section = heading.closest("section") as HTMLElement;
      const list = within(section).getByRole("list");
      expect(list.tagName).toBe("OL");

      const links = within(list).getAllByRole("link");
      expect(links.map((a) => a.getAttribute("href"))).toEqual(
        content.sources.map((s) => s.url),
      );
      for (const a of links) {
        expect(a).toHaveAttribute("target", "_blank");
        expect(a).toHaveAttribute("rel", "noopener noreferrer");
        expect(a).toHaveTextContent(ui.opensInNewTab);
      }

      const posting = jsonLdOf(container).find((d) => d["@type"] === "BlogPosting");
      expect(posting.citation).toEqual(
        content.sources.map((s) => ({
          "@type": "CreativeWork",
          name: s.title,
          url: s.url,
          publisher: { "@type": "Organization", name: s.publisher },
        })),
      );
    });
  });
});
