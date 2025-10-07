/**
 * MealSync App Color System
 *
 * This file provides a centralized color system for the entire app.
 * Use these colors for consistent branding and theming.
 */

export const Colors = {
  // Primary Brand Colors (Blue)
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Main brand blue
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Secondary/Accent Colors (Green)
  accent: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Emerald green for success/scan
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },

  // Food/Warm Colors (Yellow/Orange)
  food: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308", // Warm yellow
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
  },

  // Neutral/Gray System
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Status Colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",

  // Common Usage Colors
  background: "#ffffff",
  surface: "#f8fafc",
  text: {
    primary: "#0f172a",
    secondary: "#64748b",
    tertiary: "#94a3b8",
    inverse: "#ffffff",
  },
  border: "#e2e8f0",
  input: "#f1f5f9",
  placeholder: "#94a3b8",
} as const;

// Usage Examples for NativeWind classes:
export const ColorUsage = {
  // Buttons
  primaryButton: "bg-primary-500 text-white",
  secondaryButton: "bg-accent-500 text-white",
  outlineButton: "border-2 border-primary-500 text-primary-500",

  // Backgrounds
  screenBackground: "bg-white",
  cardBackground: "bg-neutral-50",

  // Text
  headingText: "text-neutral-900",
  bodyText: "text-neutral-700",
  mutedText: "text-neutral-500",

  // Status
  successText: "text-accent-600",
  errorText: "text-red-500",
  warningText: "text-yellow-600",

  // Interactive
  linkText: "text-primary-600",
  activeState: "bg-primary-100",
} as const;

export default Colors;
