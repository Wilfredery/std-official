import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { latestPosts } from "@/lib/data/blog";
import { PostCard } from "@/components/blog/PostCard";

const POST_COUNT = 3;

export async function LatestPostsSection({ locale }: { locale: string }) {
  const posts = latestPosts(POST_COUNT);
  if (posts.length === 0) return null;
  const t = await getTranslations("home.latestPosts");

  return (
    <section className="py-16 sm:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-primary mb-4 block">
            {t("eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
            {t("title")}
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} locale={locale} headingLevel="h3" />
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/blog/"
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
