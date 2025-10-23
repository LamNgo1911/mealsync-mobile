export const Colors = {
  light: {
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
    accent: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
      950: "#083344",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
    food: {
      protein: "#ef4444", // red-500
      carbs: "#f97316", // orange-500
      fat: "#eab308", // yellow-500
      veggie: "#22c55e", // green-500
    },
    success: "#22c55e",
    warning: "#f97316",
    error: "#ef4444",
    info: "#3b82f6",

    // Standard Colors
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",

    // New semantic colors for light theme
    background: "#ffffff",
    card: "#fafafa",
    text: "#171717",
    border: "#e5e5e5",
    input: "#f5f5f5",
    placeholder: "#a3a3a3",
  },
  dark: {
    primary: {
      50: "#052e16",
      100: "#0a3a23",
      200: "#105c38",
      300: "#167f4c",
      400: "#1da15f",
      500: "#22c55e", // Same as light's 500
      600: "#34d399",
      700: "#6ee7b7",
      800: "#a7f3d0",
      900: "#d1fae5",
      950: "#f0fdf4",
    },
    accent: {
      50: "#083344",
      100: "#164e63",
      200: "#155e75",
      300: "#0e7490",
      400: "#0891b2",
      500: "#06b6d4", // Base
      600: "#22d3ee",
      700: "#67e8f9",
      800: "#a5f3fc",
      900: "#cffafe",
      950: "#ecfeff",
    },
    neutral: {
      50: "#0a0a0a",
      100: "#171717",
      200: "#262626",
      300: "#404040",
      400: "#525252",
      500: "#737373",
      600: "#a3a3a3",
      700: "#d4d4d4",
      800: "#e5e5e5",
      900: "#f5f5f5",
      950: "#fafafa",
    },
    food: {
      protein: "#ef4444",
      carbs: "#f97316",
      fat: "#eab308",
      veggie: "#22c55e",
    },
    success: "#22c55e",
    warning: "#f97316",
    error: "#ef4444",
    info: "#3b82f6",

    // Standard Colors
    white: "#0a0a0a", // In dark mode, "white" is the primary background
    black: "#fafafa", // and "black" is the primary text color
    transparent: "transparent",

    // New semantic colors for dark theme
    background: "#0a0a0a",
    card: "#171717",
    text: "#fafafa",
    border: "#262626",
    input: "#262626",
    placeholder: "#525252",
  },
};

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  20: 80,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
};

export const FontWeights = {
  normal: "400" as "400",
  medium: "500" as "500",
  semibold: "600" as "600",
  bold: "700" as "700",
};

export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
};

export const Fonts = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  art: "PlayfairDisplay_700Bold",
};
