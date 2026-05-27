"use client";

import { services } from "@/lib/data/services";
import { ServiceCard } from "./ServiceCard";

interface ServicesSliderProps {
  titles: Record<string, string>;
  shortDescriptions: Record<string, string>;
  learnMoreLabel: string;
}

export function ServicesSlider({
  titles,
  shortDescriptions,
  learnMoreLabel,
}: ServicesSliderProps) {
  return (
    <div className="slider-container relative overflow-hidden">
      <div
        className="slider-track flex gap-8 w-max animate-[scroll_30s_linear_infinite]
            hover:[animation-play-state:paused]"
      >
        {[...services, ...services].map((service, i) => (
          <div
            key={`${service.slug}-${i}`}
            className="w-[320px] h-full shrink-0"
          >
            <ServiceCard
              slug={service.slug}
              accent={service.accent}
              title={titles[service.slug]}
              shortDescription={shortDescriptions[service.slug]}
              learnMoreLabel={learnMoreLabel}
              index={i % services.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
