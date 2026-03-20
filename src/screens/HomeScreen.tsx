import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenGradient } from "../components/ScreenGradient";
import { FadeInSlideUp } from "../components/FadeInSlideUp";
import { EntryCard } from "../components/EntryCard";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { useEntries } from "../context/useEntries";
import { useTheme } from "../context/useTheme";
import type { RootStackParamList } from "../types/navigation";
import type { TravelEntry } from "../types/entry";
import { styles } from "./HomeScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { entries, removeEntry } = useEntries();
  const { toggleTheme, isDark, theme } = useTheme();

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
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
        <Header
          variant="home"
          onAddEntry={() => navigation.navigate("AddEntry")}
          onToggleTheme={toggleTheme}
          isDark={isDark}
        />
        <FadeInSlideUp>
          <FlatList
            data={entries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={contentContainerStyle}
            ItemSeparatorComponent={undefined}
            removeClippedSubviews
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={8}
            ListEmptyComponent={<EmptyState message="Tap '+ Add Entry' to begin" />}
          />
        </FadeInSlideUp>
      </SafeAreaView>
    </ScreenGradient>
  );
}
