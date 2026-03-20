import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: SPACING.lg,
  },
});

