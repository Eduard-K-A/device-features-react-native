import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TravelEntry } from "../types/entry";
import { GlassButton } from "./Button";
import { Card } from "./Card";
import { useTheme } from "../context/useTheme";
import { ENTRY_CARD_HEIGHT, styles } from "./EntryCard.styles";

export { ENTRY_CARD_HEIGHT };

export const EntryCard = memo(function EntryCard({
  entry,
  onRemove,
}: {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}) {
  const { theme } = useTheme();
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const translateY = useRef(new Animated.Value(100)).current;

  const close = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => setConfirmVisible(false));
  }, [translateY]);

  const open = useCallback(() => {
    translateY.setValue(100);
    setConfirmVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  useEffect(() => {
    if (!confirmVisible) return;
    translateY.setValue(100);
  }, [confirmVisible, translateY]);

  const backdropColor = theme.isDark ? theme.modalBackdrop.dark : theme.modalBackdrop.light;

  return (
    <>
      <Card style={styles.cardOuter} contentStyle={styles.cardInnerNoPadding}>
        <Image source={{ uri: entry.imageUri }} style={styles.photo} resizeMode="cover" />
        <View style={[styles.divider, { borderColor: theme.border }]} />

        <View style={styles.content}>
          <View style={styles.textBlock}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
              {entry.title.trim().length > 0 ? entry.title.toUpperCase() : "UNTITLED ENTRY"}
            </Text>
            <Text
              style={[styles.address, { color: theme.textMuted }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {entry.address}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove entry"
              onPress={open}
              style={({ pressed }) => [
                styles.removeBtn,
                {
                  backgroundColor: theme.accentAlt,
                  borderColor: theme.border,
                  borderBottomWidth: pressed ? 2 : 4,
                  borderRightWidth: pressed ? 2 : 4,
                },
              ]}
            >
              <Ionicons name="trash-outline" size={16} color={theme.dangerText} />
              <Text style={[styles.removeLabel, { color: theme.dangerText }]}>REMOVE</Text>
            </Pressable>
          </View>
        </View>
      </Card>

      <Modal transparent visible={confirmVisible} animationType="none" onRequestClose={close}>
        <Pressable style={[styles.backdrop, { backgroundColor: backdropColor }]} onPress={close}>
          <Animated.View
            style={[
              styles.modalBox,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderTopColor: theme.accent,
                transform: [{ translateY }],
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>REMOVE ENTRY?</Text>
            <Text style={[styles.modalBody, { color: theme.textMuted }]}>
              This action cannot be undone.
            </Text>

            <View style={styles.modalBtnRow}>
              <GlassButton title="CANCEL" onPress={close} variant="secondary" style={styles.modalBtn} />
              <GlassButton
                title="DELETE"
                onPress={() => {
                  close();
                  onRemove(entry.id);
                }}
                variant="danger"
                style={styles.modalBtn}
              />
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
});
