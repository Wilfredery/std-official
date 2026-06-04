import { SubtitleTyping } from "@/components/home/hero/SubtitleTyping";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

interface ServiceHeroProps {
  title: string;
  subtitleStatic: string;
  subtitleDynamic: string;
  breadcrumbLabel: string;
}

export function ServiceHero({
  title,
  subtitleStatic,
  subtitleDynamic,
  breadcrumbLabel,
}: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-6">
      <div className="absolute inset-0 hero-glow -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <nav className="mb-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground
              hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              {breadcrumbLabel}
            </Link>
          </nav>

          <h1 className="mt-4 mb-6 text-4xl font-extrabold tracking-tight sm:text-7xl lg:text-6xl gradient-text">
            {title}
          </h1>

          <SubtitleTyping
            key={subtitleDynamic}
            staticText={subtitleStatic}
            dynamicText={subtitleDynamic}
          />
        </div>
      </div>
    </section>
  );
}
