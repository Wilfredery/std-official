import { ExternalLink } from "lucide-react";
import type { BlogSource } from "@/lib/data/blog";

interface BlogSourcesProps {
  sources: BlogSource[];
  /** Section heading ("Sources" / "Fuentes"). */
  heading: string;
  /** Screen-reader hint appended to each link ("opens in a new tab"). */
  newTabLabel: string;
}

/** Ordered list of external references backing the statistics in a post. */
export function BlogSources({ sources, heading, newTabLabel }: BlogSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="blog-sources-heading" className="mt-12">
      <h2
        id="blog-sources-heading"
        className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
      >
        {heading}
      </h2>
      <ol className="mt-4 list-decimal pl-6 space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground marker:font-semibold marker:text-primary">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-baseline gap-x-1 font-medium text-foreground underline underline-offset-4 decoration-primary/40 hover:text-primary hover:decoration-primary transition-colors"
            >
              {source.title}
              <ExternalLink
                aria-hidden="true"
                className="size-3.5 self-center shrink-0"
              />
              <span className="sr-only">({newTabLabel})</span>
            </a>
            <span>
              {" "}
              — {source.publisher}, {source.year}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
