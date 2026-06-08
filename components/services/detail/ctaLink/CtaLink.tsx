import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

interface CtaLinkProps {
  label: string;
}

export function CtaLink({ label }: CtaLinkProps) {
  return (
    <div className="text-center">
      <Link
        href="/services"
        prefetch={false}
        className="group inline-flex items-center gap-2 bg-primary
          text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90
          transition-all hover-glow focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-ring"
      >
        <ArrowLeft className="size-4 shrink-0" />
        <span
          className="sm:max-w-0 sm:overflow-hidden sm:whitespace-nowrap
            sm:group-hover:max-w-xs transition-all duration-300"
        >
          {label}
        </span>
      </Link>
    </div>
  );
}
