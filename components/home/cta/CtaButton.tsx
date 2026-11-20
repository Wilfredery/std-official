import { Link } from "@/lib/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface CtaButtonProps {
  label: string;
}

export function CtaButton({ label }: CtaButtonProps) {
  return (
    <Link
      href="/contact"
      prefetch={false}
      aria-label={label}
      className="group inline-flex items-center justify-center bg-primary
        text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90
        transition-all hover-glow focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-ring"
    >
      <ArrowRight className="size-4 shrink-0" />
      <span className="ml-2">
        {label}
      </span>
    </Link>
  );
}
