"use client";

import { Link } from "@/lib/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { services } from "@/lib/data/services";

interface ServiceCardProps {
  title: string;
  shortDescription: string;
  learnMoreLabel: string;
  index: number;
  slug: string;
  accent: "primary" | "accent";
}

export function ServiceCard({
  title,
  shortDescription,
  learnMoreLabel,
  index,
  slug,
  accent,
}: ServiceCardProps) {
  const service = services.find((s) => s.slug === slug);
  if (!service) return null;

  const Icon = service.icon;
  const accentClass =
    accent === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-accent/10 text-accent";

  return (
    <Link
      href={`/services/${slug}` as `/services/${string}`}
      className="group gradient-border-card hover-glow flex flex-col p-6 rounded-2xl transition-all
        duration-300 animate-[fadeInUp_0.6s_ease-out_forwards] h-60"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={`size-10 rounded-lg grid place-items-center mb-4 ${accentClass}`}
      >
        <Icon className="size-5" />
      </div>

      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
        {shortDescription}
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        <ChevronRight className="size-3.5 shrink" />
        <span
          className="sm:max-w-0 sm:overflow-hidden sm:whitespace-nowrap sm:group-hover:max-w-xs
        transition-all duration-300"
        >
          {learnMoreLabel}
        </span>
      </span>
    </Link>
  );
}
