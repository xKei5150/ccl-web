"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

export const themePresets = {
  default: {
    background: "#FFFFFF",
    foreground: "#0A0A0A",
    card: "#FFFFFF",
    cardForeground: "#0A0A0A",
    popover: "#FFFFFF",
    popoverForeground: "#0A0A0A",
    primary: "#171717",
    primaryForeground: "#FAFAFA",
    secondary: "#F5F5F5",
    secondaryForeground: "#171717",
    muted: "#F5F5F5",
    mutedForeground: "#737373",
    accent: "#F5F5F5",
    accentForeground: "#171717",
    destructive: "#EF4444",
    destructiveForeground: "#FAFAFA",
    border: "#E5E5E5",
    input: "#E5E5E5",
    ring: "#0A0A0A",
    sidebarBackground: "#FAFAFA",
    sidebarForeground: "#404040",
    sidebarPrimary: "#171717",
    sidebarPrimaryForeground: "#FAFAFA",
    sidebarAccent: "#F4F4F5",
    sidebarAccentForeground: "#171717",
    sidebarBorder: "#E4E4E7",
  },
  dark: {
    background: "#0A0A0A",
    foreground: "#FAFAFA",
    card: "#0A0A0A",
    cardForeground: "#FAFAFA",
    popover: "#0A0A0A",
    popoverForeground: "#FAFAFA",
    primary: "#FAFAFA",
    primaryForeground: "#171717",
    secondary: "#262626",
    secondaryForeground: "#FAFAFA",
    muted: "#262626",
    mutedForeground: "#A3A3A3",
    accent: "#262626",
    accentForeground: "#FAFAFA",
    destructive: "#7F1D1D",
    destructiveForeground: "#FAFAFA",
    border: "#262626",
    input: "#262626",
    ring: "#D4D4D4",
    sidebarBackground: "#171717",
    sidebarForeground: "#F4F4F5",
    sidebarPrimary: "#3B82F6",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#27272A",
    sidebarAccentForeground: "#F4F4F5",
    sidebarBorder: "#27272A",
  },
  light: {
    background: "#FAFAFA",
    foreground: "#171717",
    card: "#FFFFFF",
    cardForeground: "#171717",
    popover: "#FFFFFF",
    popoverForeground: "#171717",
    primary: "#2563EB",
    primaryForeground: "#FFFFFF",
    secondary: "#F5F5F5",
    secondaryForeground: "#171717",
    muted: "#F5F5F5",
    mutedForeground: "#737373",
    accent: "#F5F5F5",
    accentForeground: "#171717",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#E5E5E5",
    input: "#E5E5E5",
    ring: "#2563EB",
    sidebarBackground: "#FFFFFF",
    sidebarForeground: "#737373",
    sidebarPrimary: "#2563EB",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#F5F5F5",
    sidebarAccentForeground: "#171717",
    sidebarBorder: "#E5E5E5",
  },
  modern: {
    background: "#FFFFFF",
    foreground: "#18181B",
    card: "#FFFFFF",
    cardForeground: "#18181B",
    popover: "#FFFFFF",
    popoverForeground: "#18181B",
    primary: "#8B5CF6",
    primaryForeground: "#FFFFFF",
    secondary: "#F4F4F5",
    secondaryForeground: "#18181B",
    muted: "#F4F4F5",
    mutedForeground: "#71717A",
    accent: "#F4F4F5",
    accentForeground: "#18181B",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#E4E4E7",
    input: "#E4E4E7",
    ring: "#8B5CF6",
    sidebarBackground: "#FFFFFF",
    sidebarForeground: "#71717A",
    sidebarPrimary: "#8B5CF6",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#F4F4F5",
    sidebarAccentForeground: "#18181B",
    sidebarBorder: "#E4E4E7",
  }
};

function themeReducer(state, action) {
  switch (action.type) {
    case "UPDATE_THEME":
      return { ...state, ...action.payload };
    case "LOAD_PRESET":
      return action.preset ? { ...themePresets[action.preset] } : state;
    default:
      return state;
  }
}

const ThemeContext = createContext({
  theme: themePresets.default,
  updateTheme: () => {},
  loadPreset: () => {},
  themePresets: themePresets,
});

export function ThemeProvider({ children }) {
  const [theme, dispatch] = useReducer(themeReducer, themePresets.default);

  useEffect(() => {
    // Load saved theme or system preference
    const savedTheme = localStorage.getItem("appTheme");
    const savedPreset = localStorage.getItem("appThemePreset");
    
    if (savedTheme) {
      dispatch({ type: "UPDATE_THEME", payload: JSON.parse(savedTheme) });
    } else if (savedPreset && themePresets[savedPreset]) {
      dispatch({ type: "LOAD_PRESET", preset: savedPreset });
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        dispatch({ type: "LOAD_PRESET", preset: "dark" });
      }
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage and apply CSS variables
    localStorage.setItem("appTheme", JSON.stringify(theme));
    
    // Apply CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      document.documentElement.style.setProperty(`--${cssKey}`, value);
    });
  }, [theme]);

  const updateTheme = (newTheme) => {
    dispatch({ type: "UPDATE_THEME", payload: newTheme });
  };

  const loadPreset = (presetName) => {
    if (themePresets[presetName]) {
      localStorage.setItem("appThemePreset", presetName);
      dispatch({ type: "LOAD_PRESET", preset: presetName });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, loadPreset, themePresets }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}