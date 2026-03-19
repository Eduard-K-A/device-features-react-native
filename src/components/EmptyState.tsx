import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/useTheme";
import { SPACING } from "../constants/spacing";

export function EmptyState({ message }: { message: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.root}>
      <Text style={[styles.text, { color: theme.textSecondary }]}>{message}</Text>
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
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});

