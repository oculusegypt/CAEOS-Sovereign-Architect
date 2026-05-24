"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  phase: string;
  phaseAr?: string;
  percentage: number;
}

export default function ProgressBar({
  current,
  total,
  phase,
  phaseAr,
  percentage,
}: ProgressBarProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-caeos-primary bg-blue-50 px-3 py-1 rounded-full">
            {phase}
          </span>
          {phaseAr && (
            <span
              className="text-sm font-semibold text-caeos-primary bg-blue-50 px-3 py-1 rounded-full"
              dir="rtl"
            >
              {phaseAr}
            </span>
          )}
        </div>
        <span className="text-sm text-slate-500 font-medium">
          {current} / {total}
        </span>
      </div>

      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-caeos-primary via-caeos-accent to-caeos-success rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-400">
          {percentage}% Complete
        </span>
        <span className="text-xs text-slate-400">
          {total - current} remaining
        </span>
      </div>
    </div>
  );
}
