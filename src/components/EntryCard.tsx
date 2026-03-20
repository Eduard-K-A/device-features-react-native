import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { TravelEntry } from "../types/entry";
import { GlassCard } from "./GlassCard";
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
  const [visible, setVisible] = useState<boolean>(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.92,
        useNativeDriver: true,
        friction: 9,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 190,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, visible]);

  return (
    <>
      <TouchableOpacity activeOpacity={0.9}>
        <GlassCard style={styles.card} contentStyle={styles.noPadding}>
          <Image source={{ uri: entry.imageUri }} style={styles.photo} />
          <View style={styles.content}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.pictureTitle, { color: theme.textPrimary }]}>
              {entry.title}
            </Text>
            <Text numberOfLines={2} style={[styles.address, { color: theme.textSecondary }]}>
              {entry.address}
            </Text>
            <View style={styles.rowEnd}>
              <Pressable
                onPress={() => setVisible(true)}
                style={[styles.removeBtn, { borderColor: "rgba(239,68,68,0.5)", backgroundColor: "rgba(239,68,68,0.2)" }]}
              >
                <Ionicons name="trash-outline" size={14} color={theme.danger} />
                <Text style={[styles.removeText, { color: theme.danger }]}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none" onRequestClose={() => setVisible(false)}>
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: theme.isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)",
              opacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.glassFill,
                borderColor: theme.glassBorder,
                transform: [{ scale }],
                shadowColor: theme.shadow,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Remove entry?</Text>
            <Text style={[styles.modalText, { color: theme.textSecondary }]}>
              This will permanently delete the entry.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setVisible(false)}
                style={[styles.modalBtn, { backgroundColor: theme.buttonFill, borderColor: theme.glassBorder }]}
              >
                <Text style={[styles.modalBtnLabel, { color: theme.textPrimary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setVisible(false);
                  onRemove(entry.id);
                }}
                style={[styles.modalBtn, { backgroundColor: "rgba(239,68,68,0.25)", borderColor: "rgba(239,68,68,0.5)" }]}
              >
                <Text style={[styles.modalBtnLabel, { color: theme.danger }]}>Delete</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
});
