"use client";

import { useState, useEffect } from "react";

interface SubtitleTypingProps {
  staticText: string;
  dynamicText: string;
}

export function SubtitleTyping({
  staticText,
  dynamicText,
}: SubtitleTypingProps) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
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
  }, [dynamicText]);

  return (
    <p className="mt-6 text-lg leading-8 text-muted-foreground">
      {staticText}{" "}
      <span className="font-bold text-primary">
        {displayed}
        <span
          className={`${isComplete ? "opacity-0 transition-opacity duration-500" : "animate-pulse"}`}
          aria-hidden="true"
        >
          |
        </span>
        {/* The server HTML matches the first typing frame, and the
            not-yet-typed text keeps its space while invisible, so line
            wrapping and the hero's height never change — no layout shift.
            Crawlers and screen readers get the full text from the sr-only span. */}
        {displayed.length < dynamicText.length && (
          <span className="invisible" aria-hidden="true">
            {dynamicText.slice(displayed.length)}
          </span>
        )}
      </span>
      <span className="sr-only">{dynamicText}</span>
    </p>
  );
}
