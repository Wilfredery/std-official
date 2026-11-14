import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import {
  blogPosts,
  blogUi,
  readingMinutes,
  toBlogLocale,
} from "@/lib/data/blog";
import { formatPostDate } from "@/components/blog/BlogPostBody";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ui = blogUi[toBlogLocale(locale)];
  const canonical = `${SITE_URL}/${locale}/blog/`;
  const ogImage = {
    url: `${SITE_URL}/opengraph-image.png`,
    width: 1200,
    height: 630,
  };

  return {
    title: ui.seoTitle,
    description: ui.seoDescription,
    alternates: {
      canonical,
      languages: languageAlternates("/blog/"),
    },
    openGraph: {
      title: ui.seoTitle,
      description: ui.seoDescription,
      url: canonical,
      siteName: "ShineTechData",
      images: [ogImage],
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ui.seoTitle,
      description: ui.seoDescription,
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = toBlogLocale(locale);
  const ui = blogUi[lang];
  const posts = [...blogPosts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: ui.home, url: `${SITE_URL}/${locale}/` },
          { name: ui.eyebrow, url: `${SITE_URL}/${locale}/blog/` },
        ]}
      />
      <section className="relative overflow-hidden pt-15 pb-10">
        <div className="absolute inset-0 hero-glow -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            {ui.eyebrow}
          </span>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl">
            {ui.title} <span className="gradient-text">{ui.titleAccent}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            {ui.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const content = post.content[lang];
            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}/`}
                  prefetch={false}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6
                    transition-all hover:border-primary/50 hover:shadow-lg focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    <time dateTime={post.publishedAt}>
                      {formatPostDate(post.publishedAt, locale)}
                    </time>{" "}
                    · {readingMinutes(content)} {ui.minRead}
                  </p>
                  <h2 className="mt-3 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {content.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                    {content.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {ui.readMore}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
