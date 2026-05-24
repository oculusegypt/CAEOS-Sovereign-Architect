"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

interface WizardAnswer {
  questionId: string;
  questionTitle: string;
  questionTitleAr?: string;
  choice: string;
  choiceLabel: string;
  choiceLabelAr?: string;
  isRecommended: boolean;
  consequence: string;
}

interface SummaryScreenProps {
  answers: WizardAnswer[];
  onRatify: () => void;
  onModify: (questionIndex: number) => void;
  onBack: () => void;
  isSubmitting: boolean;
  projectName?: string;
}

export default function SummaryScreen({
  answers,
  onRatify,
  onModify,
  onBack,
  isSubmitting,
  projectName = "CAEOS v2.0 Meta-Build",
}: SummaryScreenProps) {
  const t = useTranslations("wizard");

  const allRecommended = answers.every((a) => a.isRecommended);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-caeos-primary/10 rounded-full mb-4">
          <Shield className="h-8 w-8 text-caeos-primary" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {t("summary_title")}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          {t("summary_description")} — <strong>{projectName}</strong>
        </p>
      </div>

      {/* Alert if not all recommended */}
      {!allRecommended && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <XCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Custom choices detected
            </p>
            <p className="text-sm text-amber-700 mt-1">
              You have deviated from CAEOS recommendations in{" "}
              {answers.filter((a) => !a.isRecommended).length} question(s).
              This is your sovereign right — but please review the implications.
            </p>
          </div>
        </div>
      )}

      {/* Decision Cards */}
      <div className="space-y-4 mb-8">
        {answers.map((answer, index) => (
          <motion.div
            key={answer.questionId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl border-2 p-5 transition-all ${
              answer.isRecommended
                ? "border-green-200 shadow-sm"
                : "border-amber-200 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Q{index + 1}
                  </span>
                  <h3 className="font-semibold text-slate-900">
                    {answer.questionTitle}
                  </h3>
                  {answer.questionTitleAr && (
                    <span className="text-sm text-caeos-primary" dir="rtl">
                      · {answer.questionTitleAr}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {answer.isRecommended ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span
                    className={`font-medium ${
                      answer.isRecommended ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    {answer.choiceLabel}
                  </span>
                  {answer.choiceLabelAr && (
                    <span className="text-sm text-slate-500" dir="rtl">
                      {answer.choiceLabelAr}
                    </span>
                  )}
                  {answer.isRecommended && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ⭐ Recommended
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500 pl-6">
                  → {answer.consequence}
                </p>
              </div>

              <button
                onClick={() => onModify(index)}
                className="text-sm text-caeos-primary hover:underline ml-4 flex-shrink-0"
              >
                {t("modify")}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Constitution Warning */}
      <div className="bg-slate-900 text-white rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-caeos-accent mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Constitutional Reminder</h3>
            <p className="text-sm text-slate-300">
              By ratifying these decisions, you invoke <strong>Law 10</strong> — Human Approval
              Overrides All AI Decisions. These choices will be recorded in the Knowledge Graph
              (Law 11) and become binding for all subsequent phases.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          {t("back")}
        </button>

        <button
          onClick={onRatify}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-4 bg-caeos-primary text-white rounded-xl font-semibold shadow-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Ratifying...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              {t("ratify")}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
