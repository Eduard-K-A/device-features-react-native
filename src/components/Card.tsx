import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../context/useTheme";
import { SPACING } from "../constants/spacing";

export function Card({
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
        backgroundColor: theme.surface,
        borderColor: theme.border,
        shadowColor: theme.shadow,
      },
      style,
    ],
    [style, theme.border, theme.shadow, theme.surface]
  );

  const innerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.inner,
      {
        backgroundColor: theme.surface,
      },
      contentStyle,
    ],
    [contentStyle, theme.surface]
  );

  return (
    <View style={containerStyle}>
      <View style={innerStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderRadius: 0,
  },
  inner: {
    padding: 16,
    borderRadius: 0,
  },
});

