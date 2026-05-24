/**
 * CAEOS Root Layout | التخطيط الجذري
 *
 * Supports RTL (Arabic) and LTR (English) via next-intl.
 */

import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { localeDirection, type Locale } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "CAEOS — Constitutional AI Engineering OS",
  description:
    "A governance kernel that transforms human intent into production-grade software architectures.",
  keywords: [
    "AI Engineering",
    "Constitutional AI",
    "Architecture Governance",
    "CAEOS",
    "Sovereign Architect",
  ],
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages();
  const dir = localeDirection[locale];

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
