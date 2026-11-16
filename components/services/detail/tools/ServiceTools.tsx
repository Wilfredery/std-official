import { Wrench } from "lucide-react";

interface ToolItem {
  name: string;
  description: string;
}

interface ServiceToolsProps {
  title: string;
  items: ToolItem[];
}

export function ServiceTools({ title, items }: ServiceToolsProps) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="rounded-xl border border-border bg-card gradient-border-card p-6"
          >
            <h3 className="flex items-center gap-2 font-semibold text-base mb-2">
              <Wrench
                className="size-4 text-primary shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
