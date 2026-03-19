import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { useTheme } from "../context/useTheme";
import { RADIUS, SPACING } from "../constants/spacing";

export function GlassButton({
  title,
  onPress,
  disabled,
  style,
  textStyle,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}) {
  const { theme } = useTheme();

  const base = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.base,
      {
        borderColor: theme.glassBorder,
        shadowColor: theme.shadow,
        opacity: disabled ? 0.55 : 1,
      },
      style,
    ],
    [disabled, style, theme.glassBorder, theme.shadow]
  );

  const label = useMemo<StyleProp<TextStyle>>(
    () => [
      styles.label,
      {
        color: theme.textPrimary,
      },
      textStyle,
    ],
    [textStyle, theme.textPrimary]
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
          backgroundColor: pressed ? theme.buttonFillPressed : theme.buttonFill,
        },
      ]}
    >
      <Text style={label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

