import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/useTheme";
import { SPACING } from "../constants/spacing";

export function EmptyState({ message }: { message?: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.root}>
      <Text style={[styles.heading, { color: theme.text }]} numberOfLines={2}>
        NO ENTRIES YET
      </Text>
      <Text style={[styles.subtext, { color: theme.textMuted }]} numberOfLines={2}>
        {message ?? "Tap '+ Add Entry' to begin"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
    fontFamily: "monospace",
    marginBottom: SPACING.sm,
  },
  subtext: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    textAlign: "center",
  },
});

