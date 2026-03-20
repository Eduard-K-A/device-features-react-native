import { StyleSheet } from "react-native";
import { RADIUS, SPACING } from "../constants/spacing";

export const ENTRY_CARD_HEIGHT = 292;

export const styles = StyleSheet.create({
  card: {
    height: ENTRY_CARD_HEIGHT,
  },
  noPadding: {
    padding: 0,
  },
  photo: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  content: {
    padding: SPACING.md,
  },
  pictureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: SPACING.xs,
  },
  address: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
  },
  rowEnd: {
    marginTop: SPACING.sm,
    alignItems: "flex-end",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 999,
    borderWidth: 1,
  },
  removeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
  },
  modalCard: {
    width: "100%",
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: SPACING.sm,
  },
  modalText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  modalActions: {
    marginTop: SPACING.lg,
    flexDirection: "row",
    gap: SPACING.sm,
  },
  modalBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },
  modalBtnLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});

