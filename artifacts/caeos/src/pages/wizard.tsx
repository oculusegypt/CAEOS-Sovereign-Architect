import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, Lightbulb } from "lucide-react";
import { useTranslations } from "@/lib/useTranslations";
import { useLocale } from "@/context/LocaleContext";
import { Link } from "wouter";

interface WizardStep {
  phase: string;
  phaseAr: string;
  question: string;
  questionAr: string;
  options: { label: string; labelAr: string; value: string }[];
  recommendation: string;
  recommendationAr: string;
  explanation: string;
  explanationAr: string;
}

const wizardSteps: WizardStep[] = [
  {
    phase: "P2 — Deep Interrogation",
    phaseAr: "P2 — الاستجواب العميق",
    question: "What is the primary delivery mode for this project?",
    questionAr: "ما هو وضع التسليم الأساسي لهذا المشروع؟",
    options: [
      { label: "Hybrid (Agent + Dashboard)", labelAr: "هجين (Agent + Dashboard)", value: "hybrid" },
      { label: "Fully Automated Agent", labelAr: "Agent مؤتمت بالكامل", value: "automated" },
      { label: "Human-in-the-Loop", labelAr: "إنسان في الحلقة", value: "human" },
    ],
    recommendation: "Hybrid (Agent + Dashboard)",
    recommendationAr: "هجين (Agent + Dashboard)",
    explanation: "Hybrid mode balances AI power with human oversight — the most resilient architecture.",
    explanationAr: "الوضع الهجين يوازن بين قوة الذكاء الاصطناعي والرقابة البشرية — الأكثر مرونة.",
  },
  {
    phase: "P2 — Team Structure",
    phaseAr: "P2 — هيكل الفريق",
    question: "What is the team size for this project?",
    questionAr: "ما حجم الفريق لهذا المشروع؟",
    options: [
      { label: "Solo Developer", labelAr: "مطور منفرد", value: "solo" },
      { label: "Small Team (2-5)", labelAr: "فريق صغير (2-5)", value: "small" },
      { label: "Large Team (6+)", labelAr: "فريق كبير (6+)", value: "large" },
    ],
    recommendation: "Solo Developer",
    recommendationAr: "مطور منفرد",
    explanation: "Solo execution maximizes speed and minimizes coordination overhead for initial builds.",
    explanationAr: "التنفيذ المنفرد يزيد السرعة ويقلل تكاليف التنسيق في الإصدارات الأولى.",
  },
  {
    phase: "P3 — Technical Blueprint",
    phaseAr: "P3 — المخطط التقني",
    question: "Which technology stack best fits your requirements?",
    questionAr: "أي مكدس تقني يناسب متطلباتك؟",
    options: [
      { label: "Next.js + Python + PostgreSQL", labelAr: "Next.js + Python + PostgreSQL", value: "nextpy" },
      { label: "React + Node + PostgreSQL", labelAr: "React + Node + PostgreSQL", value: "reactnode" },
      { label: "Vue + FastAPI + MongoDB", labelAr: "Vue + FastAPI + MongoDB", value: "vuefastapi" },
    ],
    recommendation: "Next.js + Python + PostgreSQL",
    recommendationAr: "Next.js + Python + PostgreSQL",
    explanation: "Python-native stack is optimal for AI workloads with structured relational data.",
    explanationAr: "المكدس المبني على Python هو الأمثل لأعباء الذكاء الاصطناعي مع البيانات العلائقية.",
  },
  {
    phase: "P5 — Language Strategy",
    phaseAr: "P5 — استراتيجية اللغة",
    question: "What language strategy will you adopt?",
    questionAr: "ما استراتيجية اللغة التي ستتبنى؟",
    options: [
      { label: "Bilingual (Arabic + English)", labelAr: "ثنائي (عربي + إنجليزي)", value: "bilingual" },
      { label: "English Only", labelAr: "إنجليزية فقط", value: "en_only" },
      { label: "Arabic Only", labelAr: "عربية فقط", value: "ar_only" },
    ],
    recommendation: "Bilingual (Arabic + English)",
    recommendationAr: "ثنائي (عربي + إنجليزي)",
    explanation: "Bilingual strategy maximizes reach: Arabic UX for the local audience, English for global GitHub.",
    explanationAr: "الاستراتيجية الثنائية تزيد الانتشار: تجربة عربية للجمهور المحلي وإنجليزية لـ GitHub.",
  },
];

export default function WizardPage() {
  const t = useTranslations();
  const { locale, dir } = useLocale();
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = wizardSteps[step];
  const progress = ((step + (completed ? 1 : 0)) / wizardSteps.length) * 100;

  function selectOption(value: string) {
    setChoices((prev) => ({ ...prev, [step]: value }));
  }

  function next() {
    if (step < wizardSteps.length - 1) {
      setStep(step + 1);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  }

  function back() {
    if (step > 0) {
      setStep(step - 1);
      setShowExplanation(false);
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto max-w-2xl px-6 py-24">
          <div className="text-center mb-12 animate-fade-in">
            <CheckCircle className="h-16 w-16 text-[#10b981] mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              {locale === "ar" ? t("wizard.summary_title") : t("wizard.summary_title")}
            </h1>
            <p className="text-slate-300">
              {locale === "ar" ? t("wizard.summary_description") : t("wizard.summary_description")}
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {wizardSteps.map((s, i) => {
              const chosenValue = choices[i] ?? s.options[0].value;
              const chosenOption = s.options.find(o => o.value === chosenValue) ?? s.options[0];
              return (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs text-[#0ea5e9] font-mono mb-2">
                    {locale === "ar" ? s.phaseAr : s.phase}
                  </p>
                  <p className="text-sm text-slate-400 mb-2">
                    {locale === "ar" ? s.questionAr : s.question}
                  </p>
                  <p className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#10b981]" />
                    {locale === "ar" ? chosenOption.labelAr : chosenOption.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setCompleted(false); setStep(0); setChoices({}); }}
              className="rounded-lg bg-[#2563eb] px-8 py-4 font-semibold text-white transition-all hover:bg-blue-600"
            >
              {t("wizard.modify")}
            </button>
            <Link href="/" className="text-center text-slate-400 hover:text-white transition-colors">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={dir}>
      <div className="container mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            {locale === "ar" ? t("wizard.title") : t("wizard.title")}
          </h1>
          <p className="text-slate-400">
            {locale === "ar" ? t("wizard.subtitle") : t("wizard.subtitle")}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>{t("wizard.progress")}</span>
            <span>{t("wizard.question_counter", { current: step + 1, total: wizardSteps.length })}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#2563eb] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 mb-6 animate-slide-up">
          <p className="text-xs text-[#0ea5e9] font-mono mb-4">
            {locale === "ar" ? current.phaseAr : current.phase}
          </p>
          <h2 className="text-xl font-semibold mb-6">
            {locale === "ar" ? current.questionAr : current.question}
          </h2>

          {/* Recommendation */}
          <div className="mb-6 rounded-lg bg-[#2563eb]/10 border border-[#2563eb]/20 px-4 py-3">
            <p className="text-xs text-[#0ea5e9] mb-1">{t("wizard.recommendation")}</p>
            <p className="text-sm font-medium text-white">
              {locale === "ar" ? current.recommendationAr : current.recommendation}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {current.options.map((option) => {
              const isSelected = choices[step] === option.value;
              const isRecommended = option.label === current.recommendation;
              return (
                <button
                  key={option.value}
                  onClick={() => selectOption(option.value)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[#2563eb] bg-[#2563eb]/20 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{locale === "ar" ? option.labelAr : option.label}</span>
                    {isRecommended && (
                      <span className="text-xs text-[#10b981] border border-[#10b981]/30 rounded px-2 py-0.5">
                        ✓ {locale === "ar" ? "موصى به" : "Recommended"}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation toggle */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2 text-sm text-[#0ea5e9] hover:text-white transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            {t("wizard.explain")}
          </button>

          {showExplanation && (
            <div className="mt-4 rounded-lg bg-white/5 border border-white/10 p-4 text-sm text-slate-300 animate-fade-in">
              {locale === "ar" ? current.explanationAr : current.explanation}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            {t("wizard.back")}
          </button>

          <button
            onClick={next}
            className="flex items-center gap-2 rounded-lg bg-[#2563eb] px-8 py-3 font-semibold text-white transition-all hover:bg-blue-600"
          >
            {step === wizardSteps.length - 1 ? t("wizard.confirm") : locale === "ar" ? "التالي" : "Next"}
            <ChevronRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
