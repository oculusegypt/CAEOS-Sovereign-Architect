import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface WizardStep {
  phase: string;
  question: string;
  options: { label: string; value: string }[];
  recommendation: string;
  explanation: string;
}

const STEPS: WizardStep[] = [
  {
    phase: "P2 — Deep Interrogation",
    question: "What is the primary delivery mode for this project?",
    options: [
      { label: "Hybrid (Agent + Dashboard)", value: "hybrid" },
      { label: "Fully Automated Agent", value: "automated" },
      { label: "Human-in-the-Loop", value: "human" },
    ],
    recommendation: "hybrid",
    explanation:
      "Hybrid mode balances AI power with human oversight — the most resilient architecture.",
  },
  {
    phase: "P2 — Team Structure",
    question: "What is the team size for this project?",
    options: [
      { label: "Solo Developer", value: "solo" },
      { label: "Small Team (2-5)", value: "small" },
      { label: "Large Team (6+)", value: "large" },
    ],
    recommendation: "solo",
    explanation:
      "Solo execution maximizes speed and minimizes coordination overhead for initial builds.",
  },
  {
    phase: "P3 — Technical Blueprint",
    question: "Which technology stack best fits your requirements?",
    options: [
      { label: "Next.js + Python + PostgreSQL", value: "nextpy" },
      { label: "React + Node + PostgreSQL", value: "reactnode" },
      { label: "Vue + FastAPI + MongoDB", value: "vuefastapi" },
    ],
    recommendation: "nextpy",
    explanation:
      "Python-native stack is optimal for AI workloads with structured relational data.",
  },
  {
    phase: "P5 — Language Strategy",
    question: "What language strategy will you adopt?",
    options: [
      { label: "Bilingual (Arabic + English)", value: "bilingual" },
      { label: "English Only", value: "en_only" },
      { label: "Arabic Only", value: "ar_only" },
    ],
    recommendation: "bilingual",
    explanation:
      "Bilingual strategy maximizes reach: Arabic UX for local audience, English for global GitHub.",
  },
];

export default function WizardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = STEPS[step];
  const progress = (step + (completed ? 1 : 0)) / STEPS.length;
  const selectedValue = choices[step];

  function selectOption(value: string) {
    Haptics.selectionAsync();
    setChoices((prev) => ({ ...prev, [step]: value }));
  }

  function next() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < STEPS.length - 1) {
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

  function reset() {
    setCompleted(false);
    setStep(0);
    setChoices({});
    setShowExplanation(false);
  }

  if (completed) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: isWeb ? insets.top + 67 : 24,
              paddingBottom: isWeb ? 34 + 84 : 40,
            },
          ]}
        >
          <View style={styles.successHeader}>
            <View
              style={[
                styles.successIcon,
                { backgroundColor: "#10b98122", borderColor: "#10b98144" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={40} color="#10b981" />
            </View>
            <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
              Decision Summary
            </Text>
            <Text style={[styles.summaryDesc, { color: colors.mutedForeground }]}>
              Review your choices before ratification
            </Text>
          </View>

          <View style={styles.decisionList}>
            {STEPS.map((s, i) => {
              const val = choices[i] ?? s.options[0].value;
              const opt = s.options.find((o) => o.value === val) ?? s.options[0];
              return (
                <View
                  key={i}
                  style={[
                    styles.decisionCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <Text style={[styles.phaseLabel, { color: colors.accent }]}>
                    {s.phase}
                  </Text>
                  <Text style={[styles.questionText, { color: colors.mutedForeground }]}>
                    {s.question}
                  </Text>
                  <View style={styles.chosenRow}>
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text style={[styles.chosenText, { color: colors.foreground }]}>
                      {opt.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={reset}
            style={[
              styles.ratifyBtn,
              { backgroundColor: colors.primary, borderRadius: colors.radius },
            ]}
          >
            <Text style={[styles.ratifyText, { color: colors.primaryForeground }]}>
              Modify Decisions
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : 16,
            paddingBottom: isWeb ? 34 + 84 : 40,
          },
        ]}
      >
        {/* Progress */}
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
            Progress
          </Text>
          <Text style={[styles.stepCounter, { color: colors.mutedForeground }]}>
            {step + 1} / {STEPS.length}
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary, width: `${progress * 100}%` as any },
            ]}
          />
        </View>

        {/* Question Card */}
        <View
          style={[
            styles.questionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.phaseLabel, { color: colors.accent }]}>{current.phase}</Text>
          <Text style={[styles.questionTitle, { color: colors.foreground }]}>
            {current.question}
          </Text>

          {/* Recommendation */}
          <View
            style={[
              styles.recBadge,
              {
                backgroundColor: colors.primary + "18",
                borderColor: colors.primary + "33",
              },
            ]}
          >
            <Text style={[styles.recLabel, { color: colors.accent }]}>
              Smart Recommendation
            </Text>
            <Text style={[styles.recValue, { color: colors.foreground }]}>
              {current.options.find((o) => o.value === current.recommendation)?.label}
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            {current.options.map((opt) => {
              const isSelected = selectedValue === opt.value;
              const isRec = opt.value === current.recommendation;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => selectOption(opt.value)}
                  style={[
                    styles.optionBtn,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected
                        ? colors.primary + "22"
                        : colors.background,
                      borderRadius: colors.radius - 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? colors.foreground : colors.mutedForeground },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isRec && (
                    <View
                      style={[
                        styles.recTag,
                        { borderColor: "#10b98144", backgroundColor: "#10b98122" },
                      ]}
                    >
                      <Text style={[styles.recTagText, { color: "#10b981" }]}>
                        ✓ Recommended
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Explanation toggle */}
          <Pressable
            onPress={() => setShowExplanation(!showExplanation)}
            style={styles.explainToggle}
          >
            <Feather name="zap" size={14} color={colors.accent} />
            <Text style={[styles.explainToggleText, { color: colors.accent }]}>
              Why does this matter?
            </Text>
          </Pressable>

          {showExplanation && (
            <View
              style={[
                styles.explanationBox,
                {
                  backgroundColor: colors.muted,
                  borderColor: colors.border,
                  borderRadius: colors.radius - 4,
                },
              ]}
            >
              <Text style={[styles.explanationText, { color: colors.mutedForeground }]}>
                {current.explanation}
              </Text>
            </View>
          )}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable
            onPress={back}
            disabled={step === 0}
            style={[
              styles.backBtn,
              {
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: step === 0 ? 0.4 : 1,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.foreground} />
            <Text style={[styles.backText, { color: colors.foreground }]}>Back</Text>
          </Pressable>

          <Pressable
            onPress={next}
            style={[
              styles.nextBtn,
              { backgroundColor: colors.primary, borderRadius: colors.radius },
            ]}
          >
            <Text style={[styles.nextText, { color: colors.primaryForeground }]}>
              {step === STEPS.length - 1 ? "Confirm" : "Next"}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 16 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  stepCounter: { fontSize: 12, fontFamily: "Inter_500Medium" },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  questionCard: { padding: 20, gap: 14, borderWidth: 1 },
  phaseLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  questionTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", lineHeight: 26 },
  recBadge: { padding: 12, borderWidth: 1, borderRadius: 8, gap: 4 },
  recLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  recValue: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  optionsList: { gap: 10 },
  optionBtn: { padding: 14, borderWidth: 1.5, gap: 6 },
  optionText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  recTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
  },
  recTagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  explainToggle: { flexDirection: "row", alignItems: "center", gap: 6 },
  explainToggleText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  explanationBox: { padding: 12, borderWidth: 1 },
  explanationText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  navRow: { flexDirection: "row", gap: 12 },
  backBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 14,
    borderWidth: 1,
  },
  backText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  nextBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 14,
  },
  nextText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  successHeader: { alignItems: "center", gap: 12, paddingVertical: 8 },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  summaryDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  decisionList: { gap: 12 },
  decisionCard: { padding: 16, borderWidth: 1, gap: 6 },
  questionText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  chosenRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  chosenText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  ratifyBtn: { paddingVertical: 16, alignItems: "center", marginTop: 8 },
  ratifyText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
