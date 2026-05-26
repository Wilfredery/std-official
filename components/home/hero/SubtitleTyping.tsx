"use client";

import { useState, useEffect } from "react";
import { useHydrated } from "@/hooks/useHydrated";

interface SubtitleTypingProps {
  staticText: string;
  dynamicText: string;
}

export function SubtitleTyping({
  staticText,
  dynamicText,
}: SubtitleTypingProps) {
  const hydrated = useHydrated();
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    let index = 0;

    const timer = setInterval(() => {
      if (index < dynamicText.length) {
        setDisplayed(dynamicText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [hydrated, dynamicText]);

  return (
    <p className="mt-6 text-lg leading-8 text-muted-foreground">
      {staticText}{" "}
      <span className="font-bold text-primary">
        {hydrated ? displayed : dynamicText}
        <span
          className={`${isComplete ? "opacity-0 transition-opacity duration-500" : "animate-pulse"}`}
          aria-hidden="true"
        >
          |
        </span>
      </span>
      <span className="sr-only">{dynamicText}</span>
    </p>
  );
}
