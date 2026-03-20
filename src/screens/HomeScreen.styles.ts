import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: SPACING.xl,
  },
  listEmpty: {
    flexGrow: 1,
  },
});

