import { Shield, Brain, GitBranch, Scale, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useTranslations } from "@/lib/useTranslations";
import { Link } from "wouter";

const layers = [
  { id: "L1", name: "Intent Kernel", nameAr: "نواة النية", status: "active" },
  { id: "L2", name: "Deep Interrogator", nameAr: "المستجوب العميق", status: "active" },
  { id: "L3", name: "Decision Engine", nameAr: "محرك القرار", status: "active" },
  { id: "L4", name: "Constitution Core", nameAr: "نواة الدستور", status: "active" },
  { id: "L5", name: "Arbitration Kernel", nameAr: "نواة التحكيم", status: "idle" },
  { id: "L6", name: "Knowledge Graph", nameAr: "الرسم المعرفي", status: "active" },
  { id: "L7", name: "Reality Validator", nameAr: "مُتحقق الواقع", status: "active" },
  { id: "L8", name: "Governance Engine", nameAr: "محرك الحوكمة", status: "active" },
];

const recentDecisions = [
  { phase: "P2", decision: "Delivery Mode", choice: "Hybrid", status: "ratified" },
  { phase: "P2", decision: "Pilot Project", choice: "Meta-Build", status: "ratified" },
  { phase: "P2", decision: "Team Size", choice: "Solo Developer", status: "ratified" },
  { phase: "P3", decision: "Tech Stack", choice: "Next.js + Python", status: "pending" },
];

export default function DashboardPage() {
  const { locale, dir } = useLocale();
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={dir}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className={`flex items-center justify-between mb-10 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <p className="text-slate-400 text-sm">
              {locale === "ar" ? "حالة النظام في الوقت الفعلي" : "Real-time system status"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#10b981]">
            <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse-soft" />
            {locale === "ar" ? "النظام نشط" : "System Active"}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: <Shield className="h-5 w-5 text-[#0ea5e9]" />, value: "15", label: locale === "ar" ? "طبقة سيادية" : "Sovereign Layers" },
            { icon: <GitBranch className="h-5 w-5 text-[#10b981]" />, value: "22", label: locale === "ar" ? "مرحلة" : "Phases" },
            { icon: <Scale className="h-5 w-5 text-[#f59e0b]" />, value: "21", label: locale === "ar" ? "قانون دستوري" : "Constitutional Laws" },
            { icon: <Brain className="h-5 w-5 text-[#2563eb]" />, value: "8/8", label: locale === "ar" ? "طبقات نشطة" : "Layers Active" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 mb-3">{stat.icon}</div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Active Layers */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className={`text-lg font-semibold mb-4 ${dir === "rtl" ? "text-right" : ""}`}>
              {locale === "ar" ? "الطبقات السيادية" : "Sovereign Layers"}
            </h2>
            <div className="space-y-3">
              {layers.map((layer) => (
                <div key={layer.id} className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs text-[#0ea5e9] font-mono w-8">{layer.id}</span>
                    <span className="text-sm text-slate-300">
                      {locale === "ar" ? layer.nameAr : layer.name}
                    </span>
                  </div>
                  {layer.status === "active" ? (
                    <CheckCircle className="h-4 w-4 text-[#10b981]" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Decisions */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className={`text-lg font-semibold mb-4 ${dir === "rtl" ? "text-right" : ""}`}>
              {t("decision.title")}
            </h2>
            <div className="space-y-3">
              {recentDecisions.map((d, i) => (
                <div key={i} className={`flex items-start justify-between gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <div className={dir === "rtl" ? "text-right" : ""}>
                    <p className="text-xs text-[#0ea5e9] font-mono">{d.phase}</p>
                    <p className="text-sm text-slate-300">{d.decision}</p>
                    <p className="text-xs text-slate-500">{d.choice}</p>
                  </div>
                  <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
                    d.status === "ratified"
                      ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
                      : "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30"
                  }`}>
                    {d.status === "ratified" ? t("decision.ratified") : t("decision.pending")}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href="/wizard"
                className="text-sm text-[#0ea5e9] hover:text-white transition-colors"
              >
                {locale === "ar" ? "+ إضافة قرار جديد" : "+ Add new decision"} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
