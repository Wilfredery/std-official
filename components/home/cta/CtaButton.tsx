"use client";

import { Link } from "@/lib/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface CtaButtonProps {
  label: string;
}

export function CtaButton({ label }: CtaButtonProps) {
  return (
    <Link
      href="/contact"
      className="group inline-flex items-center gap-2 bg-primary
        text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90
        transition-all hover-glow focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-ring"
    >
      <ArrowRight className="size-4 shrink-0" />
      <span
        className="sm:max-w-0 sm:overflow-hidden sm:whitespace-nowrap
      sm:group-hover:max-w-xs transition-all duration-300"
      >
        {label}
      </span>
    </Link>
  );
}
