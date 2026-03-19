import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/useTheme";
import { SPACING } from "../constants/spacing";

export function LoadingInline({ label }: { label: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <ActivityIndicator color={theme.icon} />
      <Text style={[styles.text, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
});

