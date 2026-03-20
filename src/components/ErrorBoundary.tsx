import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassButton } from "./Button";
import { Card } from "./Card";
import { ScreenGradient } from "./ScreenGradient";
import { SPACING } from "../constants/spacing";
import { ThemeContext } from "../context/ThemeContext";
import { LIGHT_THEME } from "../constants/themeTokens";

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
    const theme = (this.context as React.ContextType<typeof ThemeContext>)?.theme ?? LIGHT_THEME;
    if (!this.state.hasError) return this.props.children;

    return (
      <ScreenGradient>
        <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
          <View style={styles.center}>
            <Card>
            <Text
              style={[
                styles.title,
                { color: theme.textPrimary },
              ]}
            >
              Something went wrong
            </Text>
            <Text
              style={[
                styles.body,
                { color: theme.textSecondary },
              ]}
            >
              {this.state.message}
            </Text>
            <View style={styles.actions}>
              <GlassButton title="Try again" onPress={this.reset} variant="secondary" />
            </View>
            </Card>
          </View>
        </SafeAreaView>
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
  safe: {
    flex: 1,
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

