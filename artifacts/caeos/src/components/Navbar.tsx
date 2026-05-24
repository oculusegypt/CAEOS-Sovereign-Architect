import { Shield, Globe } from "lucide-react";
import { Link } from "wouter";
import { useLocale } from "@/context/LocaleContext";
import { useTranslations } from "@/lib/useTranslations";
import type { Locale } from "@/lib/i18n";
import { locales, localeNames } from "@/lib/i18n";

export default function Navbar() {
  const { locale, setLocale, dir } = useLocale();
  const t = useTranslations();

  const otherLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Shield className="h-6 w-6 text-[#0ea5e9]" />
          <span className="text-lg">CAEOS</span>
        </Link>

        <div className={`hidden md:flex items-center gap-6 text-sm text-slate-300 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <Link href="/dashboard" className="hover:text-white transition-colors">{t("nav.dashboard")}</Link>
          <Link href="/wizard" className="hover:text-white transition-colors">{t("nav.wizard")}</Link>
          <Link href="/constitution" className="hover:text-white transition-colors">{t("nav.constitution")}</Link>
        </div>

        <button
          onClick={() => setLocale(otherLocale)}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          title={t("nav.language")}
        >
          <Globe className="h-4 w-4" />
          <span>{localeNames[otherLocale]}</span>
        </button>
      </div>
    </nav>
  );
}
