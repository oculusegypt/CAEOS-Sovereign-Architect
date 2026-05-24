"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronLeft, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface QuestionOption {
  label: string;
  labelAr?: string;
  value: string;
  consequence: string;
  consequenceAr?: string;
  isRecommended: boolean;
}

interface WizardQuestion {
  id: string;
  phase: string;
  layer: string;
  title: string;
  titleAr?: string;
  context: string;
  contextAr?: string;
  impact: string;
  impactAr?: string;
  options: QuestionOption[];
  questionNumber: number;
  totalQuestions: number;
  progressPercentage: number;
}

interface QuestionCardProps {
  question: WizardQuestion;
  selectedChoice: string | null;
  onSelect: (value: string) => void;
  onBack: () => void;
  onExplain: () => void;
  onCustom: (text: string) => void;
  showExplain: boolean;
}

export default function QuestionCard({
  question,
  selectedChoice,
  onSelect,
  onBack,
  onExplain,
  onCustom,
  showExplain,
}: QuestionCardProps) {
  const t = useTranslations("wizard");
  const [customText, setCustomText] = React.useState("");
  const [showCustom, setShowCustom] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-caeos-primary">
            {t("question_counter", {
              current: question.questionNumber,
              total: question.totalQuestions,
            })}
          </span>
          <span className="text-xs text-caeos-muted bg-slate-100 px-2 py-1 rounded">
            {question.phase} · {question.layer}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-caeos-primary to-caeos-accent"
            initial={{ width: 0 }}
            animate={{ width: `${question.progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {question.title}
        </h2>
        {question.titleAr && (
          <h3 className="text-xl font-semibold text-caeos-primary mb-4" dir="rtl">
            {question.titleAr}
          </h3>
        )}

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <p className="text-slate-700 text-sm mb-1">
            <span className="font-semibold">Context:</span> {question.context}
          </p>
          {question.contextAr && (
            <p className="text-slate-600 text-sm" dir="rtl">
              {question.contextAr}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-caeos-warning mb-4">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Impact:</span> {question.impact}
          {question.impactAr && (
            <span dir="rtl" className="mr-1">· {question.impactAr}</span>
          )}
        </div>

        {/* Explain Toggle */}
        <button
          onClick={onExplain}
          className="flex items-center gap-1 text-sm text-caeos-primary hover:underline mb-4"
        >
          <HelpCircle className="h-4 w-4" />
          {t("explain")}
        </button>

        {showExplain && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-slate-700"
          >
            <p className="font-semibold text-caeos-primary mb-1">Why this matters:</p>
            <p>This question helps CAEOS determine the most appropriate architecture for your project. Each choice has long-term implications on scalability, maintainability, and cost.</p>
          </motion.div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(option.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedChoice === option.value
                ? "border-caeos-primary bg-blue-50 shadow-md"
                : "border-slate-200 bg-white hover:border-caeos-accent hover:shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${
                  selectedChoice === option.value
                    ? "border-caeos-primary bg-caeos-primary"
                    : "border-slate-300"
                }`}
              >
                {selectedChoice === option.value && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {option.label}
                  </span>
                  {option.isRecommended && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      ⭐ {t("recommendation")}
                    </span>
                  )}
                </div>
                {option.labelAr && (
                  <p className="text-sm text-caeos-primary mt-0.5" dir="rtl">
                    {option.labelAr}
                  </p>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  → {option.consequence}
                </p>
                {option.consequenceAr && (
                  <p className="text-xs text-slate-400 mt-0.5" dir="rtl">
                    {option.consequenceAr}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        ))}

        {/* Custom Option */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="w-full text-left p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-caeos-accent transition-all"
        >
          <span className="text-slate-500 font-medium">{t("custom")}...</span>
        </button>

        {showCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="bg-white rounded-xl border border-slate-200 p-4"
          >
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Describe your custom choice..."
              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-caeos-primary"
              rows={3}
            />
            <button
              onClick={() => {
                if (customText.trim()) {
                  onCustom(customText);
                  setShowCustom(false);
                  setCustomText("");
                }
              }}
              className="mt-2 px-4 py-2 bg-caeos-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Confirm Custom Choice
            </button>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          {t("back")}
        </button>
        <span className="text-sm text-slate-400">
          {selectedChoice ? "Choice made — ready to proceed" : "Select an option to continue"}
        </span>
      </div>
    </motion.div>
  );
}

import React from "react";
