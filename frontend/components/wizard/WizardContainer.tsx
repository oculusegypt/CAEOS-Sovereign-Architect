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
    titleAr: 