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
        prefetch={false}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground
            hover:text-foreground transition-colors pl-10 md:pl-60 pt-2"
      >
        <ArrowLeft className="size-4" />
        {label}
      </Link>
    </nav>
  );
}
