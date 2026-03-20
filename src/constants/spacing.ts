import { DESIGN_TOKENS } from "./theme";

export const SPACING = {
  ...DESIGN_TOKENS.spacing,
  xxl: DESIGN_TOKENS.spacing.xl,
} as const;

export const RADIUS = DESIGN_TOKENS.borderRadius;

