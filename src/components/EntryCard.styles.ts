import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const ENTRY_CARD_HEIGHT = 372;

export const styles = StyleSheet.create({
  cardOuter: {
    width: "100%",
    height: ENTRY_CARD_HEIGHT,
    marginBottom: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 4,
    borderRadius: 0,
  },
  cardInnerNoPadding: {
    padding: 0,
    borderRadius: 0,
  },
  photo: {
    width: "100%",
    height: 220,
    borderRadius: 0,
  },
  divider: {
    borderBottomWidth: 2,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  textBlock: {
    paddingBottom: 10,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  address: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  actionRow: {
    alignItems: "flex-end",
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  removeLabel: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modalBox: {
    width: "100%",
    borderRadius: 0,
    borderWidth: 3,
    borderTopWidth: 6,
    padding: 24,
  },
  modalTitle: {
    fontFamily: "monospace",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  modalBody: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  modalBtnRow: {
    marginTop: 24,
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
  },
});

