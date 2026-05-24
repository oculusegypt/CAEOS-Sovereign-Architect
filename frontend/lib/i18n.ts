/**
 * CAEOS i18n Configuration | إعدادات التدويل
 *
 * next-intl setup with Arabic (RTL) + English (LTR) support.
 */

import { getRequestConfig } from "next-intl/server";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  ar: "rtl",
  en: "ltr",
};

export default getRequestConfig(async ({ locale }) => {
  const messages = (await import(`../messages/${locale}.json`)).default;
  return {
    messages,
    timeZone: "Africa/Cairo",
    now: new Date(),
  };
});
