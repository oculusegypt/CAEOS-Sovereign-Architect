import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";

const LAYERS = [
  { id: "L1", name: "Intent Kernel", active: true },
  { id: "L2", name: "Deep Interrogator", active: true },
  { id: "L3", name: "Decision Engine", active: true },
  { id: "L4", name: "Constitution Core", active: true },
  { id: "L5", name: "Arbitration Kernel", active: false },
  { id: "L6", name: "Knowledge Graph", active: true },
  { id: "L7", name: "Reality Validator", active: true },
  { id: "L8", name: "Governance Engine", active: true },
];

const DECISIONS = [
  { phase: "P2", decision: "Delivery Mode", choice: "Hybrid", ratified: true },
  { phase: "P2", decision: "Pilot Project", choice: "Meta-Build", ratified: true },
  { phase: "P2", decision: "Team Size", choice: "Solo Developer", ratified: true },
  { phase: "P3", decision: "Tech Stack", choice: "Next.js + Python", ratified: false },
];

const STATS = [
  { lib: "Ionicons" as const, icon: "shield-checkmark", color: "#0ea5e9", value: "15", label: "Sovereign Layers" },
  { lib: "Feather" as const, icon: "git-branch", color: "#10b981", value: "22", label: "Phases" },
  { lib: "MaterialCommunityIcons" as const, icon: "scale-balance", color: "#f59e0b", value: "21", label: "Constitutional Laws" },
  { lib: "MaterialCommunityIcons" as const, icon: "brain", color: "#2563eb", value: "7/8", label: "Layers Active" },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  function renderStatIcon(stat: (typeof STATS)[0]) {
    if (stat.lib === "Ionicons")
      // @ts-ignore
      return <Ionicons name={stat.icon} size={20} color={stat.color} />;
    if (stat.lib === "Feather")
      // @ts-ignore
      return <Feather name={stat.icon} size={20} color={stat.color} />;
    // @ts-ignore
    return <MaterialCommunityIcons name={stat.icon} size={20} color={stat.color} />;
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: isWeb ? insets.top + 67 : 16,
            paddingBottom: isWeb ? 34 + 84 : 40,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: colors.foreground }]}>Dashboard</Text>
            <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
              Real-time system status
            </Text>
          </View>
          <View style={styles.statusPill}>
            <View style={[styles.pulseDot, { backgroundColor: "#10b981" }]} />
            <Text style={[styles.statusText, { color: "#10b981" }]}>System Active</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              {renderStatIcon(stat)}
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Sovereign Layers */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Sovereign Layers
          </Text>
          <View style={styles.layersList}>
            {LAYERS.map((layer) => (
              <View key={layer.id} style={styles.layerRow}>
                <Text style={[styles.layerId, { color: colors.accent }]}>{layer.id}</Text>
                <Text style={[styles.layerName, { color: colors.mutedForeground }]}>
                  {layer.name}
                </Text>
                <View style={styles.layerStatus}>
                  {layer.active ? (
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  ) : (
                    <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Decisions */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Decision Log</Text>
          <View style={styles.decisionsList}>
            {DECISIONS.map((d, i) => (
              <View
                key={i}
                style={[
                  styles.decisionRow,
                  i < DECISIONS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    paddingBottom: 12,
                    marginBottom: 12,
                  },
                ]}
              >
                <View style={styles.decisionLeft}>
                  <Text style={[styles.decisionPhase, { color: colors.accent }]}>
                    {d.phase}
                  </Text>
                  <Text style={[styles.decisionName, { color: colors.foreground }]}>
                    {d.decision}
                  </Text>
                  <Text style={[styles.decisionChoice, { color: colors.mutedForeground }]}>
                    {d.choice}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor: d.ratified ? "#10b98122" : "#f59e0b22",
                      borderColor: d.ratified ? "#10b98144" : "#f59e0b44",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      { color: d.ratified ? "#10b981" : "#f59e0b" },
                    ]}
                  >
                    {d.ratified ? "Ratified" : "Pending"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)/wizard")}
            style={[styles.addDecisionBtn, { borderTopColor: colors.border }]}
          >
            <Ionicons name="add-circle-outline" size={16} color={colors.accent} />
            <Text style={[styles.addDecisionText, { color: colors.accent }]}>
              Add new decision
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 16, gap: 16 },
  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  pageSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  pulseDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: "47%", padding: 16, gap: 6, borderWidth: 1 },
  statValue: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 4 },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  card: { padding: 16, borderWidth: 1, gap: 14 },
  cardTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  layersList: { gap: 10 },
  layerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  layerId: { width: 28, fontSize: 11, fontFamily: "Inter_600SemiBold" },
  layerName: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  layerStatus: { width: 24, alignItems: "center" },
  decisionsList: { gap: 0 },
  decisionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  decisionLeft: { flex: 1, gap: 2 },
  decisionPhase: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  decisionName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  decisionChoice: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statusTagText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  addDecisionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  addDecisionText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
