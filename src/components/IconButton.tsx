import React, { useMemo } from "react";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/useTheme";
import { RADIUS, SPACING } from "../constants/spacing";

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  disabled,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();

  const base = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.base,
      { borderColor: theme.glassBorder, opacity: disabled ? 0.55 : 1 },
      style,
    ],
    [disabled, style, theme.glassBorder]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        base,
        { backgroundColor: pressed ? theme.buttonFillPressed : theme.buttonFill },
      ]}
      hitSlop={10}
    >
      <Ionicons name={icon} size={20} color={theme.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});

