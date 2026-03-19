import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, type ViewStyle } from "react-native";

export function FadeInSlideUp({
  children,
  distance = 10,
  durationMs = 320,
  style,
}: {
  children: React.ReactNode;
  distance?: number;
  durationMs?: number;
  style?: ViewStyle;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: durationMs,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: durationMs,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [distance, durationMs, opacity, translateY]);

  const containerStyle = useMemo(
    () => [styles.container, style, { opacity, transform: [{ translateY }] }],
    [opacity, style, translateY]
  );

  return <Animated.View style={containerStyle}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

