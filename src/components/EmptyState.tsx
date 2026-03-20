import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/useTheme";
import { SPACING } from "../constants/spacing";

export function EmptyState({ message, entriesCount }: { message?: string; entriesCount?: number }) {
  const { theme } = useTheme();
  const count = entriesCount ?? 0;
  const isAddMore = count === 1;

  const heading = isAddMore ? "Add More!" : "NO ENTRIES YET";
  const subtext =
    message ?? (isAddMore ? "Tap '+ Add Entry' to continue." : "Tap '+ Add Entry' to begin");

  if (isAddMore) {
    return (
      <View style={styles.root}>
        <View style={styles.addMoreWrap}>
          <Text
            style={[styles.heading, styles.addMoreHeading, { color: theme.text }]}
            numberOfLines={2}
          >
            {heading}
          </Text>
          <Text style={[styles.subtext, { color: theme.textMuted }]} numberOfLines={2}>
            {subtext}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, styles.center]}>
      <Text style={[styles.heading, { color: theme.text }]} numberOfLines={2}>
        {heading}
      </Text>
      <Text style={[styles.subtext, { color: theme.textMuted }]} numberOfLines={2}>
        {subtext}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: SPACING.xl,
    position: "relative",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  addMoreWrap: {
    position: "absolute",
    top: "75%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "monospace",
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  addMoreHeading: {
    textTransform: "none",
  },
  subtext: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "monospace",
    textAlign: "center",
  },
});

