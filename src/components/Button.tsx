import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { useTheme } from "../context/useTheme";
import { SPACING } from "../constants/spacing";

export function GlassButton({
  title,
  onPress,
  disabled,
  style,
  textStyle,
  variant,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: "primary" | "secondary" | "danger";
  accessibilityLabel?: string;
}) {
  const { theme } = useTheme();

  const resolvedVariant = variant ?? "secondary";

  const base = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.base,
      {
        borderColor: theme.border,
        backgroundColor:
          resolvedVariant === "primary"
            ? theme.accent
            : resolvedVariant === "danger"
              ? theme.accentAlt
              : theme.surface,
        opacity: disabled ? 0.4 : 1,
      },
      style,
    ],
    [disabled, style, theme.accent, theme.accentAlt, theme.border, theme.surface, resolvedVariant]
  );

  const label = useMemo<StyleProp<TextStyle>>(
    () => [
      styles.label,
      {
        color: resolvedVariant === "primary" ? theme.accentText : resolvedVariant === "danger" ? theme.dangerText : theme.text,
      },
      textStyle,
    ],
    [resolvedVariant, textStyle, theme.text]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        base,
        {
          borderBottomWidth: pressed ? 2 : 4,
          borderRightWidth: pressed ? 2 : 4,
        },
      ]}
      hitSlop={6}
    >
      <Text style={label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderRadius: 0,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  label: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});

