import { StyleSheet } from "react-native";
import { RADIUS, SPACING } from "../constants/spacing";

export const ENTRY_CARD_HEIGHT = 128;

export const styles = StyleSheet.create({
  card: {
    height: ENTRY_CARD_HEIGHT,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  pictureTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: SPACING.xs,
  },
  address: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  meta: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  actions: {
    marginTop: SPACING.sm,
    alignItems: "flex-start",
  },
  removeBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
});

