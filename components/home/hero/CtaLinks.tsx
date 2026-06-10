import { Link } from "@/lib/i18n/navigation";
import { CalendarDays, ArrowRight } from "lucide-react";

interface CtaLinksProps {
  primaryLabel: string;
  secondaryLabel: string;
}

export function CtaLinks({ primaryLabel, secondaryLabel }: CtaLinksProps) {
  return (
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <Link
        href="/contact"
        prefetch={false}
        aria-label={primaryLabel}
        className="group flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm
            font-semibold text-primary-foreground shadow-sm hover:bgprimary/90 transition-all
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <CalendarDays className="h-4 w-4 shrink-0" />
        <span
          className="ml-2 sm:ml-0 sm:inline-block sm:max-w-0 sm:overflow-hidden sm:whitespace-nowrap sm:group-hover:max-w-xs sm:group-hover:ml-2 transition-all
                duration-300"
        >
          {primaryLabel}
        </span>
      </Link>

      <Link
        href="/services"
        prefetch={false}
        aria-label={secondaryLabel}
        className="group flex items-center justify-center text-sm font-semibold leading-6 text-foreground
      hover:text-primary transition-colors
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ArrowRight className="h-4 w-4 shrink-0" />
        <span
          className="ml-2 sm:ml-0 sm:inline-block sm:max-w-0 sm:overflow-hidden sm:whitespace-nowrap sm:group-hover:max-w-xs sm:group-hover:ml-2 transition-all
        duration-300"
        >
          {secondaryLabel}
        </span>
      </Link>
    </div>
  );
}
