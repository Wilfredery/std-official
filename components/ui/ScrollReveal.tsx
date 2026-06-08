"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { observeElement, unobserveElement } from "@/lib/observer";

type Direction = "up" | "down" | "left" | "right" | "scale";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

const directionClasses: Record<Direction, string> = {
  up: "opacity-0 translate-y-8",
  down: "opacity-0 -translate-y-8",
  left: "opacity-0 -translate-x-8",
  right: "opacity-0 -translate-x-8",
  scale: "opacity-0 scale-95",
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    observeElement(el, () => setIsVisible(true));

    return () => {
      unobserveElement(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-testid="scroll-reveal-wrapper"
      data-visible={isVisible ? "true" : "false"}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : directionClasses[direction]
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
