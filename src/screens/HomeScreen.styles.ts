import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerRight: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: SPACING.lg,
  },
});

