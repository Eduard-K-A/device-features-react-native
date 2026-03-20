import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  title: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: SPACING.xs,
  },
  desc: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.md,
    fontWeight: "700",
  },
  row: {
    marginBottom: SPACING.md,
  },
  status: {
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "700",
  },
});

