"use client";

import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import QuestionCard from "./QuestionCard";
import SummaryScreen from "./SummaryScreen";
import { CheckCircle, Loader2 } from "lucide-react";

interface WizardAnswer {
  questionId: string;
  choice: string;
  customText?: string;
  confirmed: boolean;
}

interface WizardState {
  currentQuestionIndex: number;
  answers: WizardAnswer[];
  showSummary: boolean;
  isSubmitting: boolean;
  showExplain: boolean;
}

// Mock questions for Phase 2 — Deep Interrogation
const MOCK_QUESTIONS = [
  {
    id: "L2-Q1",
    phase: "P2",
    layer: "L2",
    title: "Delivery Mode — How should CAEOS be delivered?",
    titleAr: "نمط التسليم — كيف يجب تسليم CAEOS؟",
    context: "CAEOS is a governance philosophy. How do you want it represented digitally?",
    contextAr: "CAEOS هو فلسفة حوكمة. كيف تريد تمثيلها رقمياً؟",
    impact: "This determines the user experience and deployment complexity.",
    impactAr: "هذا يحدد تجربة المستخدم وتعقيد النشر.",
    options: [
      {
        label: "LangSmith Fleet Agent only",
        labelAr: "Agent فقط",
        value: "A",
        consequence: "Fastest activation, less UI flexibility",
        consequenceAr: "أسرع تفعيل، أقل مرونة واجهة",
        isRecommended: false,
      },
      {
        label: "Web Application (React/Next.js)",
        labelAr: "تطبيق ويب",
        value: "B",
        consequence: "Highest UI flexibility, needs hosting",
        consequenceAr: "أعلى مرونة UI، يحتاج hosting",
        isRecommended: false,
      },
      {
        label: "⭐ Hybrid: Fleet Agent + Google Dashboard",
        labelAr: "⭐ Hybrid: Agent + Dashboard",
        value: "C",
        consequence: "Balance between AI power and familiar UI",
        consequenceAr: "توازن بين ذكاء AI وواجهة مألوفة",
        isRecommended: true,
      },
      {
        label: "Documentation Only",
        labelAr: "وثائق فقط",
        value: "D",
        consequence: "Fastest start, no execution",
        consequenceAr: "أسرع بداية، بدون تنفيذ",
        isRecommended: false,
      },
    ],
    questionNumber: 1,
    totalQuestions: 5,
    progressPercentage: 20,
  },
  {
    id: "L2-Q2",
    phase: "P2",
    layer: "L2",
    title: "Pilot Project — What project should CAEOS govern first?",
    titleAr: "المشروع الأول — أي مشروع يجب أن يحكم CAEOS أولاً؟",
    context: "CAEOS is a framework. It needs a real project to be applied to.",
    contextAr: "CAEOS هو إطار عمل. يحتاج مشروعاً حقيقياً.",
    impact: "This determines the real-world validation of the system.",
    impactAr: "هذا يحدد التحقق الواقعي للنظام.",
    options: [
      {
        label: "General Template (no specific project)",
        labelAr: "Template عام",
        value: "A",
        consequence: "Flexible but no real-world test",
        consequenceAr: "مرن لكن بدون اختبار واقعي",
        isRecommended: false,
      },
      {
        label: "⭐ Meta-Build (CAEOS governs itself)",
        labelAr: "⭐ Meta-Build (CAEOS يبني نفسه)",
        value: "B",
        consequence: "Strongest real-world test + produces GitHub repo",
        consequenceAr: "أقوى اختبار + يُنتج GitHub Repo",
        isRecommended: true,
      },
      {
        label: "Small test project (e.g., To-Do App)",
        labelAr: "مشروع صغير للاختبار",
        value: "C",
        consequence: "Quick test before a larger project",
        consequenceAr: "اختبار سريع قبل مشروع أكبر",
        isRecommended: false,
      },
      {
        label: "Real project (specify name)",
        labelAr: "مشروع حقيقي",
        value: "D",
        consequence: "Direct value but adds complexity",
        consequenceAr: "قيمة مباشرة لكن يضيف تعقيداً",
        isRecommended: false,
      },
    ],
    questionNumber: 2,
    totalQuestions: 5,
    progressPercentage: 40,
  },
  {
    id: "L2-Q3",
    phase: "P2",
    layer: "L2",
    title: "Team Size & Resources",
    titleAr: "حجم الفريق والموارد",
    context: "Your team composition determines architecture complexity.",
    contextAr: "تكوين فريقك يحدد تعقيد المعمارية.",
    impact: "Solo = simpler stack. Enterprise = stricter governance.",
    impactAr: "فرد = مكدس أبسط. Enterprise = حوكمة أشد.",
    options: [
      {
        label: "⭐ Solo Developer (you alone)",
        labelAr: "⭐ Solo Developer (أنت وحدك)",
        value: "A",
        consequence: "Fastest execution, lowest token cost",
        consequenceAr: "أسرع تنفيذ، أقل تكلفة توكنز",
        isRecommended: true,
      },
      {
        label: "Small Team (2-5 people)",
        labelAr: "فريق صغير",
        value: "B",
        consequence: "Needs team conventions",
        consequenceAr: "يحتاج اتفاقيات فريق",
        isRecommended: false,
      },
      {
        label: "Medium Team (6-15 people)",
        labelAr: "فريق متوسط",
        value: "C",
        consequence: "Needs CI/CD + strict linting",
        consequenceAr: "يحتاج CI/CD + linting صارم",
        isRecommended: false,
      },
      {
        label: "Enterprise (15+ people)",
        labelAr: "Enterprise",
        value: "D",
        consequence: "Needs microservices + compliance",
        consequenceAr: "يحتاج microservices + compliance",
        isRecommended: false,
      },
    ],
    questionNumber: 3,
    totalQuestions: 5,
    progressPercentage: 60,
  },
  {
    id: "L2-Q4",
    phase: "P2",
    layer: "L2",
    title: "Tech Stack Preference",
    titleAr: "المكدس التقني المفضل",
    context: "Your technology preferences guide the architecture advisor.",
    contextAr: "تفضيلاتك التقنية توجه مستشار المعمارية.",
    impact: "This determines the development velocity and maintenance burden.",
    impactAr: "هذا يحدد سرعة التطوير وعبء الصيانة.",
    options: [
      {
        label: "Next.js + Node.js + PostgreSQL",
        labelAr: "Next.js + Node.js + PostgreSQL",
        value: "A",
        consequence: "Full JS stack, easier to find devs",
        consequenceAr: "مكدس JS كامل، أسهل إيجاد مطورين",
        isRecommended: false,
      },
      {
        label: "⭐ Next.js + Python FastAPI + PostgreSQL",
        labelAr: "⭐ Next.js + Python + PostgreSQL",
        value: "B",
        consequence: "Python-native for AI, Next.js modern frontend",
        consequenceAr: "Python-native للـ AI، Next.js حديث",
        isRecommended: true,
      },
      {
        label: "React + NestJS + MongoDB",
        labelAr: "React + NestJS + MongoDB",
        value: "C",
        consequence: "Flexible schema, harder to scale relations",
        consequenceAr: "مخطط مرن، أصعب توسع العلاقات",
        isRecommended: false,
      },
      {
        label: "API/CLI only (no frontend)",
        labelAr: "API/CLI فقط",
        value: "D",
        consequence: "Fastest backend, no UI overhead",
        consequenceAr: "أسرع backend، بدون UI",
        isRecommended: false,
      },
    ],
    questionNumber: 4,
    totalQuestions: 5,
    progressPercentage: 80,
  },
  {
    id: "L2-Q5",
    phase: "P2",
    layer: "L2",
    title: "Language & Localization",
    titleAr: "اللغة والتدويل",
    context: "The primary language determines UI direction (RTL/LTR) and documentation.",
    contextAr: "اللغة الرئيسية تحدد اتجاه UI (RTL/LTR) والتوثيق.",
    impact: "Arabic = RTL UI. English = LTR. Bilingual = both.",
    impactAr: "عربي = RTL. English = LTR. Bilingual = كلاهما.",
    options: [
      {
        label: "Arabic only",
        labelAr: "العربية فقط",
        value: "A",
        consequence: "RTL UI, Arabic docs, harder for international devs",
        consequenceAr: "RTL UI، وثائق عربية، أصعب للمطورين الدوليين",
        isRecommended: false,
      },
      {
        label: "⭐ Bilingual (Arabic + English)",
        labelAr: "⭐ ثنائي اللغة (عربي + English)",
        value: "B",
        consequence: "Arabic UX + English GitHub/docs, wider reach",
        consequenceAr: "UX عربي + GitHub/docs English، انتشار أوسع",
        isRecommended: true,
      },
      {
        label: "English only",
        labelAr: "English فقط",
        value: "C",
        consequence: "Easier for GitHub/Documentation, loses Arabic identity",
        consequenceAr: "أسهل GitHub/Documentation، يفقد هوية عربية",
        isRecommended: false,
      },
      {
        label: "Arabic UI + English Code + English Docs",
        labelAr: "UI عربي + Code English + Docs English",
        value: "D",
        consequence: "Clear separation: Arabic for users, English for devs",
        consequenceAr: "فصل واضح: عربي للمستخدمين، English للمطورين",
        isRecommended: false,
      },
    ],
    questionNumber: 5,
    totalQuestions: 5,
    progressPercentage: 100,
  },
];

export default function WizardContainer() {
  const t = useTranslations("wizard");
  const [state, setState] = useState<WizardState>({
    currentQuestionIndex: 0,
    answers: [],
    showSummary: false,
    isSubmitting: false,
    showExplain: false,
  });

  const currentQuestion = MOCK_QUESTIONS[state.currentQuestionIndex];
  const currentAnswer = state.answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  const handleSelect = useCallback((value: string) => {
    setState((prev) => {
      const newAnswers = prev.answers.filter(
        (a) => a.questionId !== currentQuestion.id
      );
      newAnswers.push({
        questionId: currentQuestion.id,
        choice: value,
        confirmed: true,
      });

      // Auto-advance after 500ms
      const nextIndex = prev.currentQuestionIndex + 1;
      const showSummary = nextIndex >= MOCK_QUESTIONS.length;

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: showSummary ? prev.currentQuestionIndex : nextIndex,
        showSummary,
      };
    });
  }, [currentQuestion]);

  const handleCustom = useCallback((text: string) => {
    setState((prev) => {
      const newAnswers = prev.answers.filter(
        (a) => a.questionId !== currentQuestion.id
      );
      newAnswers.push({
        questionId: currentQuestion.id,
        choice: "CUSTOM",
        customText: text,
        confirmed: true,
      });

      const nextIndex = prev.currentQuestionIndex + 1;
      const showSummary = nextIndex >= MOCK_QUESTIONS.length;

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: showSummary ? prev.currentQuestionIndex : nextIndex,
        showSummary,
      };
    });
  }, [currentQuestion]);

  const handleBack = useCallback(() => {
    setState((prev) => {
      if (prev.showSummary) {
        return { ...prev, showSummary: false };
      }
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      }
      return prev;
    });
  }, []);

  const handleExplain = useCallback(() => {
    setState((prev) => ({ ...prev, showExplain: !prev.showExplain }));
  }, []);

  const handleModify = useCallback((questionIndex: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: questionIndex,
      showSummary: false,
    }));
  }, []);

  const handleRatify = useCallback(async () => {
    setState((prev) => ({ ...prev, isSubmitting: true }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production: POST /api/v1/wizard/ratify/{project_id}
    console.log("Ratified decisions:", state.answers);

    setState((prev) => ({ ...prev, isSubmitting: false }));
    // Redirect to dashboard or next phase
  }, [state.answers]);

  // Build summary data
  const summaryAnswers = state.answers.map((answer) => {
    const question = MOCK_QUESTIONS.find((q) => q.id === answer.questionId);
    const option = question?.options.find((o) => o.value === answer.choice);
    return {
      questionId: answer.questionId,
      questionTitle: question?.title || "Unknown",
      questionTitleAr: question?.titleAr,
      choice: answer.choice,
      choiceLabel: option?.label || answer.customText || "Custom",
      choiceLabelAr: option?.labelAr,
      isRecommended: option?.isRecommended || false,
      consequence: option?.consequence || "Custom choice",
    };
  });

  if (!currentQuestion && !state.showSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <CheckCircle className="h-16 w-16 text-caeos-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            All questions answered!
          </h2>
          <button
            onClick={() => setState((prev) => ({ ...prev, showSummary: true }))}
            className="px-6 py-3 bg-caeos-primary text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            View Summary
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {state.showSummary ? (
            <SummaryScreen
              key="summary"
              answers={summaryAnswers}
              onRatify={handleRatify}
              onModify={handleModify}
              onBack={handleBack}
              isSubmitting={state.isSubmitting}
            />
          ) : (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selectedChoice={currentAnswer?.choice || null}
              onSelect={handleSelect}
              onBack={handleBack}
              onExplain={handleExplain}
              onCustom={handleCustom}
              showExplain={state.showExplain}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
