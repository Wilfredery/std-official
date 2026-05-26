import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { ReactElement, ReactNode } from "react";
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

const allMessages = { en: enMessages, es: esMessages };

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: "en" | "es";
}

function Providers({
  children,
  locale = "en",
}: {
  children: ReactNode;
  locale?: "en" | "es";
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={allMessages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
}

export function render(ui: ReactElement, options?: CustomRenderOptions) {
  const { locale, ...rest } = options ?? {};
  return rtlRender(ui, {
    wrapper: ({ children }) => <Providers locale={locale}>{children}</Providers>,
    ...rest,
  });
}

export function createMockTranslator(
  namespace: string,
  messages: Record<string, unknown> = enMessages
) {
  const keys = namespace.split(".");
  let obj: unknown = messages;
  for (const key of keys) {
    if (obj === null || obj === undefined) return () => namespace;
    obj = (obj as Record<string, unknown>)[key];
  }

  return (key: string) => {
    const parts = key.split(".");
    let result: unknown = obj;
    for (const part of parts) {
      if (result === null || result === undefined) return key;
      result = (result as Record<string, unknown>)[part];
    }
    return typeof result === "string" ? result : key;
  };
}

export * from "@testing-library/react";
