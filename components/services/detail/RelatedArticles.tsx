import { Link } from "@/lib/i18n/navigation";
import { blogUi, postsForService, toBlogLocale } from "@/lib/data/blog";
import type { ServiceSlug } from "@/lib/data/services";

/** Links a service page to the blog posts that support it (hub -> spokes). */
export function RelatedArticles({ locale, slug }: { locale: string; slug: ServiceSlug }) {
  const posts = postsForService(slug);
  if (posts.length === 0) return null;
  const lang = toBlogLocale(locale);

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <h2 className="text-2xl font-extrabold tracking-tight">{blogUi[lang].relatedArticles}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}/`}
              prefetch={false}
              className="block h-full gradient-border-card p-5 hover-glow transition-all"
            >
              <span className="font-semibold leading-snug">{p.content[lang].title}</span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {p.content[lang].description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
