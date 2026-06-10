"use client";

import { useEffect } from "react";
import { createWebVitalsScript } from "@/lib/web-vitals";

export function WebVitalsScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = createWebVitalsScript();
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
