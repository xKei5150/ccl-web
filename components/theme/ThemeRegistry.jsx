"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { ThemeTransition } from "./ThemeTransition";

export function ThemeRegistry({ children }) {
  const { theme, presets } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only run theme effects after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme classes
  useEffect(() => {
    if (!mounted || !presets) return;

    const isDark = 
      theme.background === presets.dark?.background ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, [theme, presets, mounted]);

  // Avoid hydration mismatch by only rendering after mount
  if (!mounted) {
    return null;
  }

  return <ThemeTransition>{children}</ThemeTransition>;
}