import { COLORS, DARK_GRADIENT, LIGHT_GRADIENT } from "./colors";
import { DESIGN_TOKENS } from "./theme";

export type ThemeName = "light" | "dark";

export interface ThemeTokens {
  name: ThemeName;
  isDark: boolean;
  gradient: readonly [string, string, ...string[]];

  // Digital Brutalism palette
  background: string;
  surface: string;
  border: string;
  accent: string;
  accentAlt: string;
  accentText: string;
  dangerText: string;
  text: string;
  textMuted: string;
  fontFamily: string;

  // Backwards-compatible aliases (existing components may still read these).
  textPrimary: string;
  textSecondary: string;
  icon: string;

  glassFill: string;
  glassBorder: string;
  shadow: string;

  buttonFill: string;
  buttonFillPressed: string;

  danger: string;
  success: string;
  warning: string;

  fontSize: typeof DESIGN_TOKENS.fontSize;
  spacing: typeof DESIGN_TOKENS.spacing;
  radius: typeof DESIGN_TOKENS.borderRadius;

  modalBackdrop: {
    dark: string;
    light: string;
  };
}

export const LIGHT_THEME: ThemeTokens = {
  name: "light",
  isDark: false,
  gradient: [LIGHT_GRADIENT[0], LIGHT_GRADIENT[0]] as const,

  background: "#F5F5F0",
  surface: "#FFFFFF",
  border: "#000000",
  accent: "#FFE500",
  accentAlt: "#FF3B30",
  accentText: "#000000",
  dangerText: "#FFFFFF",
  text: "#000000",
  textMuted: "#555555",
  fontFamily: "monospace",

  textPrimary: "#000000",
  textSecondary: "#555555",
  icon: "#000000",

  glassFill: "#FFFFFF",
  glassBorder: "#000000",
  shadow: "transparent",

  buttonFill: "#FFFFFF",
  buttonFillPressed: "#FFFFFF",

  danger: "#FF3B30",
  success: COLORS.success,
  warning: COLORS.warning,
  fontSize: DESIGN_TOKENS.fontSize,
  spacing: DESIGN_TOKENS.spacing,
  radius: DESIGN_TOKENS.borderRadius,
  modalBackdrop: {
    dark: "rgba(0,0,0,0.85)",
    light: "rgba(0,0,0,0.5)",
  },
};

export const DARK_THEME: ThemeTokens = {
  name: "dark",
  isDark: true,
  gradient: [DARK_GRADIENT[0], DARK_GRADIENT[0]] as const,

  background: "#0A0A0A",
  surface: "#111111",
  border: "#FFFFFF",
  accent: "#FFE500",
  accentAlt: "#FF3B30",
  accentText: "#000000",
  dangerText: "#FFFFFF",
  text: "#FFFFFF",
  textMuted: "#888888",
  fontFamily: "monospace",

  textPrimary: "#FFFFFF",
  textSecondary: "#888888",
  icon: "#FFFFFF",

  glassFill: "#111111",
  glassBorder: "#FFFFFF",
  shadow: "transparent",

  buttonFill: "#111111",
  buttonFillPressed: "#111111",

  danger: "#FF3B30",
  success: COLORS.success,
  warning: COLORS.warning,
  fontSize: DESIGN_TOKENS.fontSize,
  spacing: DESIGN_TOKENS.spacing,
  radius: DESIGN_TOKENS.borderRadius,
  modalBackdrop: {
    dark: "rgba(0,0,0,0.85)",
    light: "rgba(0,0,0,0.5)",
  },
};

