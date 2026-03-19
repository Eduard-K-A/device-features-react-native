import React, { memo, useCallback, useMemo } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import type { TravelEntry } from "../types/entry";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { useTheme } from "../context/useTheme";
import { RADIUS, SPACING } from "../constants/spacing";

const CARD_HEIGHT = 112;

export const ENTRY_CARD_HEIGHT = CARD_HEIGHT;

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

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: SPACING.lg,
  },
  content: {
    flex: 1,
  },
  address: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: SPACING.xs,
  },
  meta: {
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    marginTop: SPACING.sm,
    alignItems: "flex-start",
  },
  removeBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
});

