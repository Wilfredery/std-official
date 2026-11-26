import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import { blogUi, latestPosts, readingMinutes, toBlogLocale } from "@/lib/data/blog";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { formatPostDate } from "@/components/blog/BlogPostBody";
import type { BlogCardData, BlogTopic } from "@/components/blog/blogSearch";
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
  const serviceT = await getTranslations("serviceDetail");

  const cards: BlogCardData[] = latestPosts().map((post) => {
    const content = post.content[lang];
    return {
      slug: post.slug,
      title: content.title,
      description: content.description,
      publishedAt: post.publishedAt,
      dateLabel: formatPostDate(post.publishedAt, locale),
      minutes: readingMinutes(content),
      topic: post.relatedService,
      topicLabel: serviceT(`services.${post.relatedService}.title`),
    };
  });

  // One chip per topic that has posts, most posts first.
  const topics: BlogTopic[] = [];
  for (const card of cards) {
    const existing = topics.find((t) => t.slug === card.topic);
    if (existing) existing.count += 1;
    else topics.push({ slug: card.topic, label: card.topicLabel, count: 1 });
  }
  topics.sort((a, b) => b.count - a.count);

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
        <BlogExplorer
          posts={cards}
          topics={topics}
          ui={{
            searchLabel: ui.searchLabel,
            searchPlaceholder: ui.searchPlaceholder,
            topicsLabel: ui.topicsLabel,
            allTopics: ui.allTopics,
            featured: ui.featured,
            resultsOne: ui.resultsOne,
            resultsMany: ui.resultsMany,
            noResultsTitle: ui.noResultsTitle,
            noResultsText: ui.noResultsText,
            clearFilters: ui.clearFilters,
            readMore: ui.readMore,
            minRead: ui.minRead,
          }}
        />
      </section>
    </>
  );
}
