import React, { memo, useCallback, useMemo } from "react";
import { Alert, Image, Text, View } from "react-native";
import type { TravelEntry } from "../types/entry";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { useTheme } from "../context/useTheme";
import { styles, ENTRY_CARD_HEIGHT } from "./EntryCard.styles";

export { ENTRY_CARD_HEIGHT };

export const EntryCard = memo(function EntryCard({
  entry,
  onRemove,
}: {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}) {
  const { theme } = useTheme();

  const confirmRemove = useCallback(() => {
    Alert.alert("Remove entry?", "This will permanently delete the entry.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => onRemove(entry.id) },
    ]);
  }, [entry.id, onRemove]);

  const imageStyle = useMemo(
    () => [styles.thumb, { borderColor: theme.glassBorder }],
    [theme.glassBorder]
  );

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: entry.imageUri }} style={imageStyle} />
        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.pictureTitle, { color: theme.textPrimary }]}>
            {entry.title}
          </Text>
          <Text numberOfLines={2} style={[styles.address, { color: theme.textPrimary }]}>
            {entry.address}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {new Date(entry.createdAt).toLocaleString()}
          </Text>
          <View style={styles.actions}>
            <GlassButton
              title="Remove"
              onPress={confirmRemove}
              style={styles.removeBtn}
              textStyle={{ color: theme.danger }}
              accessibilityLabel="Remove entry"
            />
          </View>
        </View>
      </View>
    </GlassCard>
  );
});
