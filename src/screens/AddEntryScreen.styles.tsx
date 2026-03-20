import { StyleSheet } from "react-native";
import { SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: SPACING.xl,
  },
  formBlock: {
    width: "100%",
    gap: SPACING.md,
  },

  photoFrame: {
    width: "100%",
    height: 220,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 0,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  photoCameraWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  photoCamera: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  photoOverlayText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
  },
  photoPreview: {
    width: "100%",
    height: 220,
    borderWidth: 2,
    borderRadius: 0,
  },

  inlineError: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 10,
  },

  section: {
    marginTop: SPACING.md,
  },
  sectionLabel: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 0,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  addressInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 0,
    paddingLeft: 12,
    paddingRight: 8,
  },
  addressInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  rightSlot: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 2,
  },

  warningLabel: {
    marginTop: 10,
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  refreshRow: {
    marginTop: 12,
  },

  buttonStack: {
    marginTop: 18,
    gap: 12,
  },
  fullWidthButton: {
    width: "100%",
  },
  permissionBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  permissionBox: {
    width: "100%",
    borderRadius: 0,
    borderWidth: 3,
    borderBottomWidth: 3,
    borderTopWidth: 6,
    padding: 24,
  },
  permissionTitle: {
    fontFamily: "monospace",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
    textAlign: "left",
  },
  permissionBody: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtnRow: {
    flexDirection: "row",
    gap: 12,
  },
  permissionBtn: {
    flex: 1,
  },
});

