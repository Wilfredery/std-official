import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import { blogUi, latestPosts, toBlogLocale } from "@/lib/data/blog";
import { PostCard } from "@/components/blog/PostCard";
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
  const ui = blogUi[toBlogLocale(locale)];
  const posts = latestPosts();

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
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
