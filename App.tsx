import React from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "./src/context/ThemeContext";
import { EntryProvider } from "./src/context/EntryContext";
import { RootNavigator } from "./src/components/RootNavigator";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { useTheme } from "./src/context/useTheme";

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <EntryProvider>
        <ErrorBoundary>
          <ThemedStatusBar />
          <RootNavigator />
        </ErrorBoundary>
      </EntryProvider>
    </ThemeProvider>
  );
}

