import React, { useCallback, useLayoutEffect, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenGradient } from "../components/ScreenGradient";
import { FadeInSlideUp } from "../components/FadeInSlideUp";
import { EntryCard, ENTRY_CARD_HEIGHT } from "../components/EntryCard";
import { EmptyState } from "../components/EmptyState";
import { IconButton } from "../components/IconButton";
import { useEntries } from "../context/useEntries";
import { useTheme } from "../context/useTheme";
import type { RootStackParamList } from "../types/navigation";
import { SPACING } from "../constants/spacing";
import type { TravelEntry } from "../types/entry";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { entries, removeEntry } = useEntries();
  const { toggleTheme, isDark } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <IconButton
            icon="add"
            onPress={() => navigation.navigate("AddEntry")}
            accessibilityLabel="Add entry"
          />
          <IconButton
            icon={isDark ? "sunny" : "moon"}
            onPress={toggleTheme}
            accessibilityLabel="Toggle theme"
          />
        </View>
      ),
    });
  }, [navigation, toggleTheme]);

  const onRemove = useCallback(
    (id: string) => {
      void removeEntry(id);
    },
    [removeEntry]
  );

  const renderItem = useCallback(
    ({ item }: { item: TravelEntry }) => (
      <EntryCard entry={item} onRemove={onRemove} />
    ),
    [onRemove]
  );

  const contentContainerStyle = useMemo(
    () => [styles.listContent, entries.length === 0 ? styles.listEmpty : null],
    [entries.length]
  );

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <FadeInSlideUp>
          <FlatList
            data={entries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={contentContainerStyle}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            removeClippedSubviews
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={8}
            getItemLayout={(_, index) => ({
              length: ENTRY_CARD_HEIGHT + SPACING.lg,
              offset: (ENTRY_CARD_HEIGHT + SPACING.lg) * index,
              index,
            })}
            ListEmptyComponent={<EmptyState message="No Entries yet" />}
          />
        </FadeInSlideUp>
      </SafeAreaView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerRight: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: SPACING.lg,
  },
});

