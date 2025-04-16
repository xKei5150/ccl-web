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
    chart1: "#FF6B6B",
    chart2: "#4ECDC4",
    chart3: "#45B7D1",
    chart4: "#96C93D",
    chart5: "#FF9F43",
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
    chart1: "#4287F5",
    chart2: "#2ECC71",
    chart3: "#F1C40F",
    chart4: "#9B59B6",
    chart5: "#E74C3C",
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
    chart1: "#2563EB",
    chart2: "#10B981",
    chart3: "#FBBF24",
    chart4: "#8B5CF6",
    chart5: "#EF4444",
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
    chart1: "#8B5CF6", 
    chart2: "#06B6D4",
    chart3: "#F59E0B",
    chart4: "#10B981",
    chart5: "#EF4444",
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

export function ThemeProvider({ children, initialTheme }) {
  const [theme, dispatch] = useReducer(
    themeReducer, 
    initialTheme || themePresets.default
  );

  useEffect(() => {
    if (!initialTheme) {
      dispatch({ type: "LOAD_PRESET", preset: "default" });
    }
  }, [initialTheme]);

  useEffect(() => {
    // Apply CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      if (!value) return; // Skip undefined values
      
      // Special handling for chart colors which use a different naming convention in CSS
      if (key.startsWith('chart') && /chart[1-5]/.test(key)) {
        const chartNum = key.replace('chart', '');
        document.documentElement.style.setProperty(`--chart-${chartNum}`, value);
      } else {
        // Normal handling for other variables
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        document.documentElement.style.setProperty(`--${cssKey}`, value);
      }
    });
    
    // Handle special case for chart colors from server
    if (theme['chart-1']) document.documentElement.style.setProperty('--chart-1', theme['chart-1']);
    if (theme['chart-2']) document.documentElement.style.setProperty('--chart-2', theme['chart-2']);
    if (theme['chart-3']) document.documentElement.style.setProperty('--chart-3', theme['chart-3']);
    if (theme['chart-4']) document.documentElement.style.setProperty('--chart-4', theme['chart-4']);
    if (theme['chart-5']) document.documentElement.style.setProperty('--chart-5', theme['chart-5']);
    
  }, [theme]);

  const updateTheme = async (newTheme) => {
    // Convert kebab-case chart colors to camelCase for state consistency
    const formattedTheme = {...newTheme};
    
    if (formattedTheme['chart-1']) {
      formattedTheme.chart1 = formattedTheme['chart-1'];
    }
    if (formattedTheme['chart-2']) {
      formattedTheme.chart2 = formattedTheme['chart-2'];
    }
    if (formattedTheme['chart-3']) {
      formattedTheme.chart3 = formattedTheme['chart-3'];
    }
    if (formattedTheme['chart-4']) {
      formattedTheme.chart4 = formattedTheme['chart-4'];
    }
    if (formattedTheme['chart-5']) {
      formattedTheme.chart5 = formattedTheme['chart-5'];
    }
    
    // Update the theme state with the data received from the server action
    dispatch({ type: "UPDATE_THEME", payload: formattedTheme });
    return formattedTheme;
  };

  const loadPreset = (presetName) => {
    if (themePresets[presetName]) {
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