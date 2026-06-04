import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

interface ServiceBreadcrumbProps {
  label: string;
}

export function ServiceBreadcrumb({ label }: ServiceBreadcrumbProps) {
  return (
    <nav className="mb-4">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground
            hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        {label}
      </Link>
    </nav>
  );
}
