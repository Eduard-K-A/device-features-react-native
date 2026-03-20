export const DESIGN_TOKENS = {
  borderRadius: { sm: 8, md: 16, lg: 24, xl: 32 },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  fontSize: { caption: 11, body: 14, subheading: 16, heading: 20, title: 26 },
  glass: {
    background: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.20)",
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
  },
} as const;

