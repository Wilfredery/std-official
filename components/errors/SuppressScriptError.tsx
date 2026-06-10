"use client";

import { useEffect } from "react";

const SCRIPT_ERROR_PATTERN =
  "Encountered a script tag while rendering React component";

export function SuppressScriptError() {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args: any[]) => {
      if (
        args.length > 0 &&
        typeof args[0] === "string" &&
        args[0].includes(SCRIPT_ERROR_PATTERN)
      ) {
        // Silenciar el warning específico de React 19 sobre <script>
        return;
      }

      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
