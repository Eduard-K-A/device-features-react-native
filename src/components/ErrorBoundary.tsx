import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassButton } from "./GlassButton";
import { GlassCard } from "./GlassCard";
import { ScreenGradient } from "./ScreenGradient";
import { SPACING } from "../constants/spacing";
import { ThemeContext } from "../context/ThemeContext";

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.PureComponent<
  { children: React.ReactNode },
  State
> {
  static contextType = ThemeContext;

  state: State = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }

  componentDidCatch() {
    // Intentionally minimal: production apps would report to telemetry here.
  }

  private reset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    const theme = (this.context as React.ContextType<typeof ThemeContext>)?.theme;
    if (!this.state.hasError) return this.props.children;

    return (
      <ScreenGradient>
        <View style={styles.center}>
          <GlassCard>
            <Text
              style={[
                styles.title,
                { color: theme?.textPrimary ?? "black" },
              ]}
            >
              Something went wrong
            </Text>
            <Text
              style={[
                styles.body,
                { color: theme?.textSecondary ?? "black" },
              ]}
            >
              {this.state.message}
            </Text>
            <View style={styles.actions}>
              <GlassButton title="Try again" onPress={this.reset} />
            </View>
          </GlassCard>
        </View>
      </ScreenGradient>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: SPACING.sm,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    marginTop: SPACING.lg,
  },
});

