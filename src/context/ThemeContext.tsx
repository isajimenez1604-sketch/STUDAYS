import React, { createContext, useContext, useState } from "react";

export type ThemeColors = {
  background: string;
  surface: string;
  input: string;
  text: string;
  secondaryText: string;
  border: string;
  iconBackground: string;
};

const lightColors: ThemeColors = {
  background: "#F0F9FF",
  surface: "#FFFFFF",
  input: "#FFFFFF",
  text: "#1F2937",
  secondaryText: "#64748B",
  border: "#E2E8F0",
  iconBackground: "#DBEAFE",
};

const darkColors: ThemeColors = {
  background: "#0F172A",
  surface: "#1E293B",
  input: "#0F172A",
  text: "#F8FAFC",
  secondaryText: "#CBD5E1",
  border: "#334155",
  iconBackground: "#1E3A5F",
};

type ThemeContextValue = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [isDark, setIsDark] = useState(false);
  const value = {
    isDark,
    colors: isDark ? darkColors : lightColors,
    toggleTheme: () => setIsDark((current) => !current),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useAppTheme debe usarse dentro de ThemeProvider");
  }
  return value;
}
