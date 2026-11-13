import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { isDark, colors, toggleTheme } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      style={{
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Ionicons
        name={isDark ? "sunny-outline" : "moon-outline"}
        size={18}
        color={colors.text}
      />
    </TouchableOpacity>
  );
}
