import { Scale, Shield } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Link } from "wouter";

const laws = [
  { en: "No Code Before Reasoning", ar: "ممنوع كتابة كود قبل تحليل النوايا" },
  { en: "No Assumptions Without Confirmation", ar: "ممنوع الافتراض غير المؤكد" },
  { en: "Decision Before Execution", ar: "القرار قبل التنفيذ" },
  { en: "Never Rewrite Large Systems Unnecessarily", ar: "ممنوع إعادة الكتابة الكاملة بدون داعٍ" },
  { en: "Never Introduce Dependencies Without Justification", ar: "ممنوع Dependency بدون تبرير" },
  { en: "Never Optimize Prematurely", ar: "ممنوع التحسين المبكر" },
  { en: "Never Prioritize Appearance Over Resilience", ar: "ممنوع تقديم المظهر على المتانة" },
  { en: "Always Maintain Architectural Consistency", ar: "التوافق المعماري دائماً" },
  { en: "Always Preserve Business Logic Integrity", ar: "حماية Business Logic" },
  { en: "Human Approval Overrides All AI Decisions", ar: "السيادة البشرية فوق كل شيء" },
  { en: "Every Decision Must Enter the Knowledge Graph", ar: "كل قرار في Knowledge Graph" },
  { en: "Every Technology Must Pass Reality Validation", ar: "كل تقنية مُتحقق منها" },
  { en: "Every Conflict Must Be Arbitrated", ar: "كل تعارض يُحكم" },
  { en: "Every Task Must Follow the State Machine", ar: "كل مهمة تتبع State Machine" },
  { en: "Every Execution Must Be Observable", ar: "كل تنفيذ مراقب" },
  { en: "Every Agent Must Have a Trust Score", ar: "كل Agent له Trust Score" },
  { en: "Economic Cost Must Be Calculated Before Every Action", ar: "حساب التكلفة قبل كل عمل" },
  { en: "Human Cognitive Load Must Be Protected", ar: "حماية العقل البشري" },
  { en: "Complexity Must Justify Its Existence", ar: "التعقيد يكسب وجوده" },
  { en: "Recovery Must Be Possible Before Any Change", ar: "Recovery ممكن قبل أي تعديل" },
  { en: "Every Human Choice Must Be Conscious and Recorded", ar: "كل اختيار بشري واعي ومُسجل" },
];

export default function ConstitutionPage() {
  const { locale, dir } = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={dir}>
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <Scale className="h-16 w-16 text-[#f59e0b] mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            {locale === "ar" ? "الدستور" : "The CAEOS Constitution"}
          </h1>
          <p className="text-xl text-slate-300">
            {locale === "ar"
              ? "20 قانون دستوري يحكم كل قرار هندسي"
              : "20 Constitutional Laws governing every engineering decision"}
          </p>
        </div>

        <div className="grid gap-4">
          {laws.map((law, i) => (
            <div
              key={i}
              className="animate-slide-up rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 hover:bg-white/10 transition-all"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className={`flex items-start gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#0ea5e9] text-sm font-bold">
                  {i + 1}
                </span>
                <div className={`flex-1 ${dir === "rtl" ? "text-right" : ""}`}>
                  <p className="font-semibold text-white">{law.en}</p>
                  <p className="text-[#0ea5e9] text-sm mt-1" dir="rtl">{law.ar}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center border-t border-white/10 pt-8">
          <Shield className="h-8 w-8 text-[#0ea5e9] mx-auto mb-4" />
          <p className="text-slate-400 italic">
            {locale === "ar"
              ? "النظام ليس Prompt. النظام هو OS."
              : "The system is not a prompt. The system is an OS."}
          </p>
          <Link href="/" className="mt-4 inline-block text-[#0ea5e9] hover:text-white transition-colors text-sm">
            ← {locale === "ar" ? "العودة للرئيسية" : "Return to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
