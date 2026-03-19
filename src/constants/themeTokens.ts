import { COLORS, DARK_GRADIENT, GLASS, LIGHT_GRADIENT } from "./colors";

export type ThemeName = "light" | "dark";

export interface ThemeTokens {
  name: ThemeName;
  isDark: boolean;
  gradient: readonly [string, string, ...string[]];

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
}

export const LIGHT_THEME: ThemeTokens = {
  name: "light",
  isDark: false,
  gradient: LIGHT_GRADIENT,

  textPrimary: COLORS.navy,
  textSecondary: "rgba(11,27,58,0.75)",
  icon: "rgba(11,27,58,0.85)",

  glassFill: "rgba(255,255,255,0.55)",
  glassBorder: "rgba(255,255,255,0.80)",
  shadow: "rgba(0,0,0,0.10)",

  buttonFill: "rgba(255,255,255,0.45)",
  buttonFillPressed: "rgba(255,255,255,0.35)",

  danger: COLORS.danger,
  success: COLORS.success,
  warning: COLORS.warning,
};

export const DARK_THEME: ThemeTokens = {
  name: "dark",
  isDark: true,
  gradient: DARK_GRADIENT,

  textPrimary: COLORS.nearWhite,
  textSecondary: "rgba(255,255,255,0.72)",
  icon: "rgba(255,255,255,0.85)",

  glassFill: GLASS.fill,
  glassBorder: GLASS.border,
  shadow: GLASS.shadow,

  buttonFill: "rgba(255,255,255,0.14)",
  buttonFillPressed: "rgba(255,255,255,0.10)",

  danger: COLORS.danger,
  success: COLORS.success,
  warning: COLORS.warning,
};

