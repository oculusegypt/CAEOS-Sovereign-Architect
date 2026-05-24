"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Shield, Brain, GitBranch, Scale, ChevronRight } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Shield className="h-4 w-4 text-caeos-accent" />
            <span>v2.0 — Sovereign Architecture Governance</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            {t("hero.title")}
          </h1>
          <p className="mb-4 text-xl text-caeos-accent md:text-2xl">
            {t("hero.subtitle")}
          </p>
          <p className="mb-12 text-lg text-slate-300">
            {t("hero.description")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/wizard"
              className="group flex items-center gap-2 rounded-lg bg-caeos-primary px-8 py-4 font-semibold text-white transition-all hover:bg-blue-600"
            >
              {t("hero.cta_primary")}
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="https://github.com/oculusegypt/CAEOS-Sovereign-Architect"
              target="_blank"
              className="rounded-lg border border-white/20 px-8 py-4 font-semibold backdrop-blur-sm transition-all hover:bg-white/10"
            >
              {t("hero.cta_secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-caeos-accent" />}
            title="15 Sovereign Layers"
            description="Every decision flows through 15 governance pillars — no layer is optional."
            titleAr="15 طبقة سيادية"
            descriptionAr="كل قرار يمر عبر 15 ركيزة حوكمة — لا طبقة اختيارية."
          />
          <FeatureCard
            icon={<GitBranch className="h-8 w-8 text-caeos-success" />}
            title="22-Phase Pipeline"
            description="A complete lifecycle from intent to delivery with continuous auditing."
            titleAr="أنبوب 22 مرحلة"
            descriptionAr="دورة حياة كاملة من النية إلى التسليم مع تدقيق مستمر."
          />
          <FeatureCard
            icon={<Scale className="h-8 w-8 text-caeos-warning" />}
            title="20 Constitutional Laws"
            description="Binding laws that prevent architectural collapse and AI hallucinations."
            titleAr="20 قانون دستوري"
            descriptionAr="قوانين مُلزمة تمنع الانهيار المعماري والهلوسة البرمجية."
          />
        </div>
      </section>

      {/* Status Bar */}
      <footer className="border-t border-white/10 bg-slate-900/50 px-6 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-400">
            The system is not a prompt. The system is an OS.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-caeos-success animate-pulse-soft" />
              Constitution Active
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-caeos-accent animate-pulse-soft" />
              Knowledge Graph Connected
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  titleAr,
  descriptionAr,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  titleAr: string;
  descriptionAr: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-4 text-slate-300">{description}</p>
      <div className="border-t border-white/10 pt-4">
        <h4 className="mb-1 text-lg font-semibold text-caeos-accent">{titleAr}</h4>
        <p className="text-sm text-slate-400">{descriptionAr}</p>
      </div>
    </div>
  );
}
