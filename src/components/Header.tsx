import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/useTheme";

interface HeaderProps {
  variant: "home" | "add-entry";
  onAddEntry?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export function Header({ variant, onAddEntry, onToggleTheme, isDark = false }: HeaderProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const rotate = useRef(new Animated.Value(0)).current;

  const onPressToggle = () => {
    Animated.timing(rotate, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start(() => rotate.setValue(0));
    onToggleTheme?.();
  };

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.root, { backgroundColor: theme.glassFill, borderBottomColor: theme.glassBorder }]}>
      {variant === "home" ? (
        <>
          <Text style={[styles.title, { color: theme.textPrimary }]}>✈️ Travel Diary</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onAddEntry}
              style={[styles.pill, { borderColor: theme.glassBorder, backgroundColor: theme.buttonFill }]}
            >
              <Ionicons name="add" size={16} color={theme.textPrimary} />
              <Text style={[styles.pillLabel, { color: theme.textPrimary }]}>Add Entry</Text>
            </Pressable>
            <Pressable
              onPress={onPressToggle}
              style={[styles.iconCircle, { borderColor: theme.glassBorder, backgroundColor: theme.buttonFill }]}
            >
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name={isDark ? "sunny" : "moon"} size={18} color={theme.textPrimary} />
              </Animated.View>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.iconCircle, { borderColor: theme.glassBorder, backgroundColor: theme.buttonFill }]}
          >
            <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
          </Pressable>
          <Text style={[styles.titleCenter, { color: theme.textPrimary }]}>New Travel Entry</Text>
          <View style={styles.spacer} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  titleCenter: {
    fontSize: 20,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 38,
    height: 38,
  },
});

