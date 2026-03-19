import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { DARK_THEME, LIGHT_THEME, type ThemeTokens } from "../constants/themeTokens";
import { STORAGE_KEYS } from "../types/storage";
import { safeGetItem, safeSetItem } from "../utils/storage";

export interface ThemeContextValue {
  isDark: boolean;
  theme: ThemeTokens;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function parseThemeName(raw: string | null): "light" | "dark" | null {
  if (!raw) return null;
  if (raw === "light" || raw === "dark") return raw;
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const saved = await safeGetItem(STORAGE_KEYS.theme);
      if (!isMounted) return;
      const name = parseThemeName(saved);
      if (name) setIsDark(name === "dark");
      setIsHydrated(true);
    })().catch(() => {
      if (!isMounted) return;
      setIsHydrated(true);
      Alert.alert("Theme", "Failed to load theme. Using default.");
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const theme = useMemo<ThemeTokens>(() => (isDark ? DARK_THEME : LIGHT_THEME), [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      void safeSetItem(STORAGE_KEYS.theme, next ? "dark" : "light");
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      theme,
      toggleTheme,
    }),
    [isDark, theme, toggleTheme]
  );

  // Render children immediately; hydration just affects initial theme choice.
  // Keeping this non-blocking avoids blank screen on slow storage.
  void isHydrated;

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

