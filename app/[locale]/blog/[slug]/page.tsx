import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { ORG_ID, SITE_URL, locales, personId } from "@/lib/site";
import { languageAlternates } from "@/lib/seo/alternates";
import {
  blogSlugs,
  blogUi,
  getPostBySlug,
  otherPosts,
  readingMinutes,
  toBlogLocale,
} from "@/lib/data/blog";
import { BlogPostBody, formatPostDate } from "@/components/blog/BlogPostBody";
import { BlogSources } from "@/components/blog/BlogSources";
import { BlogAuthorCard } from "@/components/blog/BlogAuthorCard";
import { CtaButton } from "@/components/home/cta/CtaButton";
import { JsonLd } from "@/components/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { BlogPosting, Person } from "@/lib/seo/types";
import { PageTransition, PostTitleTransition } from "@/components/ui/ViewTransition";

// The share image comes from the colocated opengraph-image.tsx / twitter-image.tsx
// file conventions (file-based metadata overrides `images` in generateMetadata),
// so no `images` are set below: that keeps exactly one og:image / twitter:image.

// Unknown slugs must 404 instead of rendering an empty 200 page.
export const dynamicParams = false;

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
  const title = content.seoTitle ?? `${content.title} | ShineTechData`;
  const description = content.seoDescription ?? content.description;
  const canonical = `${SITE_URL}/${locale}/blog/${slug}/`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(`/blog/${slug}/`),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ShineTechData",
      locale: locale === "es" ? "es_DO" : "en_US",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  const { author } = post;
  const authorLd: Person = {
    "@type": "Person",
    "@id": personId(author.id),
    name: author.name,
    jobTitle: author.jobTitle[lang],
    description: author.bio[lang],
    ...(author.sameAs.length > 0 && { sameAs: author.sameAs }),
    worksFor: { "@id": ORG_ID },
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
          dateModified: post.updatedAt ?? post.publishedAt,
          inLanguage: locale === "es" ? "es-DO" : "en-US",
          url,
          image: `${SITE_URL}/opengraph-image.png`,
          mainEntityOfPage: url,
          author: authorLd,
          publisher: { "@id": ORG_ID },
          citation: content.sources.map((source) => ({
            "@type": "CreativeWork",
            name: source.title,
            url: source.url,
            publisher: { "@type": "Organization", name: source.publisher },
          })),
        }}
      />

      <PageTransition>
      <article className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <div className="absolute inset-x-0 top-0 h-72 hero-glow -z-10" />
        <Link
          href="/blog/"
          transitionTypes={["nav-back"]}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          {ui.backToBlog}
        </Link>

        <header className="mt-8 mb-10 space-y-5">
          <p className="text-sm text-muted-foreground">
            {ui.by}{" "}
            <span className="font-medium text-foreground">{author.name}</span>
            {" · "}
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt, locale)}
            </time>{" "}
            · {readingMinutes(content)} {ui.minRead}
          </p>
          <PostTitleTransition slug={slug}>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {content.title}
            </h1>
          </PostTitleTransition>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </header>

        <BlogPostBody html={content.html} lang={lang} />
        <BlogSources
          sources={content.sources}
          heading={ui.sources}
          newTabLabel={ui.opensInNewTab}
        />
        <BlogAuthorCard
          author={author}
          lang={lang}
          heading={ui.aboutAuthor}
          newTabLabel={ui.opensInNewTab}
        />

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

        <nav aria-label={ui.alsoRelated} className="mt-12">
          <h2 className="text-lg font-bold">{ui.alsoRelated}</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {post.alsoRelated.map((s) => (
              <li key={s}>
                <Link
                  href={`/services/${s}/`}
                  prefetch={false}
                  className="inline-flex rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {tService(`${s}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={ui.moreArticles} className="mt-12">
          <h2 className="text-lg font-bold">{ui.moreArticles}</h2>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {otherPosts(slug).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}/`}
                  transitionTypes={["nav-forward"]}
                  className="block h-full gradient-border-card p-5 hover-glow transition-all"
                >
                  <PostTitleTransition slug={p.slug}>
                    <span className="inline-block font-semibold leading-snug">
                      {p.content[lang].title}
                    </span>
                  </PostTitleTransition>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
      </PageTransition>
    </>
  );
}
