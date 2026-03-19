import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  row: {
    marginBottom: SPACING.md,
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
  },
});

