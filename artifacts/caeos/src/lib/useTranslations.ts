import { useLocale } from "@/context/LocaleContext";
import enMessages from "./messages/en.json";
import arMessages from "./messages/ar.json";
import type { Locale } from "./i18n";

type Messages = Record<string, Record<string, string>>;

const allMessages: Record<Locale, Messages> = {
  en: enMessages as unknown as Messages,
  ar: arMessages as unknown as Messages,
};

export function useTranslations() {
  const { locale } = useLocale();
  const messages = allMessages[locale];

  return function t(key: string, params?: Record<string, string | number>): string {
    const parts = key.split(".");
    let value: unknown = messages;
    for (const part of parts) {
      if (value && typeof value === "object") {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    if (typeof value !== "string") return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    }
    return value;
  };
}
