import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

const FEATURES = [
  {
    iconLib: "MaterialCommunityIcons" as const,
    icon: "brain",
    color: "#0ea5e9",
    title: "15 Sovereign Layers",
    titleAr: "15 طبقة سيادية",
    desc: "Every decision flows through 15 governance pillars — no layer is optional.",
    descAr: "كل قرار يمر عبر 15 ركيزة حوكمة — لا طبقة اختيارية.",
  },
  {
    iconLib: "Feather" as const,
    icon: "git-branch",
    color: "#10b981",
    title: "22-Phase Pipeline",
    titleAr: "أنبوب 22 مرحلة",
    desc: "A complete lifecycle from intent to delivery with continuous auditing.",
    descAr: "دورة حياة كاملة من النية إلى التسليم مع تدقيق مستمر.",
  },
  {
    iconLib: "MaterialCommunityIcons" as const,
    icon: "scale-balance",
    color: "#f59e0b",
    title: "20 Constitutional Laws",
    titleAr: "20 قانون دستوري",
    desc: "Binding laws that prevent architectural collapse and AI hallucinations.",
    descAr: "قوانين مُلزمة تمنع الانهيار المعماري والهلوسة البرمجية.",
  },
];

function FeatureCard({ feature }: { feature: (typeof FEATURES)[0] }) {
  const colors = useColors();
  const scale = useRef(new Animated.Value(1)).current;
  function onPressIn() {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  }
  function onPressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.featureCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View
          style={[
            styles.iconBadge,
            {
              backgroundColor: feature.color + "22",
              borderColor: feature.color + "44",
            },
          ]}
        >
          {feature.iconLib === "Feather" ? (
            // @ts-ignore
            <Feather name={feature.icon} size={20} color={feature.color} />
          ) : (
            // @ts-ignore
            <MaterialCommunityIcons name={feature.icon} size={20} color={feature.color} />
          )}
        </View>
        <Text style={[styles.featureTitle, { color: colors.foreground }]}>
          {feature.title}
        </Text>
        <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>
          {feature.desc}
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.featureTitleAr, { color: feature.color }]}>
          {feature.titleAr}
        </Text>
        <Text style={[styles.featureDescAr, { color: colors.mutedForeground }]}>
          {feature.descAr}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  function handleStartWizard() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/wizard");
  }

  function handleViewConstitution() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/constitution");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : 0,
            paddingBottom: isWeb ? 34 + 84 : 32,
          },
        ]}
      >
        <LinearGradient
          colors={["#1e3a5f55", "#0c132200"]}
          style={[styles.hero, { borderRadius: colors.radius, borderColor: "#1e3a5f66" }]}
        >
          <View
            style={[
              styles.versionBadge,
              { backgroundColor: colors.accent + "22", borderColor: colors.accent + "44" },
            ]}
          >
            <Ionicons name="shield-checkmark" size={13} color={colors.accent} />
            <Text style={[styles.versionText, { color: colors.accent }]}>
              v2.0 — Sovereign Architecture Governance
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: colors.foreground }]}>CAEOS v2.0</Text>
          <Text style={[styles.heroSubtitle, { color: colors.accent }]}>
            Constitutional AI Engineering{"\n"}Operating System
          </Text>
          <Text style={[styles.heroDesc, { color: colors.mutedForeground }]}>
            Not a coding assistant. A governance kernel that prevents architectural
            collapse and preserves human sovereignty.
          </Text>

          <View style={styles.ctaRow}>
            <Pressable
              onPress={handleStartWizard}
              style={[
                styles.ctaPrimary,
                { backgroundColor: colors.primary, borderRadius: colors.radius },
              ]}
            >
              <Text style={[styles.ctaPrimaryText, { color: colors.primaryForeground }]}>
                Start Wizard
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primaryForeground} />
            </Pressable>

            <Pressable
              onPress={handleViewConstitution}
              style={[
                styles.ctaSecondary,
                { borderColor: colors.border, borderRadius: colors.radius },
              ]}
            >
              <Text style={[styles.ctaSecondaryText, { color: colors.foreground }]}>
                Constitution
              </Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} feature={f} />
          ))}
        </View>

        <View
          style={[
            styles.statusBar,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.card,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.statusQuote, { color: colors.mutedForeground }]}>
            The system is not a prompt. The system is an OS.
          </Text>
          <View style={styles.statusIndicators}>
            <View style={styles.statusDot}>
              <View style={[styles.dot, { backgroundColor: "#10b981" }]} />
              <Text style={[styles.dotLabel, { color: colors.mutedForeground }]}>
                Constitution Active
              </Text>
            </View>
            <View style={styles.statusDot}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.dotLabel, { color: colors.mutedForeground }]}>
                Knowledge Graph
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 16 },
  hero: { padding: 24, gap: 12, borderWidth: 1 },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
  },
  versionText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  heroTitle: { fontSize: 38, fontFamily: "Inter_700Bold", letterSpacing: -1, marginTop: 4 },
  heroSubtitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", lineHeight: 24 },
  heroDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  ctaRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  ctaPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
  },
  ctaPrimaryText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  ctaSecondary: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderWidth: 1,
  },
  ctaSecondaryText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  features: { gap: 12 },
  featureCard: { padding: 20, gap: 8, borderWidth: 1 },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  featureTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  featureDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  divider: { height: 1, marginVertical: 4 },
  featureTitleAr: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  featureDescAr: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  statusBar: { padding: 16, gap: 10, borderTopWidth: 1 },
  statusQuote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
  statusIndicators: { flexDirection: "row", justifyContent: "center", gap: 20 },
  statusDot: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
