import { SubtitleTyping } from "@/components/home/hero/SubtitleTyping";

interface ServiceHeroProps {
  title: string;
  subtitleStatic: string;
  subtitleDynamic: string;
}

export function ServiceHero({
  title,
  subtitleStatic,
  subtitleDynamic,
}: ServiceHeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-6">
      <div className="absolute inset-0 hero-glow -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
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
