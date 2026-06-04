"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/web-vitals";

/**
 * Client component that triggers Core Web Vitals monitoring on mount.
 * Renders no visible DOM — only calls reportWebVitals() as a side effect.
 */
export default function WebVitals(): null {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return null;
}
