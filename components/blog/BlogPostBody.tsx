import type { BlogBlock } from "@/lib/data/blog";

export function BlogPostBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-6 text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                {block.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-3 marker:text-primary">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={i}
                className="list-decimal pl-6 space-y-3 marker:font-semibold marker:text-primary"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}

export function formatPostDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-DO" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
