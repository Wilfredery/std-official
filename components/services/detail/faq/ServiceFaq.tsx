interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceFaqProps {
  title: string;
  items: FaqItem[];
}

export function ServiceFaq({ title, items }: ServiceFaqProps) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-12">
        {title}
      </h2>

      <div className="flex flex-col gap-6">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border bg-card gradient-border-card hover-glow"
          >
            <summary
              className="px-8 py-6 font-bold cursor-pointer list-none flex justify-between
              items-center text-lg focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-ring rounded-lg"
            >
              {item.question}
              <span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none">
                +
              </span>
            </summary>
            <p className="px-8 pb-6 text-base text-muted-foreground">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
