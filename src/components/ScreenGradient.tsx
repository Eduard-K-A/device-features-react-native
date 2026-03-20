import React, { useMemo } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../context/useTheme";

export function ScreenGradient({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const backgroundColor = useMemo(() => theme.background, [theme.background]);

  return (
    <View style={[styles.root, { backgroundColor }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

