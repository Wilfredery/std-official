import { ExternalLink } from "lucide-react";
import type { BlogAuthor, BlogLocale } from "@/lib/data/blog";

interface BlogAuthorCardProps {
  author: BlogAuthor;
  lang: BlogLocale;
  /** Section heading ("About the author" / "Sobre el autor"). */
  heading: string;
  /** Screen-reader hint appended to each profile link ("opens in a new tab"). */
  newTabLabel: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function profileLabel(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

/** Visible author bio matching the post's Person JSON-LD. */
export function BlogAuthorCard({ author, lang, heading, newTabLabel }: BlogAuthorCardProps) {
  return (
    <section
      aria-labelledby="blog-author-heading"
      className="mt-12 gradient-border-card p-6 sm:p-8"
    >
      <h2
        id="blog-author-heading"
        className="text-sm font-semibold uppercase tracking-wider text-primary"
      >
        {heading}
      </h2>
      <div className="mt-4 flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base font-bold text-primary"
        >
          {initials(author.name)}
        </span>
        <div className="space-y-2">
          <p>
            <span className="text-lg font-bold text-foreground">{author.name}</span>
            <span className="block text-sm text-muted-foreground">{author.jobTitle[lang]}</span>
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {author.bio[lang]}
          </p>
          {author.sameAs.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {author.sameAs.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 decoration-primary/40 hover:text-primary hover:decoration-primary transition-colors"
                  >
                    {profileLabel(url)}
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                    <span className="sr-only">({newTabLabel})</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
