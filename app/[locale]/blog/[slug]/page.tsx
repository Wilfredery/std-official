import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { SITE_URL, locales } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import {
  blogSlugs,
  blogUi,
  getPostBySlug,
  readingMinutes,
  toBlogLocale,
} from "@/lib/data/blog";
import { BlogPostBody, formatPostDate } from "@/components/blog/BlogPostBody";
import { CtaButton } from "@/components/home/cta/CtaButton";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { BlogPosting, Organization } from "@/lib/seo/types";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    blogSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const content = post.content[toBlogLocale(locale)];
  const title = `${content.title} | ShineTechData`;
  const canonical = `${SITE_URL}/${locale}/blog/${slug}/`;
  const ogImage = {
    url: `${SITE_URL}/opengraph-image.png`,
    width: 1200,
    height: 630,
  };

  return {
    title,
    description: content.description,
    alternates: {
      canonical,
      languages: languageAlternates(`/blog/${slug}/`),
    },
    openGraph: {
      title,
      description: content.description,
      url: canonical,
      siteName: "ShineTechData",
      images: [ogImage],
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: content.description,
      images: [`${SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const lang = toBlogLocale(locale);
  const ui = blogUi[lang];
  const content = post.content[lang];
  const url = `${SITE_URL}/${locale}/blog/${slug}/`;
  const tService = await getTranslations({
    locale,
    namespace: "serviceDetail.services",
  });
  const serviceTitle = tService(`${post.relatedService}.title`);

  const org: Organization = {
    "@type": "Organization",
    name: "ShineTechData",
    url: SITE_URL,
    logo: `${SITE_URL}/images/navbarFooter/logo-light.webp`,
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: ui.home, url: `${SITE_URL}/${locale}/` },
          { name: ui.eyebrow, url: `${SITE_URL}/${locale}/blog/` },
          { name: content.title, url },
        ]}
      />
      <JsonLd<BlogPosting>
        data={{
          "@type": "BlogPosting",
          headline: content.title,
          description: content.description,
          datePublished: post.publishedAt,
          inLanguage: locale === "es" ? "es-DO" : "en-US",
          url,
          image: `${SITE_URL}/opengraph-image.png`,
          mainEntityOfPage: url,
          author: org,
          publisher: org,
        }}
      />

      <article className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <div className="absolute inset-x-0 top-0 h-72 hero-glow -z-10" />
        <Link
          href="/blog/"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          {ui.backToBlog}
        </Link>

        <header className="mt-8 mb-10 space-y-5">
          <p className="text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt, locale)}
            </time>{" "}
            · {readingMinutes(content)} {ui.minRead}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {content.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </header>

        <BlogPostBody blocks={content.blocks} />

        <aside className="relative mt-16 rounded-2xl overflow-hidden gradient-border-card p-8 sm:p-10 text-center">
          <div className="absolute inset-0 hero-glow -z-[1] opacity-50" />
          <p className="text-sm font-medium text-primary">
            {ui.relatedService}:{" "}
            <Link
              href={`/services/${post.relatedService}/`}
              prefetch={false}
              className="underline underline-offset-4 hover:text-primary/80"
            >
              {serviceTitle}
            </Link>
          </p>
          <p className="mt-4 text-2xl font-extrabold tracking-tight">
            {content.cta.title}
          </p>
          <p className="mt-3 mb-8 text-muted-foreground">{content.cta.text}</p>
          <CtaButton label={content.cta.button} />
        </aside>
      </article>
    </>
  );
}
