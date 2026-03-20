import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
        },
      ]}
    >
      {variant === "home" ? (
        <>
          <Text style={[styles.title, { color: theme.text, letterSpacing: -0.5 }]}>TRAVEL DIARY</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onAddEntry}
              style={({ pressed }) => [
                styles.addPill,
                {
                  backgroundColor: theme.accent,
                  borderColor: theme.border,
                  borderBottomWidth: pressed ? 2 : 4,
                  borderRightWidth: pressed ? 2 : 4,
                },
              ]}
            >
              <Ionicons name="add" size={16} color={theme.accentText} />
              <Text style={[styles.addPillLabel, { color: theme.accentText }]}>ADD ENTRY</Text>
            </Pressable>
            <Pressable
              onPress={onToggleTheme}
              style={({ pressed }) => [
                styles.toggleSquare,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                  borderBottomWidth: pressed ? 2 : 4,
                  borderRightWidth: pressed ? 2 : 4,
                },
              ]}
            >
              <Ionicons name={isDark ? "sunny" : "moon"} size={18} color={theme.text} />
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backSquare,
              {
                borderColor: theme.border,
                backgroundColor: theme.surface,
                borderBottomWidth: pressed ? 2 : 4,
                borderRightWidth: pressed ? 2 : 4,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </Pressable>
          <Text style={[styles.titleCenter, { color: theme.text }]}>NEW TRAVEL ENTRY</Text>
          <View style={styles.spacer} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  titleCenter: {
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 3,
    flex: 1,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  addPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  addPillLabel: {
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  toggleSquare: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  backSquare: {
    width: 40,
    height: 40,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  spacer: {
    width: 40,
    height: 40,
  },
});

