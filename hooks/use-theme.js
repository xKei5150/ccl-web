"use client";

import React, { createContext, useContext, useState } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Initial theme values matching your form's default values
const defaultTheme = {
  tableHeaderColor: "#8E9196",
  tableItemColor: "#F1F1F1",
  primaryButtonColor: "#9b87f5",
  secondaryButtonColor: "#7E69AB",
  pageBackgroundColor: "#F1F0FB",
  sidebarColor: "#1A1F2C",
  textColor: "#222222",
  logo: "",
};

// Create the Theme Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    // You could also save to localStorage here if you want persistence
    localStorage.setItem('appTheme', JSON.stringify(newTheme));
  };

  // Load theme from localStorage on initial mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}