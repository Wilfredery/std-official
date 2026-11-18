// Styles mirror the old block renderer, applied to the HTML that marked emits.
const BODY_CLASSES = [
  "space-y-6 text-base sm:text-lg leading-relaxed text-foreground/90",
  "[&_h2]:pt-6 [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground",
  "[&_h3]:pt-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:marker:text-primary",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3 [&_ol]:marker:font-semibold [&_ol]:marker:text-primary",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_figure]:py-2 [&_img]:w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:border [&_img]:border-border",
  "[&_figcaption]:pt-3 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground",
].join(" ");

/** Renders a post body. `html` comes from the repo's own Markdown (lib/data/blog.ts). */
export function BlogPostBody({ html }: { html: string }) {
  return <div className={BODY_CLASSES} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function formatPostDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-DO" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
