import React from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const LAWS = [
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

function LawItem({ item, index }: { item: (typeof LAWS)[0]; index: number }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.lawCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View
        style={[
          styles.lawIndex,
          {
            backgroundColor: colors.primary + "22",
            borderColor: colors.primary + "44",
          },
        ]}
      >
        <Text style={[styles.lawIndexText, { color: colors.accent }]}>{index + 1}</Text>
      </View>
      <View style={styles.lawContent}>
        <Text style={[styles.lawEn, { color: colors.foreground }]}>{item.en}</Text>
        <Text style={[styles.lawAr, { color: colors.accent }]}>{item.ar}</Text>
      </View>
    </View>
  );
}

export default function ConstitutionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={LAWS}
        keyExtractor={(_, i) => String(i)}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: isWeb ? insets.top + 67 : 16,
            paddingBottom: isWeb ? 34 + 84 : 40,
          },
        ]}
        scrollEnabled={!!LAWS.length}
        ListHeaderComponent={
          <View style={styles.header}>
            <View
              style={[
                styles.headerIcon,
                { backgroundColor: "#f59e0b22", borderColor: "#f59e0b44" },
              ]}
            >
              <Ionicons name="scale" size={28} color="#f59e0b" />
            </View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              The CAEOS Constitution
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
              {LAWS.length} Constitutional Laws governing every engineering decision
            </Text>
            <Text style={[styles.headerSubtitleAr, { color: colors.accent }]}>
              {LAWS.length} قانون دستوري يحكم كل قرار هندسي
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.accent} />
            <Text style={[styles.footerQuote, { color: colors.mutedForeground }]}>
              The system is not a prompt. The system is an OS.
            </Text>
            <Text style={[styles.footerQuoteAr, { color: colors.mutedForeground }]}>
              النظام ليس Prompt. النظام هو OS.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => <LawItem item={item} index={index} />}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  listContent: { padding: 16 },
  header: { alignItems: "center", gap: 8, paddingBottom: 20 },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  headerSubtitleAr: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  lawCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
    borderWidth: 1,
  },
  lawIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  lawIndexText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  lawContent: { flex: 1, gap: 4 },
  lawEn: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  lawAr: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },
  footer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 24,
    marginTop: 16,
    borderTopWidth: 1,
  },
  footerQuote: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    textAlign: "center",
  },
  footerQuoteAr: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    textAlign: "center",
  },
});
