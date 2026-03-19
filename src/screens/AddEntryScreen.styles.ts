import { StyleSheet } from "react-native";
import { RADIUS, SPACING } from "../constants/spacing";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  stack: {
    gap: SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: SPACING.md,
  },
  body: {
    fontSize: 14,
    fontWeight: "600",
  },
  cameraWrap: {
    height: 320,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  camera: {
    flex: 1,
  },
  previewWrap: {
    height: 320,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  preview: {
    flex: 1,
  },
  error: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: SPACING.xs,
  },
  inputGroup: {
    marginTop: SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    fontWeight: "700",
  },
  addressBox: {
    marginTop: SPACING.md,
  },
  address: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  actions: {
    marginTop: SPACING.lg,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  flex: {
    flex: 1,
  },
  refreshRow: {
    marginTop: SPACING.md,
  },
  saveRow: {
    marginTop: SPACING.lg,
  },
});

