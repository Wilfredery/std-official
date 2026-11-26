import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import {
  blogUi,
  readingMinutes,
  toBlogLocale,
  type BlogPost,
} from "@/lib/data/blog";
import { formatPostDate } from "@/components/blog/BlogPostBody";
import { PostTitleTransition } from "@/components/ui/ViewTransition";

interface PostCardProps {
  post: BlogPost;
  locale: string;
  /** h2 on the blog index; h3 when the card sits under a section H2. */
  headingLevel?: "h2" | "h3";
}

export function PostCard({ post, locale, headingLevel = "h2" }: PostCardProps) {
  const lang = toBlogLocale(locale);
  const ui = blogUi[lang];
  const content = post.content[lang];
  const Heading = headingLevel;

  return (
    <Link
      href={`/blog/${post.slug}/`}
      transitionTypes={["nav-forward"]}
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
      <PostTitleTransition slug={post.slug}>
        <Heading className="mt-3 text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
          {content.title}
        </Heading>
      </PostTitleTransition>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
        {content.description}
      </p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {ui.readMore}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
