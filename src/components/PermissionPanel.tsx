import React, { useMemo } from "react";
import { Text, View } from "react-native";
import type { PermissionSnapshot } from "../hooks/usePermissions";
import { GlassButton } from "./GlassButton";
import { GlassCard } from "./GlassCard";
import { useTheme } from "../context/useTheme";
import { styles } from "./PermissionPanel.styles";

export function PermissionPanel({
  title,
  description,
  permission,
  onRequest,
}: {
  title: string;
  description: string;
  permission: PermissionSnapshot;
  onRequest: () => void;
}) {
  const { theme } = useTheme();

  const statusText = useMemo(() => {
    if (permission.granted) return "Granted";
    if (!permission.canAskAgain) return "Denied (enable in Settings)";
    if (permission.status === "undetermined") return "Not requested";
    return "Denied";
  }, [permission.canAskAgain, permission.granted, permission.status]);

  return (
    <GlassCard>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.desc, { color: theme.textSecondary }]}>{description}</Text>
      <View style={styles.row}>
        <Text style={[styles.status, { color: theme.textSecondary }]}>
          Status: {statusText}
        </Text>
      </View>
      <GlassButton
        title={permission.granted ? "Granted" : "Grant permission"}
        onPress={onRequest}
        disabled={permission.granted}
      />
    </GlassCard>
  );
}
