import React, { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, localeDirection } from "@/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "rtl" | "ltr";
}

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  dir: localeDirection[defaultLocale],
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem("caeos-locale");
    if (stored === "ar" || stored === "en") return stored;
    return defaultLocale;
  });

  const dir = localeDirection[locale];

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("caeos-locale", l);
  }

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
