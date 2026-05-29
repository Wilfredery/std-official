import { CheckCircle2 } from "lucide-react";

interface ServiceDeliverablesProps {
  title: string;
  items: string[];
}

export function ServiceDeliverables({
  title,
  items,
}: ServiceDeliverablesProps) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="size-5 mt-0.5 text-primary shrink-0" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
