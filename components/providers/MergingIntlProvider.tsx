"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface MergingIntlProviderProps {
  /** Page-specific messages. Nested NextIntlClientProvider auto-merges
   *  these with the parent provider's messages (from the layout). */
  extra: Record<string, unknown>;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Wraps children in a nested NextIntlClientProvider with page-specific
// namespace messages. The inner provider extends the outer (layout)
// provider — no manual deep-merge needed (next-intl handles this).
// ---------------------------------------------------------------------------
export function MergingIntlProvider({
  extra,
  children,
}: MergingIntlProviderProps) {
  return (
    <NextIntlClientProvider messages={extra}>
      {children}
    </NextIntlClientProvider>
  );
}
