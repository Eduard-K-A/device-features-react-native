import React, { useMemo } from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../context/useTheme";
import { RADIUS, SPACING } from "../constants/spacing";

export function GlassCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.container,
      {
        borderColor: theme.glassBorder,
        shadowColor: theme.shadow,
      },
      style,
    ],
    [style, theme.glassBorder, theme.shadow]
  );

  const innerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.inner,
      {
        backgroundColor: theme.glassFill,
      },
      contentStyle,
    ],
    [contentStyle, theme.glassFill]
  );

  const blurIntensity = theme.isDark ? 32 : 26;
  const blurTint: "dark" | "light" = theme.isDark ? "dark" : "light";

  return (
    <View style={containerStyle}>
      {Platform.OS === "android" ? (
        <View style={innerStyle}>{children}</View>
      ) : (
        <BlurView intensity={blurIntensity} tint={blurTint} style={styles.blur}>
          <View style={innerStyle}>{children}</View>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  blur: {
    flex: 1,
  },
  inner: {
    padding: SPACING.lg,
  },
});

